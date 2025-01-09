import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from 'react-router-dom';
import ToolBar from "./ToolBar";
import { DocumentService } from '../../services/DocumentService';
import { useAuth } from '../../context/AuthContext';
import "./ControlPanel.css";
import "remixicon/fonts/remixicon.css";

export default function ControlPanel({ editor, title, updateTitle }) {
  const importFileRef = useRef(null);
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [localTitle, setLocalTitle] = useState(title);
  const { user } = useAuth();

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localTitle !== title) {
        updateTitle(localTitle);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [localTitle, title, updateTitle]);

  const handleExport = () => {
    if (editor) {
      const html = editor.getHTML();
      const blob = new Blob([html], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "editor-content.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target.result;
        editor.commands.setContent(htmlContent, false);
      };
      reader.readAsText(file);
    }
  };

  const triggerImport = () => {
    if (importFileRef.current) {
      importFileRef.current.click();
    }
  };

  const handleSave = async () => {
    if (editor) {
      const html = editor.getHTML();
      try {
        await DocumentService.updateDocumentContent(documentId, html);
        alert('Document saved successfully!');
      } catch (error) {
        console.error('Failed to save document:', error);
        alert('Failed to save document.');
      }
    }
  };

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value);
  };

  const handleHomeClick = () => {
    navigate('/documents');
  };

  return (
    <div className="control-panel">
      <div className="top-section">
        <button className="home-button" onClick={handleHomeClick}>
          <i className="ri-home-4-fill"></i>
        </button>
        <div className="title-menu-container">
          <input
            type="text"
            className="title-input"
            placeholder="Enter title here"
            value={localTitle}
            onChange={handleTitleChange}
          />
          <div className="menu-options">
            <button>File</button>
            <button>Edit</button>
            <button>Insert</button>
            <button>Tools</button>
          </div>
        </div>
        <div className="top-section-right">
          <input
            type="file"
            accept=".html"
            ref={importFileRef}
            style={{ display: "none" }}
            onChange={handleImport}
          />
          <button className="icon-button" onClick={triggerImport}>
            <i className="ri-upload-2-line"></i>
          </button>
          <button className="icon-button" onClick={handleExport}>
            <i className="ri-download-2-line"></i>
          </button>
          <button className="icon-button" onClick={handleSave}>
            <i className="ri-save-3-line"></i>
          </button>
          <button className="icon-button">
            <i className="ri-share-fill"></i>
          </button>
          <button className="icon-button">
            <i className="ri-chat-4-fill"></i>
          </button>
          <button className="icon-button profile-picture">
            <img 
              src={user?.photoURL || 'src/assets/homer.png'} 
              alt="Profile" 
              className="profile-img"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'src/assets/homer.png'; // Fallback image
              }}
              loading="eager" // Force immediate loading
            />
          </button>
        </div>
      </div>
      <ToolBar editor={editor} />
    </div>
  );
}

ControlPanel.propTypes = {
  editor: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  updateTitle: PropTypes.func.isRequired,
};