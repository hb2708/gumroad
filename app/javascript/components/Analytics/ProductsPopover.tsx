import * as React from "react";

import { type Product } from "$app/components/Analytics";
import { Button } from "$app/components/Button";
import { Checkbox } from "$app/components/Checkbox";
import { Icon } from "$app/components/Icons";
import { Popover } from "$app/components/Popover";
import { Card, CardContent } from "$app/components/ui/Card";

export type ProductOption = Product & { selected: boolean };

export const ProductsPopover = ({
  products,
  setProducts,
}: {
  products: ProductOption[];
  setProducts: React.Dispatch<React.SetStateAction<ProductOption[]>>;
}) => (
  <Popover
    dropdownClassName="p-0!"
    trigger={
      <span className="relative inline-flex h-12 cursor-pointer items-center gap-2 rounded border border-border bg-background px-4">
        <div className="flex-1 truncate">Select products...</div>
        <Icon name="outline-cheveron-down" />
      </span>
    }
  >
    <Card className="border-none shadow-none">
      <CardContent>
        <fieldset className="flex grow basis-0 flex-col gap-2">
          <label className="flex cursor-pointer gap-2">
            <Checkbox
              checked={products.filter((product) => product.selected).length === products.length}
              onChange={(event) =>
                setProducts((prevProducts) =>
                  prevProducts.map((product) => ({ ...product, selected: event.target.checked })),
                )
              }
            />
            All products
          </label>
          {products.map(({ id, name, unique_permalink, selected }) => (
            <label key={id} className="flex cursor-pointer gap-2">
              <Checkbox
                checked={selected}
                onChange={(event) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                      product.unique_permalink === unique_permalink
                        ? { ...product, selected: event.target.checked }
                        : product,
                    ),
                  )
                }
              />
              {name}
            </label>
          ))}
        </fieldset>
      </CardContent>
      <CardContent>
        <Button
          onClick={() =>
            setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, selected: !product.selected })))
          }
          className="grow basis-0"
        >
          Toggle selected
        </Button>
      </CardContent>
    </Card>
  </Popover>
);
