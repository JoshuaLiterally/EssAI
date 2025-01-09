import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Dropdown({ options, onSelect, selected, getOptionStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        {options.find(option => option.value === selected)?.label || 'Select...'}
        <span className="dropdown-arrow">
          {isOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M7 14l5-5 5 5z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" fill="currentColor" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={getOptionStyle ? getOptionStyle(option) : {}}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  getOptionStyle: PropTypes.func,
};