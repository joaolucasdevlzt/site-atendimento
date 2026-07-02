import type { ChangeEvent } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

interface FieldProps {
  label: string;
  icon: IconName;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

/** Campo de formulário com ícone à esquerda (login). */
export function Field({ label, icon, placeholder, type = 'text', value, onChange }: FieldProps) {
  return (
    <div className="auth__field">
      <label className="auth__label">{label}</label>
      <div className="auth__input">
        <Icon name={icon} size={17} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
