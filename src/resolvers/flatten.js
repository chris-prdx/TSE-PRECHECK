export function flattenAdf(nodes) {
  let output = '';

  const append = (s) => { output += s; };

  const walk = (node) => {
    if (!node) return;

    switch (node.type) {
      case 'text': {
        // Keep visible text only
        append(node.text || '');
        return;
      }

      case 'hardBreak': {
        append('\n');
        return;
      }

      case 'paragraph': {
        (node.content || []).forEach(walk);
        append('\n');
        return;
      }

      case 'orderedList': {
        let idx = node.attrs?.order ?? 1;

        (node.content || []).forEach((listItem) => {
          // One line per list item
          append(`${idx}. `);
          walk(listItem);
          // Ensure list item ends with newline
          if (!output.endsWith('\n')) append('\n');
          idx += 1;
        });
        return;
      }

      case 'bulletList': {
        (node.content || []).forEach((listItem) => {
          append('- ');
          walk(listItem);
          if (!output.endsWith('\n')) append('\n');
        });
        return;
      }

      case 'listItem': {
        // A listItem usually contains paragraphs
        (node.content || []).forEach(walk);
        return;
      }

      default: {
        // Fallback: recurse into nested content
        (node.content || []).forEach(walk);
      }
    }
  };

  (nodes || []).forEach(walk);

  // whitespace normalization
  console.log("OUTPUT", output)
  return output
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')   // trim trailing whitespace per line
    .replace(/\n{3,}/g, '\n\n')   // collapse blank gaps
    .trim();
}
