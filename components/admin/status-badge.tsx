'use client';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed';
  label?: string;
}

const statusConfig = {
  active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
  inactive: { bg: 'bg-warning/10', text: 'text-warning', label: 'Inactive' },
  pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
  failed: { bg: 'bg-error/10', text: 'text-error', label: 'Failed' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {label || config.label}
    </span>
  );
}
