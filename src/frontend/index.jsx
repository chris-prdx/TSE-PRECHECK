import React, { useState } from 'react';
import ForgeReconciler, { IssuePanel, Text, Button, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';

/**  In case we need to use this for testing */
// const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || "";

const App = () => {
  const test = useProductContext();
  console.log(test)
  const issueKey = "CS-1";
  const [status, setStatus] = useState('');

  const onClick = async () => {
    setStatus('Running…');
    const result = await invoke('runPreflight', { issueKey });
    setStatus(result?.ok ? `Done. Summary: ${result.summary}` : 'Failed');
  };
/** UI Panel */
  return (
    <IssuePanel>
      <Text>Run the TSE pre-flight checklist on {issueKey}</Text>
      <Button text="Run Pre-flight" onClick={onClick} />
      {status && <Text>{status}</Text>}
    </IssuePanel>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export const run = render(<Panel />);

/** Trigger handler (headless) */
// export const onCreate = async (event) => {
//   const issueKey = event.issue?.key;
//   if (!issueKey) return;
//   await runCheck(issueKey);
// };