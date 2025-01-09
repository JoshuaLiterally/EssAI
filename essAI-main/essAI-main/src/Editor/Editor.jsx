import "./editor.css";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Text from "@tiptap/extension-text";
import Color from "@tiptap/extension-color";
import IndentationCommands from "../extensions/IndentationCommands";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from '@tiptap/extension-image'
import { all, createLowlight } from "lowlight";

import { EditorContent, useEditor } from "@tiptap/react";
import { useRef, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import StarterKit from "@tiptap/starter-kit";

import ControlPanel from "./components/ControlPanel";
import BubbleMenu from "./components/BubbleMenu";
import Chat from './components/Chat'; // Import the Chat component
// import FileViewer from "./components/FileViewer";

import { TextStyleExtended } from "../extensions/TextStyleExtended.ts";
import { DocumentService } from '../services/DocumentService';
import { DiffExtension } from "../extensions/DiffExtension";
import PersistentSelection from '../extensions/PersistentSelection';

const lowlight = createLowlight(all);

export default function Editor() {
  const { documentId } = useParams();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        setZoomLevel((prev) => Math.min(prev + 0.1, 2));
        e.preventDefault();
      } else if (e.ctrlKey && e.key === '-') {
        setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', zoomLevel);
  }, [zoomLevel]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      Underline,
      Subscript,
      Superscript,
      ListKeymap,
      Typography,
      FontFamily,
      TextStyle,
      Text,
      TextStyleExtended,
      IndentationCommands,
      DiffExtension,
      PersistentSelection,
      Color,
      Image.configure({
        HTMLAttributes: {
          style: 'display: block; margin: 0 auto;',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write something…",
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content,
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const document = await DocumentService.getDocumentById(documentId);
        setContent(document.content);
        setTitle(document.title);
        if (editor) {
          editor.commands.setContent(document.content, false);
        }
      } catch (error) {
        console.error('Failed to fetch document:', error);
      }
    };

    fetchDocument();
  }, [documentId, editor]);

  useEffect(() => {
    const saveDocument = async () => {
      if (editor) {
        const html = editor.getHTML();
        try {
          await DocumentService.updateDocumentContent(documentId, html);
          console.log('Document saved successfully!');
        } catch (error) {
          console.error('Failed to save document:', error);
        }
      }
    };

    const intervalId = setInterval(saveDocument, 10000); // Save every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [documentId, editor]);

  const updateTitle = async (newTitle) => {
    try {
      await DocumentService.updateDocumentTitle(documentId, newTitle);
      setTitle(newTitle);
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  const contentRef = useRef(null);

  return (
    <div className="editorContainer">
      <div className="control">
        <ControlPanel editor={editor} title={title} updateTitle={updateTitle} />
      </div>
      <div className="editor" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
        <div ref={contentRef} className="editor_wrapper">
          {editor && <BubbleMenu editor={editor} />}
          <EditorContent className="editor__content" editor={editor} />
        </div>
      </div>
      <Chat editor={editor} /> {/* Use the Chat component */}
      {/* <div className="files">
        <FileViewer onAddFile={handleAddFile} />
      </div> */}
    </div>
  );
}
