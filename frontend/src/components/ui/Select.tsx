interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
}: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="traveloop-label">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className="traveloop-input w-full"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
