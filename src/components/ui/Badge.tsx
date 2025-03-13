
import { ReactNode } from 'react';
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-hostel-100 text-hostel-700 border-hostel-200';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground border-border';
      case 'outline':
        return 'bg-transparent border-border text-foreground';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0.5 px-2';
      case 'lg':
        return 'text-sm py-1 px-3';
      default:
        return 'text-xs py-0.5 px-2.5';
    }
  };

  return (
    <ShadcnBadge
      className={cn(
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {children}
    </ShadcnBadge>
  );
};

export default Badge;
