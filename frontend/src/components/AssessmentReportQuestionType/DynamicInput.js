import React from "react";

const DynamicInput = ({ type, label, options = [], value = "", onChange, writtenOptions, onChangeOptions }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;

    if (type === "checkbox") {
      const updatedValue = e.target.checked
        ? [...(Array.isArray(value) ? value : []), newValue]
        : Array.isArray(value)
          ? value.filter((v) => v !== newValue)
          : [];
      onChange(updatedValue);
    } else {
      onChange(newValue);
    }
  };

  console.log(value, 'value')

  return (
    <div className="dynamic-input">
      {type === "text" && (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your Answer here"
          className="col-input w-100"
        />
      )}
      {type === "textarea" && (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter your Answer here"
          className="col-input w-100"
        />
      )}
      {type === "checkbox" &&
        options.map((option, index) => (
          <div key={index} className="checkbox-component">
            {option?.value === "" ? (
              <>
                {/* <div> */}
                <input
                  type="text"
                  value={writtenOptions[index]?.value || ''}  // Simplified value handling with default fallback
                  onChange={(e) => {
                    const updatedValue = [...writtenOptions];
                    updatedValue[index] = {
                      ...updatedValue[index],
                      value: e.target.value,  // Updating the specific option value
                    };
                    onChangeOptions(updatedValue);
                    onChange(updatedValue?.filter(o => o.checked === true).map(o => o.value).join(','));  // Propagate the updated options
                  }}
                  placeholder="Enter your Answer here"
                  className="form-control"
                />
                <input
                  type="checkbox"
                  value={writtenOptions[index]?.value || ''}  // Value should be the current option value
                  checked={value?.split(',').includes(writtenOptions[index]?.value)}  // Check if the current option is checked
                  onChange={(e) => {
                    // Map through writtenOptions and add `checked` key to all items
                    const updatedValue = writtenOptions.map((option, idx) => {
                      // Check if this option's value is in the `value.split(',')`
                      const isChecked = value?.split(',').includes(option.value);
                      return {
                        ...option,
                        checked: idx === index ? !option.checked : isChecked, // Toggle checked for the current index
                      };
                    });

                    // Call onChangeOptions with the updated writtenOptions
                    onChangeOptions(updatedValue);

                    // Filter to only include checked items, then map to values, and join them into a comma-separated string
                    const checkedValues = updatedValue
                      .filter(option => option.checked)  // Only keep checked options
                      .map(option => option.value)       // Map to values
                      .join(',');                        // Join them into a comma-separated string

                    // Call onChange with the updated comma-separated string of checked values
                    onChange(checkedValues);
                  }}
                />

                <span className="checkmark"></span>

              </>
            ) :
              <label className="container-checkbox">
                {console.log(option.value, 'option.value')}
                {option.label || option.value}
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
              </label>}
          </div>
        ))}
      {type === "radio" &&
        options.map((option, index) => (
          <div className="radio-component">
            <label className="container-radio">
              {option.label || option.value}
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        ))}
      {type === "date" && (
        <input
          type="date"
          value={value}
          onChange={handleChange}
          className="col-input birth-input"
        />
      )}
    </div>
  );
};

export default DynamicInput;
