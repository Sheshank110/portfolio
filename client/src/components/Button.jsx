/**
 * Growkool Studios styled button component with crimson red primary and crisp secondary variants.
 */
export default function Button({
  children,
  href,
  variant = 'primary',
  external = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  const base =
    'inline-flex items-center gap-2 font-heading font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 px-6 py-3.5';

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover shadow-sm',
    secondary:
      'border border-border hover:border-text-primary text-text-primary hover:bg-bg-elevated',
    ghost:
      'text-text-primary hover:text-accent font-semibold',
  };

  const classes = `${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {external && (
          <span className="text-xs font-mono font-bold" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
