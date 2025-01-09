import "./ToolBar.css";
import { Fragment, useState, useEffect, useRef } from "react";
import ToolBarItem from "./ToolBarItem.jsx";
import Dropdown from "./Dropdown.jsx";
import FontSizeSelector from "./FontSizeSelector.jsx";
import PropTypes from "prop-types";

export default function MenuBar({ editor }) {
  const [selectedStyle, setSelectedStyle] = useState("paragraph");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [isAlignDropdownVisible, setAlignDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentAlignment, setCurrentAlignment] = useState("align-left");
  const alignButtonRef = useRef(null);

  useEffect(() => {
    const updateSelectedStyle = () => {
      if (editor.isActive("heading", { level: 1 })) {
        setSelectedStyle("heading1");
      } else if (editor.isActive("heading", { level: 2 })) {
        setSelectedStyle("heading2");
      } else if (editor.isActive("heading", { level: 3 })) {
        setSelectedStyle("heading3");
      } else if (editor.isActive("paragraph")) {
        setSelectedStyle("paragraph");
      }
    };

    const updateSelectedFont = () => {
      const font = editor.getAttributes("textStyle").fontFamily || "Arial";
      setSelectedFont(font);
    };

    const updateCurrentAlignment = () => {
      if (editor.isActive({ textAlign: "left" })) {
        setCurrentAlignment("align-left");
      } else if (editor.isActive({ textAlign: "center" })) {
        setCurrentAlignment("align-center");
      } else if (editor.isActive({ textAlign: "right" })) {
        setCurrentAlignment("align-right");
      } else if (editor.isActive({ textAlign: "justify" })) {
        setCurrentAlignment("align-justify");
      }
    };

    editor.on("update", updateSelectedStyle);
    editor.on("selectionUpdate", updateSelectedStyle);
    editor.on("update", updateSelectedFont);
    editor.on("selectionUpdate", updateSelectedFont);
    editor.on("update", updateCurrentAlignment);
    editor.on("selectionUpdate", updateCurrentAlignment);

    return () => {
      editor.off("update", updateSelectedStyle);
      editor.off("selectionUpdate", updateSelectedStyle);
      editor.off("update", updateSelectedFont);
      editor.off("selectionUpdate", updateSelectedFont);
      editor.off("update", updateCurrentAlignment);
      editor.off("selectionUpdate", updateCurrentAlignment);
    };
  }, [editor]);

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    switch (style) {
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      default:
        break;
    }
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    editor.chain().focus().setFontFamily(font).run();
  };

  const toggleAlignDropdown = () => {
    const rect = alignButtonRef.current.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setAlignDropdownVisible(!isAlignDropdownVisible);
  };

  const handleAlignChange = (align) => {
    editor.chain().focus().setTextAlign(align).run();
    setAlignDropdownVisible(false);
  };

  const styleOptions = [
    { value: "paragraph", label: "Normal text" },
    { value: "heading1", label: "Heading 1" },
    { value: "heading2", label: "Heading 2" },
    { value: "heading3", label: "Heading 3" },
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Garamond", label: "Garamond" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier", label: "Courier" },
    { value: "Courier New", label: "Courier New" },
  ];

  const getFontOptionStyle = (option) => ({
    fontFamily: option.value,
  });

  const items = [
    {
      icon: "arrow-go-back-line",
      title: "Undo (Ctrl+Z)",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: "arrow-go-forward-line",
      title: "Redo (Ctrl+Y)",
      action: () => editor.chain().focus().redo().run(),
    },
    {
      icon: "bold",
      title: "Bold (Ctrl+B)",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: "italic",
      title: "Italic (Ctrl+I)",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: "underline",
      title: "Underline (Ctrl+U)",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: "strikethrough",
      title: "Strike (Ctrl+Shift+X)",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: "mark-pen-line",
      title: "Highlight (Ctrl+Shift+H)",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      icon: currentAlignment,
      title: "Align and Indent",
      action: toggleAlignDropdown,
      ref: alignButtonRef,
      isDropdown: true,
    },
    {
      icon: "list-unordered",
      title: "Bullet List (Ctrl+Shift+8)",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: "list-ordered",
      title: "Ordered List (Ctrl+Shift+7)",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: "list-check-2",
      title: "Task List (Ctrl+Shift+9)",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      type: "divider",
    },
    {
      icon: "code-box-line",
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: "double-quotes-l",
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: "separator",
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "text-wrap",
      title: "Hard Break (Ctrl+Enter)",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: "format-clear",
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "superscript",
      title: "Superscript (Ctrl+.)",
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: () => editor.isActive("superscript"),
    },
    {
      icon: "subscript",
      title: "Subscript (Ctrl+,)",
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: () => editor.isActive("subscript"),
    },
    {
      type: "divider",
    },
  ];

  return (
    <div className="toolbar">
      {items.slice(0, 2).map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? (
            <div className="divider" />
          ) : (
            <ToolBarItem {...item} />
          )}
        </Fragment>
      ))}
      <div className="divider" />

      <Dropdown
        options={styleOptions}
        onSelect={handleStyleChange}
        selected={selectedStyle}
      />
      <div className="divider" />
      <Dropdown
        options={fontOptions}
        onSelect={handleFontChange}
        selected={selectedFont}
        getOptionStyle={getFontOptionStyle}
      />

      <div className="divider" />
      <FontSizeSelector editor={editor} />
      <div className="divider" />

      {items.slice(2).map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? (
            <div className="divider" />
          ) : (
            <ToolBarItem {...item} />
          )}
        </Fragment>
      ))}

      {isAlignDropdownVisible && (
        <div
          className="horizontal-dropdown"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left, position: 'absolute' }}
        >
          <ToolBarItem
            icon="align-left"
            title="Align Left (Ctrl+Shift+L)"
            action={() => handleAlignChange("left")}
            isActive={() => editor.isActive({ textAlign: "left" })}
          />
          <ToolBarItem
            icon="align-center"
            title="Align Center (Ctrl+Shift+E)"
            action={() => handleAlignChange("center")}
            isActive={() => editor.isActive({ textAlign: "center" })}
          />
          <ToolBarItem
            icon="align-right"
            title="Align Right (Ctrl+Shift+R)"
            action={() => handleAlignChange("right")}
            isActive={() => editor.isActive({ textAlign: "right" })}
          />
          <ToolBarItem
            icon="align-justify"
            title="Justify (Ctrl+Shift+J)"
            action={() => handleAlignChange("justify")}
            isActive={() => editor.isActive({ textAlign: "justify" })}
          />
        </div>
      )}
    </div>
  );
}

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
};