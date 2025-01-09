import './ToolBarItem.css';
import PropTypes from 'prop-types';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import { forwardRef, useState } from 'react';

// eslint-disable-next-line react/display-name
const ToolBarItem = forwardRef(({ icon, title, action, isActive = null, isDropdown = false, children }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState(title);

  const handleMouseEnter = () => {
    setTooltip(title);
  };

  const handleMouseLeave = () => {
    setTooltip('');
  };

  const handleClick = () => {
    if (isDropdown) {
      setIsOpen(!isOpen);
    }
    action();
  };

  return (
    <button
      ref={ref}
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}${isDropdown ? ' dropdown-item' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-tooltip={tooltip}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
      {isDropdown && (
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
      )}
      {children}
    </button>
  );
});

ToolBarItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  isActive: PropTypes.func,
  isDropdown: PropTypes.bool,
  children: PropTypes.node,
};

export default ToolBarItem;