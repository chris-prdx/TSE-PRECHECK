function isBlank(val) {
  if (val == null) return true;
  const s = String(val).trim();
  if (!s) return true;

  // Treat these as empty for validation purposes
  const emptyTokens = new Set(['n/a', 'na', 'none', 'null', 'unknown', 'tbd']);
  return emptyTokens.has(s.toLowerCase());
}

function extractUrls(text) {
  const matches = String(text || '').match(/https?:\/\/\S+/g);
  return matches ? matches.map(m => m.replace(/[),.]+$/, '')) : [];
}

export function validateSections(sections, template) {

  const errors = [];
  const warnings = [];

  const required = template.required || [];
  const conditionalRequired = template.conditionalRequired || [];
  const rules = template.rules || [];
  const warningRules = template.warningRules || [];

  // 1) Required fields
  for (const field of required) {
    if (isBlank(sections[field])) {
      errors.push(`Missing or empty section: ${field}`);
    }
  }

  // 2) Conditional required fields
  for (const rule of conditionalRequired) {
    if (typeof rule.when === 'function' && rule.when(sections)) {
      if (isBlank(sections[rule.require])) {
        errors.push(rule.message || `Missing required section: ${rule.require}`);
      }
    }
  }

  // 3) Hard rules
  for (const rule of rules) {
    const ok = typeof rule.check === 'function' ? rule.check(sections) : true;
    if (!ok) errors.push(rule.message || 'Validation rule failed');
  }

  // 4) Warnings (non-blocking)
  for (const rule of warningRules) {
    const ok = typeof rule.check === 'function' ? rule.check(sections) : true;
    if (!ok) warnings.push(rule.message || 'Warning rule triggered');
  }

  // 5) URL validation or common checks
  if (!isBlank(sections['Related Links'])) {
    const urls = extractUrls(sections['Related Links']);
    if (!urls.length) {
      errors.push('Related Links must contain at least one valid URL');
    }
  }

  // Steps have no numbering
  if (!isBlank(sections['Steps to Reproduce'])) {
    const hasNumberedStep = /^\s*\d+\.\s+/m.test(sections['Steps to Reproduce']);
    if (!hasNumberedStep) warnings.push('Steps to Reproduce does not appear to include numbered steps');
  }

  // Expected == Actual
  if (!isBlank(sections['Expected Result']) && !isBlank(sections['Actual Result'])) {
    if (sections['Expected Result'].trim() === sections['Actual Result'].trim()) {
      warnings.push('Expected Result and Actual Result are identical');
    }
  }
  console.log("VALIDATION", { errors, warnings });
  return { errors, warnings };
}
