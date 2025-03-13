
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'scale-in' | 'blur-in';
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
}

const AnimatedCard = ({
  children,
  className,
  delay = 0,
  animation = 'fade-up',
  hoverEffect = 'lift'
}: AnimatedCardProps) => {
  const getAnimationStyle = () => {
    return {
      animationDelay: delay > 0 ? `${delay}ms` : undefined,
    };
  };

  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-1 transition-transform';
      case 'glow':
        return 'hover:shadow-lg hover:shadow-hostel-200/50 transition-shadow';
      case 'border':
        return 'hover:border-hostel-300 transition-colors';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl bg-white border border-border shadow-sm',
        `animate-${animation}`,
        getHoverClass(),
        className
      )}
      style={getAnimationStyle()}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
