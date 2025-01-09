import PropTypes from 'prop-types';
import './ColorSelector.css';

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF',
  '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080',
];

const ColorSelector = ({ onSelectColor }) => {
  const handleColorClick = (color) => {
    onSelectColor(color);
  };

  return (
    <div className="color-selector-dropdown">
      {colors.map((color) => (
        <div
          key={color}
          className="color-swatch"
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(color)}
        />
      ))}
    </div>
  );
};

ColorSelector.propTypes = {
  onSelectColor: PropTypes.func.isRequired,
};

export default ColorSelector;