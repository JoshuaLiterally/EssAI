// src/extensions/PersistentSelection.js
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const PersistentSelection = Extension.create({
  name: 'persistentSelection',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('persistentSelection'),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const { from, to, empty } = selection;

            if (empty) {
              return null;
            }

            // Create an inline decoration over the selection range
            const decorations = [
              Decoration.inline(from, to, {
                class: 'persistent-selection',
              }),
            ];

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default PersistentSelection;