// DiffExtension.ts
import { Mark, mergeAttributes } from '@tiptap/core'
import * as DiffMatchPatch from 'diff-match-patch'

type DiffOperation = -1 | 0 | 1;
type DiffResult = [DiffOperation, string];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    diff: {
      showDiff: (oldContent: string, newContent: string) => ReturnType
      clearDiff: () => ReturnType
    }
  }
}

export const DiffExtension = Mark.create({
  name: 'diff',

  addAttributes() {
    return {
      type: {
        default: 'none',
        renderHTML: (attributes) => {
          if (attributes.type === 'addition') {
            return {
              style: 'background-color: rgba(0, 255, 0, 0.2)',
            }
          }
          if (attributes.type === 'deletion') {
            return {
              style: 'background-color: rgba(255, 0, 0, 0.2); text-decoration: line-through',
            }
          }
          return {}
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-diff]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-diff': '' }, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      showDiff:
        (oldContent: string, newContent: string) =>
        ({ chain, editor }) => {
          // Convert inputs to strings and strip HTML
          const stripHtml = (html: string) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
          };

          // Strict input validation
          if (typeof oldContent !== 'string' || typeof newContent !== 'string') {
            console.error('Invalid input types:', { oldContent, newContent });
            return false;
          }

          const sanitizedOldContent = stripHtml(oldContent || '');
          const sanitizedNewContent = stripHtml(newContent || '');

          // Debug logging
          console.debug('Diffing contents:', {
            old: sanitizedOldContent,
            new: sanitizedNewContent
          });

          try {
            const dmp = new DiffMatchPatch.diff_match_patch();
            
            // Extra validation before diff_main
            if (!dmp || typeof dmp.diff_main !== 'function') {
              throw new Error('diff_match_patch not properly initialized');
            }

            const diffs = dmp.diff_main(
              sanitizedOldContent,
              sanitizedNewContent
            ) as DiffResult[];

            if (!Array.isArray(diffs)) {
              throw new Error('Invalid diff result');
            }

            dmp.diff_cleanupSemantic(diffs);

            // Clear editor state
            editor.commands.setContent('');
            chain().unsetMark('diff');

            // Apply diffs
            for (const [operation, text] of diffs) {
              if (!text) continue; // Skip empty text segments
              
              if (operation === -1) {
                chain().setMark('diff', { type: 'deletion' });
                editor.commands.insertContent(text);
              } else if (operation === 1) {
                chain().setMark('diff', { type: 'addition' });
                editor.commands.insertContent(text);
              } else {
                chain().unsetMark('diff');
                editor.commands.insertContent(text);
              }
            }

            return true;
          } catch (error) {
            console.error('Error in diff comparison:', error);
            return false;
          }
        },

      clearDiff: () => ({ chain }) => {
        return chain().unsetMark('diff').run();
      },
    }
  },
})