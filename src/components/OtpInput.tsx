import { useRef } from 'react';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

const OtpInput = ({ length = 6, value, onChange }: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const updateValue = (next: string) => {
    onChange(next.replace(/\D/g, '').slice(0, length));
  };

  const handleChange = (index: number, digit: string) => {
    const cleaned = digit.replace(/\D/g, '');
    const chars = value.split('');
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, length);
      updateValue(pasted);
      inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
      return;
    }
    chars[index] = cleaned;
    const next = chars.join('').replace(/\s/g, '');
    updateValue(next);
    if (cleaned && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digits[index]?.trim() ?? ''}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event.key)}
          className="auth-otp-input flex-1 max-w-[3rem] sm:max-w-none"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
