import { useForm, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { ThirdPartyAnalytics, Snippet, SNIPPET_LOCATIONS } from "$app/data/third_party_analytics";
import { SettingPage } from "$app/parsers/settings";

import { Button } from "$app/components/Button";
import { Checkbox } from "$app/components/Checkbox";

import { Icon } from "$app/components/Icons";
import { Input } from "$app/components/Input";
import { useLoggedInUser } from "$app/components/LoggedInUser";
import { Layout as SettingsLayout } from "$app/components/Settings/Layout";
import { ToggleSettingRow } from "$app/components/SettingRow";
import { Textarea } from "$app/components/Textarea";

import { TypeSafeOptionSelect } from "$app/components/TypeSafeOptionSelect";
import { Placeholder } from "$app/components/ui/Placeholder";
import { Row, RowActions, RowContent, RowDetails, Rows } from "$app/components/ui/Rows";

type Products = { permalink: string; name: string }[];

type ThirdPartyAnalyticsPageProps = {
  settings_pages: SettingPage[];
  third_party_analytics: ThirdPartyAnalytics;
  products: Products;
};

export default function ThirdPartyAnalyticsPage() {
  const props = cast<ThirdPartyAnalyticsPageProps>(usePage().props);
  const loggedInUser = useLoggedInUser();

  const form = useForm({
    user: props.third_party_analytics,
  });

  const thirdPartyAnalytics = form.data.user;
  const updateThirdPartyAnalytics = (update: Partial<ThirdPartyAnalytics>) =>
    form.setData("user", {
      ...form.data.user,
      ...update,
    });

  const uid = React.useId();

  const addSnippetButton = (
    <Button
      color="primary"
      onClick={() =>
        updateThirdPartyAnalytics({
          snippets: [
            ...thirdPartyAnalytics.snippets,
            { id: `${NEW_SNIPPET_ID_PREFIX}${Math.random()}`, name: "", location: "receipt", code: "", product: null },
          ],
        })
      }
    >
      <Icon name="plus" />
      Add snippet
    </Button>
  );
  const handleSave = () => {
    form.transform((data) => ({
      user: {
        ...data.user,
        snippets: data.user.snippets.map((snippet: Snippet) => ({
          ...snippet,
          id: snippet.id && !snippet.id.startsWith(NEW_SNIPPET_ID_PREFIX) ? snippet.id : null,
        })),
      },
    }));

    form.put(Routes.settings_third_party_analytics_path(), {
      preserveScroll: true,
    });
  };

  return (
    <SettingsLayout
      currentPage="third_party_analytics"
      pages={props.settings_pages}
      onSave={handleSave}
      canUpdate={Boolean(loggedInUser?.policies.settings_third_party_analytics_user.update) && !form.processing}
    >
      <form className="divide-y divide-border">
        <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16 lg:pb-16">
          <header className="flex flex-col gap-3">
            <h2>Third-party analytics</h2>
            <div className="flex flex-col gap-3">
              <a href="/help/article/174-third-party-analytics" target="_blank" rel="noreferrer">
                Learn more
              </a>
              <div>
                You can add a Facebook tracking pixel and link your Google Analytics properties to track your visitors.
              </div>
            </div>
          </header>
          <fieldset>
            <ToggleSettingRow
              label="Enable third-party analytics services"
              value={!thirdPartyAnalytics.disable_third_party_analytics}
              onChange={(checked) => updateThirdPartyAnalytics({ disable_third_party_analytics: !checked })}
              dropdown={
                <div className="flex flex-col gap-4">
                  <fieldset className="space-y-2">
                    <legend className="flex w-full justify-between">
                      <label htmlFor={`${uid}googleAnalyticsId`}>Google Analytics Property ID</label>
                      <a
                        href="/help/article/174-third-party-analytics"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </legend>
                    <Input
                      id={`${uid}googleAnalyticsId`}
                      type="text"
                      placeholder="G-ABCD232DSE"
                      value={thirdPartyAnalytics.google_analytics_id}
                      onChange={(evt) => updateThirdPartyAnalytics({ google_analytics_id: evt.target.value })}
                    />
                  </fieldset>
                  <fieldset className="space-y-2">
                    <legend className="flex w-full justify-between">
                      <label htmlFor={`${uid}facebookPixel`}>Facebook Pixel</label>
                      <a
                        href="/help/article/174-third-party-analytics"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </legend>
                    <Input
                      id={`${uid}facebookPixel`}
                      type="text"
                      placeholder="9127380912836192"
                      value={thirdPartyAnalytics.facebook_pixel_id}
                      onChange={(evt) => updateThirdPartyAnalytics({ facebook_pixel_id: evt.target.value })}
                    />
                  </fieldset>
                  <label className="flex cursor-pointer select-none items-center gap-2">
                    <Checkbox
                      checked={!thirdPartyAnalytics.skip_free_sale_analytics}
                      onChange={(evt) => updateThirdPartyAnalytics({ skip_free_sale_analytics: !evt.target.checked })}
                    />
                    Send 'Purchase' events for free ($0) sales
                  </label>
                </div>
              }
            />
          </fieldset>
        </section>
        <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16 lg:pb-16">
          <header>
            <h2>Domain verification</h2>
          </header>
          <fieldset>
            <ToggleSettingRow
              label="Verify domain in third-party services"
              value={thirdPartyAnalytics.enable_verify_domain_third_party_services}
              onChange={(checked) => updateThirdPartyAnalytics({ enable_verify_domain_third_party_services: checked })}
              dropdown={
                <div className="flex flex-col gap-8">
                  <fieldset className="space-y-2">
                    <legend className="flex w-full justify-between">
                      <label htmlFor={`${uid}facebookMetaTag`}>Facebook Business</label>
                      <a
                        href="/help/article/290-facebook-domain-verification"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </legend>
                    <Textarea
                      id={`${uid}facebookMetaTag`}
                      placeholder='<meta name="facebook-domain-verification" content="me2vv6lgwoh" />'
                      value={thirdPartyAnalytics.facebook_meta_tag}
                      onChange={(evt) => updateThirdPartyAnalytics({ facebook_meta_tag: evt.target.value })}
                    />
                    <small className="text-muted text-sm">
                      Enter meta tag containing the Facebook domain verification code.
                    </small>
                  </fieldset>
                </div>
              }
            />
          </fieldset>
        </section>
        <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16">
          <header className="flex flex-col gap-3">
            <h2>Snippets</h2>
            <div className="flex flex-col gap-3">
              <div>Add custom JavaScript to pages in the checkout flow.</div>
              <a href="/help/article/174-third-party-analytics" target="_blank" rel="noreferrer">
                Learn more
              </a>
            </div>
          </header>
          <div className="flex flex-col gap-4 lg:mb-8 gap-8">
            {thirdPartyAnalytics.snippets.length > 0 ? (
              <>
                <Rows role="list">
                  {thirdPartyAnalytics.snippets.map((snippet) => (
                    <SnippetRow
                      key={snippet.id}
                      snippet={snippet}
                      thirdPartyAnalytics={thirdPartyAnalytics}
                      updateThirdPartyAnalytics={updateThirdPartyAnalytics}
                      products={props.products}
                    />
                  ))}
                </Rows>
                {addSnippetButton}
              </>
            ) : (
              <Placeholder>{addSnippetButton}</Placeholder>
            )}
          </div>
        </section>
      </form>
    </SettingsLayout>
  );
}

const NEW_SNIPPET_ID_PREFIX = "__GUMROAD";

const LOCATION_TITLES: Record<string, string> = {
  receipt: "Receipt",
  product: "Product page",
  all: "All pages",
};

const SnippetRow = ({
  snippet,
  thirdPartyAnalytics,
  updateThirdPartyAnalytics,
  products,
}: {
  snippet: Snippet;
  thirdPartyAnalytics: ThirdPartyAnalytics;
  updateThirdPartyAnalytics: (update: Partial<ThirdPartyAnalytics>) => void;
  products: Products;
}) => {
  const [expanded, setExpanded] = React.useState(!!snippet.id?.startsWith(NEW_SNIPPET_ID_PREFIX));

  const updateSnippet = (update: Partial<Snippet>) => {
    const snippetIndex = thirdPartyAnalytics.snippets.findIndex(({ id }) => id === snippet.id);
    updateThirdPartyAnalytics({
      snippets: [
        ...thirdPartyAnalytics.snippets.slice(0, snippetIndex),
        { ...snippet, ...update },
        ...thirdPartyAnalytics.snippets.slice(snippetIndex + 1),
      ],
    });
  };

  const uid = React.useId();

  return (
    <Row role="listitem">
      <RowContent className="flex items-center gap-2">
        <Icon name="code-square" className="size-6 shrink-0" />
        <div className="flex flex-col">
          <h4>{snippet.name || "Untitled"}</h4>
          <ul className="flex list-none items-center gap-2 p-0">
            <li>{products.find(({ permalink }) => permalink === snippet.product)?.name ?? "All products"}</li>
            <li>·</li>
            <li>{LOCATION_TITLES[snippet.location]}</li>
          </ul>
        </div>
      </RowContent>
      <RowActions>
        <Button onClick={() => setExpanded((prevExpanded) => !prevExpanded)} aria-label="Edit snippet">
          {expanded ? <Icon name="outline-cheveron-up" /> : <Icon name="outline-cheveron-down" />}
        </Button>
        <Button
          onClick={() =>
            updateThirdPartyAnalytics({
              snippets: thirdPartyAnalytics.snippets.filter(({ id }) => id !== snippet.id),
            })
          }
          aria-label="Delete snippet"
        >
          <Icon name="trash2" />
        </Button>
      </RowActions>
      {expanded ? (
        <RowDetails className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">
              <label htmlFor={`${uid}name`}>Name</label>
            </legend>
            <Input
              id={`${uid}name`}
              type="text"
              value={snippet.name}
              onChange={(evt) => updateSnippet({ name: evt.target.value })}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">
              <label htmlFor={`${uid}location`}>Location</label>
            </legend>
            <TypeSafeOptionSelect
              id={`${uid}location`}
              value={snippet.location}
              onChange={(key) => updateSnippet({ location: key })}
              options={SNIPPET_LOCATIONS.map((location) => ({
                id: location,
                label: LOCATION_TITLES[location] ?? "Receipt",
              }))}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">
              <label htmlFor={`${uid}product`}>Products</label>
            </legend>
            <TypeSafeOptionSelect
              id={`${uid}product`}
              value={snippet.product ?? ""}
              onChange={(key) => updateSnippet({ product: key || null })}
              options={[
                { id: "", label: "All products" },
                ...products.map(({ permalink, name }) => ({
                  id: permalink,
                  label: name,
                })),
              ]}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">
              <label htmlFor={`${uid}code`}>Code</label>
            </legend>
            <Textarea
              id={`${uid}code`}
              placeholder="Enter your analytics code"
              value={snippet.code}
              onChange={(evt) => updateSnippet({ code: evt.target.value })}
            />
          </fieldset>
        </RowDetails>
      ) : null}
    </Row>
  );
};
