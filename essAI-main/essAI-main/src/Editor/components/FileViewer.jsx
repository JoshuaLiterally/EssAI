// src/Editor/components/FileViewer.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import './FileViewer.css';

const FileViewer = ({ onAddFile }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
    onAddFile(newFiles);
  };

  return (
    <div className="file-viewer">
      <input type="file" multiple onChange={handleFileChange} />
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
};
FileViewer.propTypes = {
  onAddFile: PropTypes.func.isRequired,
};

export default FileViewer;
