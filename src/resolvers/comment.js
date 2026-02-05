
const ICONS = {
  pass: '✅',
  blocker: '⛔',
  note: 'ℹ️',
};

export function buildComment({ errors = [], warnings = [] }) {
  const content = [];


  const greet = [];
  greet.push({ type: 'text', text: 'Hi there, ' });
  greet.push({ type: 'text', text: 'intake validation results are below.' });

  content.push({ type: 'paragraph', content: greet });

  if (errors.length > 0) {
    content.push(boldLine('Required updates', ICONS.blocker));
    content.push(bulletList(errors));
  } else {
    content.push(boldLine('Required info present', ICONS.pass));
  }

  if (warnings.length > 0) {
    content.push(boldLine('Recommendations to speed up triage', ICONS.note));
    content.push(bulletList(warnings));
  }

  content.push({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text:
          errors.length > 0 || warnings.length > 0
            ? 'Please update the ticket description with the information, if necessary.'
            : 'No blockers found. You can proceed with triage.',
      },
    ],
  });

  return { version: 1, type: 'doc', content };
}

export async function  pushComment(comment, issueKey) {
   await api.asApp().requestJira(
    route`/rest/api/3/issue/${issueKey}/comment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    }
  );
}

function bulletList(items = []) {
  return {
    type: 'bulletList',
    content: items.map((item) => ({
      type: 'listItem',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: item,
            },
          ],
        },
      ],
    })),
  };
}

function boldLine(text, icon = ICONS.note) {
  return {
    type: 'paragraph',
    content: [
      { type: 'text', 
        text: `${icon} ` 
      },
      {
        type: 'text',
        text,
        marks: [{ type: 'strong' }],
      },
    ],
  };
}