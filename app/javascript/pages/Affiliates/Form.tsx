import * as React from "react";

import { Input } from "$app/components/Input";
import { NumberInput } from "$app/components/NumberInput";
import { Toggle } from "$app/components/Toggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$app/components/ui/Table";

export type AffiliateProduct = {
  id: number;
  name: string;
  enabled: boolean;
  fee_percent: number | null;
  destination_url: string | null;
  referral_url: string;
};

export type AffiliateFormData = {
  email: string;
  products: AffiliateProduct[];
  fee_percent: number | null;
  apply_to_all_products: boolean;
  destination_url: string | null;
};

type Props = {
  data: AffiliateFormData;
  errors: Record<string, string>;
  processing: boolean;
  applyToAllProducts: boolean;
  uid: string;
  emailField: React.ReactNode;
  headerText: string;
  onToggleAllProducts: (checked: boolean) => void;
  onUpdateFeePercent: (value: number | null) => void;
  onUpdateDestinationUrl: (value: string) => void;
  onUpdateProduct: (productId: number, updates: Partial<AffiliateProduct>) => void;
};

export const AffiliateForm = ({
  data,
  errors,
  processing,
  applyToAllProducts,
  uid,
  emailField,
  headerText,
  onToggleAllProducts,
  onUpdateFeePercent,
  onUpdateDestinationUrl,
  onUpdateProduct,
}: Props) => (
  <section className="grid gap-8 p-4 md:p-8 lg:grid-cols-[25%_1fr] lg:gap-x-16 lg:pb-16">
    <header
      className="flex flex-col gap-3 lg:row-[1/3]"
      dangerouslySetInnerHTML={{
        __html: `${headerText} <a href='/help/article/333-affiliates-on-gumroad' target='_blank' rel='noreferrer'>Learn more</a>`,
      }}
    />
    {emailField}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Enable</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>
            <a href="/help/article/333-affiliates-on-gumroad" target="_blank" rel="noreferrer">
              Destination URL (optional)
            </a>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Toggle
              id={`${uid}enableAllProducts`}
              value={applyToAllProducts}
              onChange={onToggleAllProducts}
              ariaLabel="Enable all products"
            />
          </TableCell>
          <TableCell>
            <label htmlFor={`${uid}enableAllProducts`} className="cursor-pointer">
              All products
            </label>
          </TableCell>
          <TableCell>
            <NumberInput onChange={(value) => onUpdateFeePercent(value)} value={data.fee_percent}>
              {(inputProps) => (
                <Input
                  placeholder="Commission"
                  disabled={processing || !applyToAllProducts}
                  trailing="%"
                  aria-invalid={!!errors["affiliate.fee_percent"]}
                  {...inputProps}
                />
              )}
            </NumberInput>
          </TableCell>
          <TableCell>
            <Input
              type="url"
              value={data.destination_url || ""}
              placeholder="https://link.com"
              onChange={(e) => onUpdateDestinationUrl(e.target.value)}
              disabled={processing || !applyToAllProducts}
              aria-invalid={!!errors["affiliate.destination_url"]}
            />
          </TableCell>
        </TableRow>
        {data.products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Toggle
                value={product.enabled}
                onChange={(newValue) => onUpdateProduct(product.id, { enabled: newValue })}
                disabled={processing}
                ariaLabel="Enable product"
              />
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <NumberInput
                onChange={(value) => onUpdateProduct(product.id, { fee_percent: value })}
                value={product.fee_percent}
              >
                {(inputProps) => (
                  <Input
                    placeholder="Commission"
                    disabled={processing || !product.enabled}
                    trailing="%"
                    {...inputProps}
                    aria-invalid={!!errors[`affiliate.products.${product.id}.fee_percent`]}
                  />
                )}
              </NumberInput>
            </TableCell>
            <TableCell>
              <Input
                placeholder="https://link.com"
                value={product.destination_url || ""}
                onChange={(e) => onUpdateProduct(product.id, { destination_url: e.target.value })}
                disabled={processing || !product.enabled}
                aria-invalid={!!errors[`affiliate.products.${product.id}.destination_url`]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </section>
);
