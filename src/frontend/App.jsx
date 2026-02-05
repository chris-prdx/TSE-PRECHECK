import React, { useState } from 'react';
import ForgeReconciler, { Stack, Text, Button, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const context = useProductContext();
  const issueKey = context?.extension?.issue?.key; // pulls the context from the issue view.
  const [result, setResult] = useState(null);

  console.log("issuekey", context?.extension?.issue?.key)

  const runValidation = async () => {
    console.log("Invoking validation for issueKey:", issueKey);
    const res = await invoke('validateIntake', { issueKey });
    setResult(res);
  };

return (
    <Stack space="space.200">
      <Button onClick={runValidation} appearance="primary">
        Run Intake Check
      </Button>
    </Stack>
  );
};

ForgeReconciler.render(<App />);