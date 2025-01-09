import { Command, Extension, RawCommands } from '@tiptap/core';

const IndentationCommands = Extension.create({
  name: 'indentationCommands',

  addCommands() {
    return {
      indent: (): Command => ({ commands }) => {
        return commands.command(({ tr, state }) => {
          const { selection } = state;
          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.isTextblock) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                style: `margin-left: ${parseInt(node.attrs.style?.marginLeft || '0') + 20}px`,
              });
            }
          });
          return true;
        });
      },
      outdent: (): Command => ({ commands }) => {
        return commands.command(({ tr, state }) => {
          const { selection } = state;
          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.isTextblock) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                style: `margin-left: ${Math.max(parseInt(node.attrs.style?.marginLeft || '0') - 20, 0)}px`,
              });
            }
          });
          return true;
        });
      },
    } as Partial<RawCommands>;
  },
});

export default IndentationCommands;