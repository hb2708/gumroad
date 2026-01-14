import { uniqBy } from "lodash-es";
import * as React from "react";

import { CustomFieldDescriptor } from "$app/parsers/product";

import { Checkbox } from "$app/components/Checkbox";
import { Creator } from "$app/components/Checkout/cartState";
import { Product, getCustomFieldKey, getErrors, isProcessing, useState } from "$app/components/Checkout/payment";
import { Input } from "$app/components/Input";
import { Card, CardContent } from "$app/components/ui/Card";

const CustomField = ({ field, fieldKey }: { field: CustomFieldDescriptor; fieldKey: string }) => {
  const [state, dispatch] = useState();
  const uid = React.useId();
  const hasError = getErrors(state).has(`customFields.${fieldKey}`);
  const value = state.customFieldValues[fieldKey];

  switch (field.type) {
    case "text": {
      return (
        <fieldset className="space-y-2">
          <legend>
            <label className="cursor-pointer" htmlFor={uid}>
              {field.name}
            </label>
          </legend>
          <Input
            id={uid}
            type="text"
            aria-invalid={hasError}
            placeholder={`${field.name}${field.required ? "" : " (optional)"}`}
            value={value ?? ""}
            onChange={(e) => dispatch({ type: "set-custom-field", key: fieldKey, value: e.target.value })}
            disabled={isProcessing(state)}
          />
        </fieldset>
      );
    }
    case "checkbox": {
      return (
        <fieldset>
          <label className="inline-flex cursor-pointer gap-2">
            <Checkbox
              checked={value === "true"}
              isInvalid={hasError}
              onChange={(e) =>
                dispatch({ type: "set-custom-field", key: fieldKey, value: e.target.checked ? "true" : "" })
              }
              disabled={isProcessing(state)}
            />
            {field.required ? field.name : `${field.name} (optional)`}
          </label>
        </fieldset>
      );
    }
    case "terms": {
      return (
        <fieldset>
          <label className="inline-flex cursor-pointer gap-2">
            <Checkbox
              checked={value === "true"}
              isInvalid={hasError}
              onChange={(e) =>
                dispatch({ type: "set-custom-field", key: fieldKey, value: e.target.checked ? "true" : "" })
              }
              disabled={isProcessing(state)}
            />
            I accept
            <a href={field.name} target="_blank" rel="noreferrer">
              Terms and Conditions
            </a>
          </label>
        </fieldset>
      );
    }
  }
};

type CustomFieldProduct = { permalink: string; name: string; bundleProductId: string | null };

const getCustomFields = (products: Product[]) => {
  const distinctCustomFields = new Map<string, { field: CustomFieldDescriptor; products: CustomFieldProduct[] }>();
  for (const product of products) {
    for (const { bundleProduct, ...field } of [
      ...product.customFields.map((field) => ({ ...field, bundleProduct: null })),
      ...product.bundleProductCustomFields.flatMap(({ product, customFields }) =>
        customFields.map((field) => ({ ...field, bundleProduct: product })),
      ),
    ]) {
      distinctCustomFields.set(field.id, {
        field,
        products: [
          ...(distinctCustomFields.get(field.id)?.products || []),
          {
            permalink: product.permalink,
            name: bundleProduct?.name || product.name,
            bundleProductId: bundleProduct?.id || null,
          },
        ],
      });
    }
  }

  const sharedCustomFields: CustomFieldDescriptor[] = [];
  const customFieldGroups: { product: CustomFieldProduct; customFields: CustomFieldDescriptor[] }[] = [];

  for (const { field, products } of distinctCustomFields.values()) {
    if (!field.collect_per_product && products.length > 1) {
      sharedCustomFields.push(field);
    } else {
      for (const product of products) {
        const group = customFieldGroups.find(
          ({ product: p }) => p.permalink === product.permalink && p.bundleProductId === product.bundleProductId,
        );
        if (group) {
          group.customFields.push(field);
        } else {
          customFieldGroups.push({
            product,
            customFields: [field],
          });
        }
      }
    }
  }

  return { sharedCustomFields, customFieldGroups };
};

const SellerCustomFields = ({ seller, className }: { seller: Creator; className?: string | undefined }) => {
  const [state] = useState();
  const { sharedCustomFields, customFieldGroups } = getCustomFields(
    state.products.filter(({ creator }) => creator.id === seller.id),
  );

  return sharedCustomFields.length > 0 ? (
    <div className={className}>
      <section className="flex grow flex-col gap-4">
        <h4 className="flex items-center font-bold">
          <img
            className="size-8 shrink-0 rounded-full border border-border"
            src={seller.avatar_url}
            alt={seller.name}
          />
          &ensp;
          {seller.name}
        </h4>
        {sharedCustomFields.map((field) => (
          <CustomField key={field.id} field={field} fieldKey={field.id} />
        ))}
        {customFieldGroups.map(({ product, customFields }) => (
          <fieldset key={`${product.permalink}-${product.bundleProductId}`} className="space-y-2">
            <legend>
              <label>{product.name}</label>
            </legend>
            <Card>
              <CardContent>
                <section className="flex grow flex-col gap-4">
                  {customFields.map((field) => (
                    <CustomField key={field.id} field={field} fieldKey={getCustomFieldKey(field, product)} />
                  ))}
                </section>
              </CardContent>
            </Card>
          </fieldset>
        ))}
      </section>
    </div>
  ) : (
    customFieldGroups.map(({ product, customFields }) => (
      <div key={`${product.permalink}-${product.bundleProductId}`} className={className}>
        <section className="flex grow flex-col gap-4">
          <h4 className="font-bold">{product.name}</h4>
          {customFields.map((field) => (
            <CustomField key={field.id} field={field} fieldKey={getCustomFieldKey(field, product)} />
          ))}
        </section>
      </div>
    ))
  );
};

export const CustomFields = ({ className }: { className?: string | undefined }) => {
  const [state] = useState();

  const sellers = uniqBy(
    state.products.map(({ creator }) => creator),
    "id",
  );

  return sellers.map((seller) => <SellerCustomFields key={seller.id} seller={seller} className={className} />);
};
