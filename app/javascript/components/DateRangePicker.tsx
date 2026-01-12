import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
  endOfQuarter,
  startOfQuarter,
  subQuarters,
} from "date-fns";
import * as React from "react";

import { DateInput } from "$app/components/DateInput";
import { Icon } from "$app/components/Icons";
import { Popover } from "$app/components/Popover";
import { useUserAgentInfo } from "$app/components/UserAgent";

export const DateRangePicker = ({
  from,
  to,
  setFrom,
  setTo,
}: {
  from: Date;
  to: Date;
  setFrom: (from: Date) => void;
  setTo: (to: Date) => void;
}) => {
  const today = new Date();
  const uid = React.useId();
  const [isCustom, setIsCustom] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { locale } = useUserAgentInfo();
  const quickSet = (from: Date, to: Date) => {
    setFrom(from);
    setTo(to);
    setOpen(false);
  };
  return (
    <Popover
      open={open}
      onToggle={(open) => {
        setIsCustom(false);
        setOpen(open);
      }}
      trigger={
        <div
          className="relative inline-flex h-12 cursor-pointer items-center gap-2 rounded border border-border bg-background px-4"
          aria-label="Date range selector"
        >
          <span suppressHydrationWarning>{Intl.DateTimeFormat(locale).formatRange(from, to)}</span>
          <Icon name="outline-cheveron-down" className="ml-auto" />
        </div>
      }
    >
      {isCustom ? (
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 flex w-full items-center text-base font-bold">
              <label htmlFor={`${uid}-from`} className="inline-flex cursor-pointer gap-2 text-base">
                From (including)
              </label>
            </legend>
            <DateInput
              id={`${uid}-from`}
              value={from}
              onChange={(date) => {
                if (date) setFrom(date);
              }}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 flex w-full items-center text-base font-bold">
              <label htmlFor={`${uid}-to`} className="inline-flex cursor-pointer gap-2 text-base">
                To (including)
              </label>
            </legend>
            <DateInput
              id={`${uid}-to`}
              value={to}
              onChange={(date) => {
                if (date) setTo(date);
              }}
              aria-invalid={to < from}
            />
            {to < from ? (
              <small className="text-sm text-danger-foreground">Must be after from date</small>
            ) : (
              <small className="text-sm text-muted" />
            )}
          </fieldset>
        </div>
      ) : (
        <div role="menu" className="py-2">
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(subDays(today, 30), today)}
          >
            Last 30 days
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(startOfMonth(today), today)}
          >
            This month
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              const lastMonth = subMonths(today, 1);
              quickSet(startOfMonth(lastMonth), endOfMonth(lastMonth));
            }}
          >
            Last month
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(startOfMonth(subMonths(today, 3)), endOfMonth(subMonths(today, 1)))}
          >
            Last 3 months
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(startOfQuarter(today), today)}
          >
            This quarter
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              const lastQuarter = subQuarters(today, 1);
              quickSet(startOfQuarter(lastQuarter), endOfQuarter(lastQuarter));
            }}
          >
            Last quarter
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(startOfYear(today), today)}
          >
            This year
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              const lastYear = subYears(today, 1);
              quickSet(startOfYear(lastYear), endOfYear(lastYear));
            }}
          >
            Last year
          </div>
          <div
            role="menuitem"
            className="cursor-pointer px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => quickSet(new Date("2012-10-13"), today)}
          >
            All time
          </div>
          <div
            role="menuitem"
            className="mt-1 cursor-pointer border-t border-border px-4 py-2 transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => setIsCustom(true)}
          >
            Custom range...
          </div>
        </div>
      )}
    </Popover>
  );
};
