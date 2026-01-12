import * as React from "react";

import { Input } from "$app/components/Input";

export const CustomViewContentButtonTextInput = ({
  value,
  onChange,
  maxLength,
}: {
  value: string | null;
  onChange: (value: string) => void;
  maxLength: number;
}) => {
  const uid = React.useId();
  return (
    <fieldset className="flex flex-col gap-2">
      <label htmlFor={uid}>Button text</label>
      <Input
        id={uid}
        placeholder="View content"
        value={value ?? ""}
        onChange={(evt) => onChange(evt.target.value)}
        maxLength={maxLength}
      />
      <small className="text-muted">
        Customize the download button text on receipts and product pages (max {maxLength} characters).
      </small>
    </fieldset>
  );
};
