import { CardElement, Elements } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeElementStyleVariant, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import * as React from "react";

import { SavedCreditCard } from "$app/parsers/card";
import { classNames } from "$app/utils/classNames";
import { getStripeInstance } from "$app/utils/stripe_loader";
import { getCssVariable } from "$app/utils/styles";

import { useFont } from "$app/components/DesignSettings";
import { Icon } from "$app/components/Icons";

export const CreditCardInput = ({
  disabled,
  savedCreditCard,
  invalid,
  onReady,
  useSavedCard,
  setUseSavedCard,
  onChange,
}: {
  disabled?: boolean;
  savedCreditCard: SavedCreditCard | null;
  invalid?: boolean;
  onReady: (element: StripeCardElement) => void;
  useSavedCard: boolean;
  setUseSavedCard: (value: boolean) => void;
  onChange?: (evt: StripeCardElementChangeEvent) => void;
}) => {
  // Actually set font family, size, and color and determined on the first render based on a ghost div that is unmounted
  // as soon as the measurement is performed.
  const [baseStripeStyle, setBaseStripeStyle] = React.useState<null | StripeElementStyleVariant>(null);

  return (
    <fieldset className={classNames(invalid && "border-danger")}>
      <legend className="mb-2 flex w-full items-center justify-between">
        <label>Card information</label>
        {savedCreditCard ? (
          <button className="font-normal underline" disabled={disabled} onClick={() => setUseSavedCard(!useSavedCard)}>
            {useSavedCard ? "Use a different card?" : "Use saved card"}
          </button>
        ) : null}
      </legend>
      {savedCreditCard && useSavedCard ? (
        <div
          className="bg-filled flex w-full items-center gap-2 rounded border border-border px-4 py-3 opacity-50"
          aria-label="Saved credit card"
        >
          <Icon name="outline-credit-card" />
          <span>{savedCreditCard.number}</span>
          <span className="ml-auto">{savedCreditCard.expiration_date}</span>
        </div>
      ) : (
        <div
          className={classNames(
            "bg-filled flex w-full items-center rounded border px-4 py-3 text-base",
            invalid ? "border-danger" : "border-border",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
          )}
          aria-label="Card information"
          aria-invalid={invalid}
        >
          {baseStripeStyle == null ? (
            <input
              ref={(el) => {
                if (el == null) return;
                const inputStyle = window.getComputedStyle(el);
                const color = getCssVariable("color").split(" ").join(",");
                const placeholderColor = `rgb(${color}, ${getCssVariable("gray-3")})`;
                setBaseStripeStyle({
                  fontFamily: inputStyle.fontFamily,
                  color: inputStyle.color,
                  iconColor: placeholderColor,
                  "::placeholder": { color: placeholderColor },
                });
              }}
            />
          ) : null}
          <StripeElementsProvider>
            <CardElement
              className="flex-1"
              options={{
                style: { base: baseStripeStyle ?? {} },
                hidePostalCode: true,
                disabled: disabled ?? false,
                disableLink: true,
                hideIcon: true,
              }}
              onReady={onReady}
              {...(onChange ? { onChange } : {})}
            />
          </StripeElementsProvider>
        </div>
      )}
    </fieldset>
  );
};

export const StripeElementsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stripePromise] = React.useState(getStripeInstance);
  const font = useFont();

  // Since Stripe Elements are rendered in iframes, we need to explicitly pass in the font source & input styles
  const stripeFonts = [{ family: font.name, src: `url(${font.url})` }];

  return (
    <Elements stripe={stripePromise} options={{ fonts: stripeFonts }}>
      {children}
    </Elements>
  );
};
