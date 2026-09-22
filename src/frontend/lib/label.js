import { invoke } from '@forge/bridge';

// Labels applied to the issue after an intake check run, tracking whether the
// APP ran to completion 
export const RUN_LABELS = {
  SUCCESS: 'tse-precheck-run-success',
  FAILED: 'tse-precheck-run-failed',
};

const ALL_RUN_LABELS = Object.values(RUN_LABELS);

// Adds `label` and strips any other run-outcome label left over from a
// previous run, so the issue only ever carries one of them at a time.
export async function applyRunLabel(issueKey, label) {
  const removeLabels = ALL_RUN_LABELS.filter((existing) => existing !== label);
  await invoke('updateLabels', { issueKey, addLabels: [label], removeLabels });
}