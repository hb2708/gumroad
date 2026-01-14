import * as React from "react";

import { CopyToClipboard } from "$app/components/CopyToClipboard";
import { Textarea } from "$app/components/Textarea";

export const CodeContainer = ({ codeToCopy }: { codeToCopy: string }) => {
  const uid = React.useId();
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  React.useEffect(() => {
    if (!textAreaRef.current || textAreaRef.current.scrollHeight <= 0) return;

    textAreaRef.current.style.height = "1px";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, [codeToCopy]);

  return (
    <fieldset className="space-y-2">
      <legend className="flex w-full justify-between">
        <label htmlFor={uid}>Copy and paste this code into your website</label>
        <CopyToClipboard tooltipPosition="bottom" text={codeToCopy}>
          <button type="button" className="font-normal underline">
            Copy embed code
          </button>
        </CopyToClipboard>
      </legend>
      <Textarea id={uid} ref={textAreaRef} aria-label="Widget code" readOnly value={codeToCopy} />
      <small className="text-muted">
        We highly recommend you have an SSL certificate to increase buyer confidence.
      </small>
    </fieldset>
  );
};
