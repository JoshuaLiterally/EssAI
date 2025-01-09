import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import PropTypes from 'prop-types';
import './BubbleMenu.css';
import ToolBarItem from './ToolBarItem.jsx';

const BubbleMenu = ({ editor }) => {
  const items = [
    {
      icon: "chat-4-line",
      title: "Add to Chat",
      action: () => {
        const selectedText = editor.state.selection.content().text;
        // Call your function to add the selected text to the chat
        addToChat(selectedText);
      },
    },
    {
      icon: "edit-fill",
      title: "Edit",
      action: () => {
        const selectedText = editor.state.selection.content().text;
        // Call your function to open the edit menu with the selected text
        openEditMenu(selectedText);
      },
    },
    {
      icon: "collapse-vertical-line",
      title: "Shorten",
      action: () => {
        const selectedText = editor.state.selection.content().text;
        // Call your AI shorten function here
        const shortenedText = shortenText(selectedText);
        editor.commands.insertContent(shortenedText);
      },
    },
    {
      icon: "expand-vertical-line",
      title: "Elaborate/Extend",
      action: () => {
        const selectedText = editor.state.selection.content().text;
        // Call your AI extend function here
        const extendedText = extendText(selectedText);
        editor.commands.insertContent(extendedText);
      },
    },
  ];

  return (
    <TiptapBubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
      {items.map((item, index) => (
        <ToolBarItem key={index} {...item} />
      ))}
    </TiptapBubbleMenu>
  );
};

BubbleMenu.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default BubbleMenu;

// Example functions (these should be replaced with actual implementations)
const addToChat = (text) => {
  console.log("Adding to chat:", text);
  // Implement your logic to add text to the chat
};

const openEditMenu = (text) => {
  console.log("Opening edit menu for:", text);
  // Implement your logic to open the edit menu
};

const shortenText = (text) => {
  console.log("Shortening text:", text);
  // Implement your AI shorten logic here
  return "Shortened text.";
};

const extendText = (text) => {
  console.log("Extending text:", text);
  // Implement your AI extend logic here
  return "Extended text.";
};