import { Input } from './ui/input';
import { Label } from './ui/label';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function FormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-gray-700 dark:text-gray-300 px-1 transition-colors duration-300">
        {label}
      </Label>
      <Input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   rounded-[12px] px-4 text-gray-900 dark:text-white
                   focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                   transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
    </div>
  );
}