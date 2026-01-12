export function flattenAdf(nodes) {
  let output = '';

  const append = (s) => { output += s; };

  const walk = (node) => {
    if (!node) return;

    switch (node.type) {
      case 'text': {
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
          append(`${idx}. `);
          walk(listItem);
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
        (node.content || []).forEach(walk);
        return;
      }

      default: {
        // recursively walk the content for nested
        (node.content || []).forEach(walk);
      }
    }
  };

  (nodes || []).forEach(walk);

  // whitespace removal
  console.log("OUTPUT", output)
  return output
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')   // trim trailing whitespace per line
    .replace(/\n{3,}/g, '\n\n')   // collapse blank gaps
    .trim();
}
