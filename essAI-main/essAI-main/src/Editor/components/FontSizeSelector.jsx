import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./FontSizeSelector.css";

const FontSizeSelector = ({ editor }) => {
  const [fontSize, setFontSize] = useState(12);
  const [inputValue, setInputValue] = useState(12);
  const inputRef = useRef(null);

  useEffect(() => {
    const updateFontSize = () => {
      const size = editor.getAttributes("textStyle").fontSize || 12;
      setFontSize(size);
      setInputValue(size);
    };

    editor.on("update", updateFontSize);
    editor.on("selectionUpdate", updateFontSize);

    return () => {
      editor.off("update", updateFontSize);
      editor.off("selectionUpdate", updateFontSize);
    };
  }, [editor]);

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setInputValue(newSize);
  };

  const applyFontSizeChange = () => {
    const newSize = parseInt(inputValue, 10);
    if (!isNaN(newSize)) {
      console.log("Changing font size to:", newSize);
      setFontSize(newSize);
      editor.chain().focus().setFontSize(newSize).run();
    } else {
      setInputValue(fontSize); // reset to the current font size if input is invalid
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyFontSizeChange();
      inputRef.current.blur();
    }
  };

  const incrementFontSize = () => {
    const newSize = fontSize + 1;
    console.log("Incrementing font size to:", newSize);
    setFontSize(newSize);
    setInputValue(newSize);
    editor.chain().focus().setFontSize(newSize).run();
  };

  const decrementFontSize = () => {
    const newSize = fontSize - 1;
    console.log("Decrementing font size to:", newSize);
    setFontSize(newSize);
    setInputValue(newSize);
    editor.chain().focus().setFontSize(newSize).run();
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = (e) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  return (
    <div className="font-size-selector">
      <button onClick={decrementFontSize}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleFontSizeChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        ref={inputRef}
      />
      <button onClick={incrementFontSize}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

FontSizeSelector.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default FontSizeSelector;