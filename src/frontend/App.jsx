import React, { useState } from 'react';
import ForgeReconciler, {
  Stack,
  Text,
  Button,
  SectionMessage,
  List,
  ListItem,
  useProductContext,
} from '@forge/react';
import { requestJira } from '@forge/bridge';

// All of the intake-check logic lives in plain JavaScript modules that run
// locally inside the UI Kit frontend (the user's browser)
import { getTemplateForIssueType } from './lib/templates';
import { flattenAdf } from './lib/flatten';
import { parseSections } from './lib/parse';
import { validateSections } from './lib/validate';
import { buildComment, pushComment } from './lib/comment';

const App = () => {
  const context = useProductContext();
  const issueKey = context?.extension?.issue?.key; // pulls the context from the issue view.
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  const runValidation = async () => {
    if (!issueKey) {
      setStatus('error');
      setErrorMessage('Missing issue key from the UI context.');
      return;
    }

    setStatus('running');
    setErrorMessage(null);

    try {
      // 1) Fetch the issue.
      const response = await requestJira(
        `/rest/api/3/issue/${issueKey}?fields=summary,description,reporter,issuetype`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch issue: ${response.status}`);
      }

      const issue = await response.json();

      // 2) Pick the template, flatten the description ADF to text, parse it into
      //    sections, and validate it
      const issueTypeName = issue.fields?.issuetype?.name || 'Bug';
      const template = getTemplateForIssueType(issueTypeName);
      const nodes = issue.fields?.description?.content || [];

      const flatText = flattenAdf(nodes);
      const sections = parseSections(flatText, template.fields);
      const { errors, warnings } = validateSections(sections, template);

      // 3) Build and post the results comment back onto the ticket.
      const comment = buildComment({ errors, warnings });
      await pushComment(comment, issueKey);

      setResult({ errors, warnings });
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong running the check.');
    }
  };

  return (
    <Stack space="space.200">
      <Button
        onClick={runValidation}
        appearance="primary"
        isDisabled={status === 'running'}
      >
        {status === 'running' ? 'Running…' : 'Run Intake Check'}
      </Button>

      {status === 'error' && (
        <SectionMessage title="Intake check failed" appearance="error">
          <Text>{errorMessage}</Text>
        </SectionMessage>
      )}

      {status === 'done' && result && result.errors.length === 0 && (
        <SectionMessage title="No blockers found" appearance="success">
          <Text>
            Required info is present. A summary comment has been added to the
            ticket.
          </Text>
        </SectionMessage>
      )}

      {status === 'done' && result && result.errors.length > 0 && (
        <SectionMessage title="Required updates" appearance="error">
          <List type="unordered">
            {result.errors.map((error, index) => (
              <ListItem key={index}>{error}</ListItem>
            ))}
          </List>
        </SectionMessage>
      )}

      {status === 'done' && result && result.warnings.length > 0 && (
        <SectionMessage title="Recommendations" appearance="warning">
          <List type="unordered">
            {result.warnings.map((warning, index) => (
              <ListItem key={index}>{warning}</ListItem>
            ))}
          </List>
        </SectionMessage>
      )}
    </Stack>
  );
};

ForgeReconciler.render(<App />);