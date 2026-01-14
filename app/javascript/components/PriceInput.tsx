import * as React from "react";

import { classNames } from "$app/utils/classNames";
import {
  CurrencyCode,
  formatPriceCentsWithoutCurrencySymbolAndComma,
  getLongCurrencySymbol,
  parseCurrencyUnitStringToCents,
} from "$app/utils/currency";

import { Icon } from "$app/components/Icons";
import { Input } from "$app/components/Input";
import { TypeSafeOptionSelect } from "$app/components/TypeSafeOptionSelect";
import { Pill } from "$app/components/ui/Pill";

export const PriceInput = React.forwardRef<
  HTMLInputElement,
  {
    currencyCode: CurrencyCode;
    currencyCodeSelector?: { options: CurrencyCode[]; onChange: (currencyCode: CurrencyCode) => void } | undefined;
    cents: number | null;
    onChange?: (cents: number | null) => void;
    id?: string;
    placeholder?: string;
    hasError?: boolean;
    ariaLabel?: string;
    onBlur?: () => void;
    disabled?: boolean;
    suffix?: React.ReactNode;
    className?: string;
  }
>(
  (
    {
      currencyCode,
      currencyCodeSelector,
      cents,
      onChange,
      id,
      placeholder,
      hasError,
      ariaLabel,
      onBlur,
      disabled,
      suffix,
      className,
    },
    ref,
  ) => {
    const parsedValue = cents == null ? "" : formatPriceCentsWithoutCurrencySymbolAndComma(currencyCode, cents);
    const [value, setValue] = React.useState(parsedValue);
    React.useEffect(() => {
      if (parseCurrencyUnitStringToCents(currencyCode, value) !== cents) setValue(parsedValue);
    }, [parsedValue]);
    const handleChange = (newValue: string) => {
      newValue = newValue.replace(/[.,]+/gu, ".").replace(/(\.\d{1,2}).*/u, "$1");
      let cents = parseCurrencyUnitStringToCents(currencyCode, newValue);
      if (cents != null && !/[.,]\d?$/u.test(newValue)) {
        if (isNaN(cents) || cents < 0) cents = 0;
        newValue = formatPriceCentsWithoutCurrencySymbolAndComma(currencyCode, cents);
      }
      setValue(newValue);
      onChange?.(cents);
    };
    const currencyPill = currencyCodeSelector ? (
      <Pill className="relative -ml-2 flex shrink-0 cursor-pointer items-center justify-center border border-border px-3">
        {getLongCurrencySymbol(currencyCode)}
        <Icon name="outline-cheveron-down" />
        <TypeSafeOptionSelect
          name="Currency"
          value={currencyCode}
          onChange={currencyCodeSelector.onChange}
          options={currencyCodeSelector.options.map((currencyCode) => ({
            id: currencyCode,
            label: getLongCurrencySymbol(currencyCode),
          }))}
          className="absolute inset-0 border-none p-0 opacity-0 [&_select]:absolute [&_select]:inset-0 [&_select]:h-full [&_select]:w-full [&_select]:cursor-pointer"
        />
      </Pill>
    ) : (
      <Pill className="relative -ml-2 flex h-10 shrink-0 items-center justify-center border border-border px-3">
        {getLongCurrencySymbol(currencyCode)}
      </Pill>
    );

    return (
      <Input
        inputMode="decimal"
        id={id}
        value={value}
        onChange={(evt) => handleChange(evt.target.value)}
        maxLength={10}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={hasError}
        aria-label={ariaLabel}
        onBlur={onBlur}
        disabled={disabled}
        ref={ref}
        leading={currencyPill}
        trailing={suffix}
        className={classNames(hasError && "border-danger", className)}
      />
    );
  },
);
PriceInput.displayName = "PriceInput";
