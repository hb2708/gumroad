import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { Icon } from "$app/components/Icons";


export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={classNames(
        "relative flex h-12 items-center rounded border border-border bg-filled px-4 gap-2",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-accent",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <select
        ref={ref}
        className="w-full appearance-none bg-transparent font-[inherit] text-base text-foreground outline-none"
        {...props}
      >
        {children}
      </select>
      <Icon
        name="outline-cheveron-down"
        className="pointer-events-none text-xl text-muted"
      />
    </div>
  ),
);

NativeSelect.displayName = "NativeSelect";
