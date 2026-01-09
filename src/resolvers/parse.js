
function normalizeField(s) {
  return s.toLowerCase().trim();
}

function stripFieldPrefix(line, field) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${escaped}\\s*[:?]?\\s*`, 'i');
  return line.replace(re, '').trim();
}

export function parseSections(flatText, fields) {
  const sections = {};
  const fieldSet = new Map(
    (fields || []).map((f) => [normalizeField(f), f])
  );

  let currentField = null;

  const lines = (flatText || '').split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line && currentField) {
      // keep paragraph breaks inside a section
      if (sections[currentField] && !sections[currentField].endsWith('\n')) {
        sections[currentField] += '\n';
      }
      continue;
    }

    // Detect field start: line begins with any known field
    let matchedOriginalField = null;

    for (const [norm, original] of fieldSet.entries()) {
      if (line.toLowerCase().startsWith(norm)) {
        matchedOriginalField = original;
        break;
      }
    }

    if (matchedOriginalField) {
      currentField = matchedOriginalField;
      const initialValue = stripFieldPrefix(line, matchedOriginalField);
      sections[currentField] = initialValue; // may be empty, that's fine
      continue;
    }

    // If we’re inside a section, append the line
    if (currentField) {
      const existing = sections[currentField] || '';
      sections[currentField] = existing
        ? `${existing}\n${line}`
        : line;
    }
  }

  // Final cleanup: normalize whitespace
  for (const key of Object.keys(sections)) {
    sections[key] = sections[key]
      .split('\n')
      .map((l) => l.trim())
      .join('\n')
      .trim();
  }
  return sections;
}