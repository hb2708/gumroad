import { Link, useForm, usePage } from "@inertiajs/react";
import * as React from "react";

import { AuthAlert } from "$app/components/AuthAlert";
import { Layout } from "$app/components/Authentication/Layout";
import { Button } from "$app/components/Button";
import { PasswordInput } from "$app/components/PasswordInput";

type PageProps = {
  reset_password_token: string;
};

function PasswordReset() {
  const { reset_password_token } = usePage<PageProps>().props;
  const uid = React.useId();

  const form = useForm({
    user: {
      password: "",
      password_confirmation: "",
      reset_password_token,
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.put(Routes.user_password_path());
  };

  return (
    <Layout header={<h1>Reset your password</h1>} headerActions={<Link href={Routes.login_path()}>Log in</Link>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <section className="flex flex-col gap-8 pb-12">
          <AuthAlert />
          <fieldset className="flex flex-col space-y-2">
            <legend className="cursor-pointer">
              <label htmlFor={`${uid}-password`}>Enter a new password</label>
            </legend>
            <PasswordInput
              id={`${uid}-password`}
              value={form.data.user.password}
              onChange={(e) => form.setData("user.password", e.target.value)}
              placeholder="Password"
              required
              autoFocus
              autoComplete="new-password"
            />
          </fieldset>
          <fieldset className="flex flex-col space-y-2">
            <legend>
              <label className="cursor-pointer" htmlFor={`${uid}-password-confirmation`}>
                Enter same password to confirm
              </label>
            </legend>
            <PasswordInput
              id={`${uid}-password-confirmation`}
              value={form.data.user.password_confirmation}
              onChange={(e) => form.setData("user.password_confirmation", e.target.value)}
              placeholder="Password (to confirm)"
              required
              autoComplete="new-password"
            />
          </fieldset>
          <Button color="primary" type="submit" disabled={form.processing}>
            {form.processing ? "Resetting..." : "Reset password"}
          </Button>
        </section>
      </form>
    </Layout>
  );
}

PasswordReset.disableLayout = true;
export default PasswordReset;
