import { useState, type InputHTMLAttributes } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string;
};

const PasswordInput = ({ className = 'auth-input', ...props }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
      >
        <HugeiconsIcon
          icon={visible ? ViewOffSlashIcon : EyeIcon}
          size={18}
          color="currentColor"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
};

export default PasswordInput;
