interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'password' | 'tel';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="traveloop-label">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="traveloop-input w-full"
      />
    </div>
  );
}
