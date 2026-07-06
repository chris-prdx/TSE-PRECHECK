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

export const handler = resolver.getDefinitions();