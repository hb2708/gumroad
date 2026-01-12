import * as React from "react";

import { classNames } from "$app/utils/classNames";

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => (
  <div className="relative flex size-6 shrink-0 items-center justify-center">
    <input
      ref={ref}
      type="radio"
      className={classNames(
        "peer size-full cursor-pointer appearance-none rounded-full border border-border bg-background checked:border-accent checked:bg-accent",
        className,
      )}
      {...props}
    />
    <div className="pointer-events-none absolute size-2.5 rounded-full bg-accent-foreground peer-[:not(:checked)]:hidden" />
  </div>
));

Radio.displayName = "Radio";
