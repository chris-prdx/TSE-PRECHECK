import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('postComment', async ({ payload }) => {
  const { issueKey, comment } = payload;
  const response = await api.asApp().requestJira(
    route`/rest/api/3/issue/${issueKey}/comment`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: comment }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to post comment: ${response.status}`);
  }
  return { ok: true };
});

// Applies/removes labels on the issue to record the outcome of the intake
resolver.define('updateLabels', async ({ payload }) => {
  const { issueKey, addLabels = [], removeLabels = [] } = payload;

  const update = [
    ...addLabels.map((label) => ({ add: label })),
    ...removeLabels.map((label) => ({ remove: label })),
  ];

  if (update.length === 0) {
    return { ok: true };
  }

  const response = await api.asApp().requestJira(
    route`/rest/api/3/issue/${issueKey}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update: { labels: update } }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update labels: ${response.status}`);
  }
  return { ok: true };
});

export const handler = resolver.getDefinitions();