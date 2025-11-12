import React from 'react';
// 1. Icons ko nayi file se import karo
import { EyeOpenIcon, EyeClosedIcon } from './Icons.jsx';

// Component ab 'togglePassword' aur 'showPassword' props lega
function FormInputWithIcon({ id, type, value, onChange, placeholder, icon, required = true, togglePassword, showPassword }) {
  
  let inputClass = "input-neumo !pl-10";
  if (togglePassword) {
    inputClass += " !pr-10"; // Right padding agar eye icon hai
  }

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
        {React.cloneElement(icon, {
          className: "w-5 h-5",
        })}
      </div>
      
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />

      {/* Right Icon (Eye) */}
      {togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOpenIcon className="w-5 h-5" />
          ) : (
            <EyeClosedIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default FormInputWithIcon;