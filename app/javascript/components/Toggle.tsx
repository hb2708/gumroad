import * as React from "react";

import { classNames } from "$app/utils/classNames";

export const Toggle = ({
  value,
  onChange,
  id,
  disabled,
  children,
  ariaLabel,
}: {
  value: boolean;
  onChange?: ((newValue: boolean) => void) | undefined;
  id?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  ariaLabel?: string;
}) => (
  <label>
    <input
      type="checkbox"
      role="switch"
      id={id}
      checked={value}
      onChange={(evt) => onChange?.(evt.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames(
        "relative h-5 w-[34px] shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-background align-top",
        "transition-all duration-[140ms] ease-out",
        "checked:bg-accent",
        "after:absolute after:top-1/2 after:left-[3px] after:size-3.5 after:-translate-y-1/2 after:rounded-full after:bg-current after:transition-all",
        "checked:after:translate-x-3 checked:after:bg-black",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    />
    {children ? <span className="ml-2 cursor-pointer">{children}</span> : null}
  </label>
);
