import * as React from "react";

import { Input } from "$app/components/Input";

export const CustomSummaryInput = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) => {
  const uid = React.useId();
  return (
    <fieldset className="flex flex-col gap-2">
      <label htmlFor={uid}>Summary</label>
      <Input
        id={uid}
        type="text"
        placeholder="You'll get..."
        value={value ?? ""}
        onChange={(evt) => onChange(evt.target.value)}
      />
    </fieldset>
  );
};
