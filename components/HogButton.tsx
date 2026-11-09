import { Slot } from '@radix-ui/react-slot';
import { clsx, type ClassValue } from 'clsx';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const cn = function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
};
type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const HogButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { inverse?: number }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild === true ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'group relative inline-block w-auto rounded border text-center font-semibold disabled:cursor-not-allowed    disabled:opacity-50',
        className,
        props.inverse
          ? 'border-green-800 bg-green-600'
          : 'border-green-800 text-white'
      )}
      {...props}
    >
      <span
        className={cn(
          'relative -mx-0.5 flex w-auto -translate-y-1 select-none items-center justify-center rounded-md border border-green-800 px-4 py-2 text-center font-semibold transition duration-75 hover:translate-y-0.5 active:-translate-y-px active:transition-all active:duration-100 group-disabled:hover:!translate-y-[-2px]',
          props.inverse ? 'bg-white dark:bg-[#1d1f27]' : ''
        )}
      >
        {props.children}
      </span>
    </Comp>
  );
});

HogButton.displayName = 'HogButton';

export default HogButton;
