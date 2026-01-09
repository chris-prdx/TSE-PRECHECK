import React, { useState } from 'react';
import ForgeReconciler, { Stack, Text, Button, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const context = useProductContext();
  const issueKey = context?.extension?.issue?.key; // pulls the context from the issue view.
  const [result, setResult] = useState(null);

  console.log("issuekey", context?.extension?.issue?.key)

  const runValidation = async () => {
    const res = await invoke('validateIntake', { issueKey });
    setResult(res);
  };

return (
    <Stack space="space.200">
      <Button onClick={runValidation} appearance="primary">
        Run Intake Check
      </Button>

      {result && (
        <>
          <Text>
            Status: {result.status}
          </Text>

          {result.errors?.length > 0 && (
            <>
              <Text>Missing / invalid:</Text>
              {result.errors.map((e, i) => (
                <Text key={i}>- {e}</Text>
              ))}
            </>
          )}

          {result.warnings?.length > 0 && (
            <>
              <Text>Warnings:</Text>
              {result.warnings.map((w, i) => (
                <Text key={i}>- {w}</Text>
              ))}
            </>
          )}
        </>
      )}
    </Stack>
  );
};

ForgeReconciler.render(<App />);