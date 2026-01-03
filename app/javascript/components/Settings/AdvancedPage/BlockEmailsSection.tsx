import * as React from "react";
import { isValidEmail } from "$app/utils/email";
import { Textarea } from "$app/components/Textarea";

type Props = {
  blockedEmails: string;
  setBlockedEmails: (emails: string) => void;
};
const BlockEmailsSection = ({ blockedEmails, setBlockedEmails }: Props) => {
  const uid = React.useId();
  const sanitizeBlockedEmails = () => {
    if (blockedEmails.length === 0) {
      return;
    }

    setBlockedEmails(
      [
        ...new Set( // remove duplicate emails
          blockedEmails
            .toLowerCase()
            .replace(/[\r\n]+/gu, ",") // replace newlines with commas
            .replace(/\s/gu, "") // remove all whitespaces
            .split(/[,]+/gu) // split by commas
            .map((email) => {
              if (!isValidEmail(email)) return email;

              const [localPart, domain] = email.split("@");
              return [
                // Normalize local-part (https://en.wikipedia.org/wiki/Email_address#Common_local-part_semantics)
                localPart
                  .replace(/\+.*/u, "") // normalize plus sub-addressing
                  .replace(/\./gu, ""), // normalize dots
                domain,
              ].join("@");
            }),
        ),
      ].join("\n"),
    );
  };

  return (
    <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16 lg:pb-16">
      <header className="flex flex-col gap-3">
        <h2>Mass-block emails</h2>
        <a href="/help/article/329-customer-moderation" target="_blank" rel="noreferrer">
          Learn more
        </a>
      </header>
      <fieldset className="space-y-2">
        <legend>
          <label htmlFor={uid}>Block emails from purchasing</label>
        </legend>
        <Textarea
          id={uid}
          placeholder={["name@example.com", "name@example.net", "name@example.org"].join("\n")}
          rows={4}
          value={blockedEmails}
          onChange={(e) => setBlockedEmails(e.target.value)}
          onBlur={sanitizeBlockedEmails}
        />
        <small className="text-muted">Please enter each email address on a new line.</small>
      </fieldset>
    </section>
  );
};

export default BlockEmailsSection;
