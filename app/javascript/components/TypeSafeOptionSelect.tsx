import * as React from "react";
import { classNames } from "$app/utils/classNames";
import { Icon } from "$app/components/Icons";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={classNames(
        "relative flex h-12 items-center rounded border bg-background",
        props["aria-invalid"] ? "border-danger" : "border-border",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-accent",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <select
        ref={ref}
        className="h-full w-full appearance-none bg-transparent pl-4 pr-10 font-[inherit] text-base text-foreground outline-none"
        {...props}
      >
        {children}
      </select>
      <Icon
        name="outline-cheveron-down"
        className="pointer-events-none absolute right-4 text-xl text-muted"
      />
    </div>
  ),
);

Select.displayName = "Select";

type TypeSafeOptionSelectProps<OptionId extends string> = {
  value: OptionId;
  onChange: (newOptionId: OptionId) => void;
  options: { id: OptionId; label: string; disabled?: boolean }[];
  className?: string;
  disabled?: boolean;
};

export const TypeSafeOptionSelect = <OptionId extends string>({
  value,
  onChange,
  options,
  className,
  disabled,
  ...rest
}: TypeSafeOptionSelectProps<OptionId> & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & { name?: string }) => (
  <Select
    value={value}
    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
    onChange={(evt) => onChange(evt.target.value as OptionId)}
    className={className}
    disabled={disabled}
    {...rest}
  >
    {options.map((opt) => (
      <option key={opt.id} value={opt.id} disabled={!!opt.disabled}>
        {opt.label}
      </option>
    ))}
  </Select>
);
