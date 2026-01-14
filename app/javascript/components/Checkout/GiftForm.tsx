import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { Button } from "$app/components/Button";
import { useState, getErrors } from "$app/components/Checkout/payment";
import { Input } from "$app/components/Input";
import { Modal } from "$app/components/Modal";
import { Textarea } from "$app/components/Textarea";
import { Toggle } from "$app/components/Toggle";
import { Alert } from "$app/components/ui/Alert";

export const GiftForm = ({ isMembership, className }: { isMembership: boolean; className?: string | undefined }) => {
  const giftEmailUID = React.useId();
  const giftNoteUID = React.useId();
  const [cancellingPresetGift, setCancellingPresetGift] = React.useState(false);

  const [state, dispatch] = useState();
  const { gift } = state;
  const hasError = getErrors(state).has("gift");

  return (
    <div className={classNames("flex flex-col gap-4", className)}>
      <Toggle
        value={!!gift}
        onChange={(checked) => {
          if (gift?.type === "anonymous") {
            setCancellingPresetGift(true);
          } else {
            dispatch({ type: "set-value", gift: checked ? { type: "normal", email: "", note: "" } : null });
          }
        }}
      >
        <h4>Give as a gift?</h4>
      </Toggle>

      {gift ? (
        <div className="flex w-full flex-col gap-4">
          {isMembership ? (
            <Alert variant="info">
              Note: Free trials will be charged immediately. The membership will not auto-renew. The recipient must
              update the payment method to renew the membership.
            </Alert>
          ) : null}
          {gift.type === "normal" ? (
            <fieldset className="flex flex-col space-y-2">
              <legend>
                <label htmlFor={giftEmailUID}>Recipient email</label>
              </legend>
              <Input
                id={giftEmailUID}
                type="email"
                value={gift.email}
                onChange={(evt) => dispatch({ type: "set-value", gift: { ...gift, email: evt.target.value } })}
                placeholder="Recipient email address"
                aria-invalid={hasError}
              />
            </fieldset>
          ) : (
            <Alert variant="info">
              {gift.name}'s email has been hidden for privacy purposes.{" "}
              <button className="underline" onClick={() => setCancellingPresetGift(true)}>
                Cancel gift option
              </button>
              <Modal
                open={cancellingPresetGift}
                onClose={() => setCancellingPresetGift(false)}
                footer={
                  <>
                    <Button onClick={() => setCancellingPresetGift(false)}>No, cancel</Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        dispatch({ type: "set-value", gift: null });
                        setCancellingPresetGift(false);
                      }}
                    >
                      Yes, reset
                    </Button>
                  </>
                }
                title="Reset gift option?"
              >
                You are about to switch off the gift option. To gift this wishlist again, you will need to return to the
                wishlist page and select "Gift this product".
              </Modal>
            </Alert>
          )}
          <fieldset className="flex flex-col space-y-2">
            <legend>
              <label htmlFor={giftNoteUID}>Message</label>
            </legend>
            <Textarea
              id={giftNoteUID}
              value={gift.note}
              onChange={(evt) => dispatch({ type: "set-value", gift: { ...gift, note: evt.target.value } })}
              placeholder="A personalized message (optional)"
            />
          </fieldset>
        </div>
      ) : null}
    </div>
  );
};
