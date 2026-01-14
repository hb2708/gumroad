import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { Icon } from "$app/components/Icons";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean | undefined;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, isInvalid, ...props }, ref) => (
  <div className="relative flex size-6 shrink-0 items-center justify-center">
    <input
      ref={ref}
      type="checkbox"
      className={classNames(
        "peer size-full cursor-pointer appearance-none rounded-lg border bg-background checked:bg-accent",
        isInvalid ? "border-danger" : "border-border",
        "disabled:cursor-not-allowed disabled:opacity-35",
        className,
      )}
      {...props}
    />
    <Icon
      name="outline-check"
      className="pointer-events-none absolute text-accent-foreground peer-disabled:opacity-35 peer-[:not(:checked)]:hidden"
    />
  </div>
));

Checkbox.displayName = "Checkbox";
