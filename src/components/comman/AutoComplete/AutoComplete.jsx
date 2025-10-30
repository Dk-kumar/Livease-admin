import { useState } from "react";
import { olaMapApi } from "../../../server/olaMapApi";
import "./AutoComplete.scss";

const AutoComplete = ({
  value,
  onChange,
  onBlur,
  placeholder,
  id,
  label,
  icon,
  error,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    // Call parent's onChange to update the form state
    onChange(id, inputValue);

    if (inputValue) {
      const data = await olaMapApi(inputValue);
      setSuggestions(data?.predictions || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const mainText = suggestion.structured_formatting.main_text;
    // Update parent's state with the selected location
    onChange(id, suggestion);
    setSuggestions([]);
  };

  const handleBlurEvent = () => {
    // Notify the parent component about the blur event
    onBlur(id);
    // Delay hiding suggestions to allow click event to register
    setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };

  return (
    <div className="form-group autocomplete-wrapper">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlurEvent}
        className={`form-input ${error ? "input-error" : ""}`}
        autoComplete="off"
      />
      {icon && <i className={`icon-${id}`}>{icon()}</i>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-main-text">
                {suggestion.structured_formatting.main_text}
              </span>
              <span className="suggestion-secondary-text">
                {suggestion.structured_formatting.secondary_text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
