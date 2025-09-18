import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('runPreflight', async (req) => {
  const issueKey = req?.context?.issue?.key; // panel context
  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=summary`);
  const json = await res.json();
  return { message: `Checked ${json?.fields?.summary || issueKey}` };
});

export const handler = resolver.getDefinitions();