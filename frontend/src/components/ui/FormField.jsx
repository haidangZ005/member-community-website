export default function FormField({ label, icon: Icon, error, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div className={`input-shell ${error ? 'input-error' : ''}`}>
        {Icon && <Icon size={18} aria-hidden="true" />}
        {children}
      </div>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

