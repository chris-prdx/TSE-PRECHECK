import bug from './bug';

const TEMPLATE_MAP = {
  Bug: bug,
};

export function getTemplateForIssueType(issueTypeName) {
  if (!issueTypeName) return bug;

  const normalized = issueTypeName.trim();

  return TEMPLATE_MAP[normalized] || bug;
}