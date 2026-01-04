import * as React from "react";
import { cast } from "ts-safe-cast";

import { asyncVoid } from "$app/utils/promise";
import { assertResponseError, request, ResponseError } from "$app/utils/request";

import { Button } from "$app/components/Button";
import { showAlert } from "$app/components/server-components/Alert";
import { Input } from "$app/components/Input";
import { Pill } from "$app/components/ui/Pill";
import { WithTooltip } from "$app/components/WithTooltip";

const NotificationEndpointSection = ({
  pingEndpoint,
  setPingEndpoint,
  userId,
}: {
  pingEndpoint: string;
  setPingEndpoint: (val: string) => void;
  userId: string;
}) => {
  const [isSendingPing, setIsSendingPing] = React.useState(false);
  const uid = React.useId();

  const sendTestPing = asyncVoid(async () => {
    if (pingEndpoint.trim().length === 0) {
      showAlert("Please provide a URL to send a test ping to.", "error");
      return;
    }

    setIsSendingPing(true);
    try {
      const response = await request({
        url: Routes.test_pings_path(),
        method: "POST",
        accept: "json",
        data: { url: pingEndpoint.trim() },
      });
      const responseData = cast<{ success: true; message: string } | { success: false; error_message: string }>(
        await response.json(),
      );
      if (!responseData.success) throw new ResponseError(responseData.error_message);
      showAlert(responseData.message, "success");
    } catch (e) {
      assertResponseError(e);
      showAlert(e.message, "error");
    }
    setIsSendingPing(false);
  });

  return (
    <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16 lg:pb-16">
      <header className="flex flex-col gap-3">
        <h2>Ping</h2>
        <a href={Routes.ping_path()} target="_blank" rel="noreferrer">
          Learn more
        </a>
      </header>
      <fieldset className="space-y-2">
        <legend>
          <label htmlFor={uid}>Ping endpoint</label>
        </legend>
        <Input
          placeholder="Ping endpoint"
          type="url"
          id={uid}
          value={pingEndpoint}
          onChange={(e) => setPingEndpoint(e.target.value)}
          trailing={
            <WithTooltip tip={isSendingPing ? null : "Send your most recent sale's JSON, with 'test' set to 'true'"}>
              <Pill asChild>
                <Button className="rounded-full! px-3! py-2!" onClick={sendTestPing} disabled={isSendingPing}>
                  {isSendingPing ? "Sending test ping..." : "Send test ping to URL"}
                </Button>
              </Pill>
            </WithTooltip>
          }
        />
        <small className="text-muted">For external services, your `seller_id` is {userId}</small>
      </fieldset>
    </section>
  );
};

export default NotificationEndpointSection;
