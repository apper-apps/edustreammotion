import React from "react";
import { cn } from "@/utils/cn";

const TextArea = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  required,
  rows = 4,
  maxLength,
  ...props
}, ref) => {
  const id = props.id || props.name;
  const [charCount, setCharCount] = React.useState(props.value?.length || 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        onChange={handleChange}
        maxLength={maxLength}
        ref={ref}
        {...props}
      />
      <div className="flex justify-between items-center">
        <div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
        {maxLength && (
          <p className="text-sm text-gray-500">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;