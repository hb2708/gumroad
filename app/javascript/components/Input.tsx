import * as React from "react";

import { classNames } from "$app/utils/classNames";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, leading, trailing, ...props }, ref) => (
    <div
      className={classNames(
        "flex h-12 items-center gap-2 rounded border px-4 focus-within:ring-2 focus-within:ring-accent focus-within:outline-none",
        props["aria-invalid"] ? "border-danger" : "border-border",
        props.readOnly || props.disabled ? "bg-body" : "bg-background",
        props.disabled && "cursor-not-allowed opacity-30",
        className,
      )}
    >
      {leading}
      <input
        ref={ref}
        className={classNames(
          "flex-1 bg-transparent font-[inherit] text-base text-foreground outline-none",
          props.disabled && "cursor-not-allowed",
        )}
        {...props}
      />
      {trailing}
    </div>
  ));

Input.displayName = "Input";
