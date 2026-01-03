import * as React from "react";

import { classNames } from "$app/utils/classNames";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  trailing?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, trailing, ...props }, ref) => (
  <div
    className={classNames(
      "flex h-12 items-center gap-2 rounded border border-border px-4 focus-within:ring-2 focus-within:ring-accent focus-within:outline-none",
      { "bg-filled": !props.readOnly },
      className,
    )}
  >
    <input
      ref={ref}
      className="flex-1 bg-transparent font-[inherit] text-base text-foreground outline-none"
      {...props}
    />
    {trailing}
  </div>
));

Input.displayName = "Input";
