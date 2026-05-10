interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-50 text-green-800 dark:bg-green-400/10 dark:text-green-300',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300',
    danger: 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
    default: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
