import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

import { getTemplateForIssueType } from './templates';
import { flattenAdf } from './flatten';
import { parseSections } from './parse';
import { validateSections } from './validate';
import { buildComment } from './comment';

const resolver = new Resolver();

resolver.define('validateIntake', async ({ payload }) => {
  const { issueKey } = payload;
  console.log('Preflight function invoked with payload:', payload);

  if (!issueKey) {
    return {
      status: 'blocked',
      errors: ['Missing issueKey from UI context'],
      warnings: [],
    };
  }

  const resp = await api
    .asUser()
    .requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,reporter,issuetype`
    );

  if (!resp.ok) {
    return {
      status: 'blocked',
      errors: [`Failed to fetch issue: ${resp.status}`],
      warnings: [],
    };
  }

  const issue = await resp.json();
  const issueTypeName = issue.fields?.issuetype?.name || 'Bug';
  const template = getTemplateForIssueType(issueTypeName);
  const description = issue.fields?.description;
  const nodes = description?.content || [];

  const flatText = flattenAdf(nodes);
  const sections = parseSections(flatText, template.anchors);

  const { errors, warnings } = validateSections(sections, template);

  return {
    issueTypeName,
    errors,
    warnings,
  };
});


const reporterId = data?.fields?.reporter?.accountId || null;

  const adfBody =
  missingFields.length === 0
    ? buildOkAdf()
    : buildNeedsInfoAdf(reporterId, missingFields);

    const commentRes = await api.asApp().requestJira(
      route`/rest/api/3/issue/${issueKey}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: adfBody }),
      }
    );

export const handler = resolver.getDefinitions();
