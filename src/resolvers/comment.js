export function buildComment({ reporterAccountId, errors = [], warnings = [], runId }) {
  const content = [];


  const greet = [];
  if (reporterAccountId) {
    greet.push({ type: 'mention', attrs: { id: reporterAccountId } });
    greet.push({ type: 'text', text: ', ' });
  } else {
    greet.push({ type: 'text', text: 'Hi there, ' });
  }
  greet.push({ type: 'text', text: 'intake validation results are below.' });

  content.push({ type: 'paragraph', content: greet });

  if (errors.length > 0) {
    content.push(boldLine('[BLOCKER] Required updates'));
    content.push(bulletList(errors));
  } else {
    content.push(boldLine('[PASS] Required info present'));
  }

  if (warnings.length > 0) {
    content.push(boldLine('[NOTE] Recommendations to speed up triage'));
    content.push(bulletList(warnings));
  }

  content.push({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text:
          errors.length > 0
            ? 'Please update the ticket description with the information, if necessary.'
            : 'No blockers found. If you address the notes above, we can move faster during triage.',
      },
    ],
  });

  return { version: 1, type: 'doc', content };
}
