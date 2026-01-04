import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";
import * as React from "react";
import { cast } from "ts-safe-cast";

import type { ComplianceInfo, FormFieldName, User } from "$app/types/payments";

import { Button } from "$app/components/Button";
import { Icon } from "$app/components/Icons";
import { classNames } from "$app/utils/classNames";
import { Input } from "$app/components/Input";
import { Select } from "$app/components/TypeSafeOptionSelect";
import { Checkbox } from "$app/components/Checkbox";

const AccountDetailsSection = ({
  user,
  complianceInfo,
  updateComplianceInfo,
  isFormDisabled,
  minDobYear,
  countries,
  uaeBusinessTypes,
  indiaBusinessTypes,
  canadaBusinessTypes,
  states,
  errorFieldNames,
}: {
  user: User;
  complianceInfo: ComplianceInfo;
  updateComplianceInfo: (newComplianceInfo: Partial<ComplianceInfo>) => void;
  isFormDisabled: boolean;
  minDobYear: number;
  countries: Record<string, string>;
  uaeBusinessTypes: { code: string; name: string }[];
  indiaBusinessTypes: { code: string; name: string }[];
  canadaBusinessTypes: { code: string; name: string }[];
  states: {
    us: { code: string; name: string }[];
    ca: { code: string; name: string }[];
    au: { code: string; name: string }[];
    mx: { code: string; name: string }[];
    ae: { code: string; name: string }[];
    ir: { code: string; name: string }[];
    br: { code: string; name: string }[];
  };
  errorFieldNames: Set<FormFieldName>;
}) => {
  const uid = React.useId();

  const formatPhoneNumber = (phoneNumber: string, country_code: string | null) => {
    const countryCode: CountryCode = cast(country_code);
    return parsePhoneNumberFromString(phoneNumber, countryCode)?.format("E.164") ?? phoneNumber;
  };

  return (
    <section className="grid gap-8">
      {(complianceInfo.is_business ? complianceInfo.business_country !== "AE" : complianceInfo.country !== "AE") ? (
        <fieldset className="space-y-2">
          <legend className="flex w-full justify-between">
            <label>Account type</label>
            <a href="/help/article/260-your-payout-settings-page">What type of account should I choose?</a>
          </legend>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(15rem,100%),1fr))]" role="radiogroup">
            <Button
              role="radio"
              key="individual"
              aria-checked={!complianceInfo.is_business}
              onClick={() => updateComplianceInfo({ is_business: false })}
              disabled={isFormDisabled}
              className="items-start! justify-start! gap-3! text-left aria-checked:-translate-x-1 aria-checked:-translate-y-1 aria-checked:shadow aria-checked:bg-background aria-checked:transform-none!"
            >
              <Icon name="person" />
              <div>
              <h4 className="font-bold">Individual</h4>
              When you are selling as yourself
              </div>
            </Button>
            <Button
              role="radio"
              key="business"
              aria-checked={complianceInfo.is_business}
              onClick={() =>
                updateComplianceInfo({
                  is_business: true,
                  business_country: complianceInfo.business_country ?? complianceInfo.country,
                })
              }
              disabled={isFormDisabled}
              className="items-start! justify-start! gap-3! text-left aria-checked:-translate-x-1 aria-checked:-translate-y-1 aria-checked:shadow aria-checked:bg-background aria-checked:transform-none!"
            >
              <Icon name="shop-window" />
              <div>
              <h4 className="font-bold">Business</h4>
              When you are selling as a business
              </div>
            </Button>
          </div>
        </fieldset>
      ) : null}
      {complianceInfo.is_business ? (
        <section className="grid gap-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-business-legal-name`}>Legal business name</label>
              </legend>
              <Input
                id={`${uid}-business-legal-name`}
                placeholder="Acme"
                required={complianceInfo.is_business}
                value={complianceInfo.business_name || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("business_name")}
                onChange={(evt) => updateComplianceInfo({ business_name: evt.target.value })}
              />
            </fieldset>
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-business-type`}>Type</label>
              </legend>
              {complianceInfo.business_country === "AE" ? (
                <Select
                  id={`${uid}-business-type`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_type")}
                  value={complianceInfo.business_type || "Type"}
                  onChange={(evt) => updateComplianceInfo({ business_type: evt.target.value })}
                >
                  <option disabled>Type</option>
                  {uaeBusinessTypes.map((businessType) => (
                    <option key={businessType.code} value={businessType.code}>
                      {businessType.name}
                    </option>
                  ))}
                </Select>
              ) : complianceInfo.business_country === "IN" ? (
                <Select
                  id={`${uid}-business-type`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_type")}
                  value={complianceInfo.business_type || "Type"}
                  onChange={(evt) => updateComplianceInfo({ business_type: evt.target.value })}
                >
                  <option disabled>Type</option>
                  {indiaBusinessTypes.map((businessType) => (
                    <option key={businessType.code} value={businessType.code}>
                      {businessType.name}
                    </option>
                  ))}
                </Select>
              ) : complianceInfo.business_country === "CA" ? (
                <Select
                  id={`${uid}-business-type`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_type")}
                  value={complianceInfo.business_type || "Type"}
                  onChange={(evt) => updateComplianceInfo({ business_type: evt.target.value })}
                >
                  <option disabled>Type</option>
                  {canadaBusinessTypes.map((businessType) => (
                    <option key={businessType.code} value={businessType.code}>
                      {businessType.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Select
                  id={`${uid}-business-type`}
                  disabled={isFormDisabled}
                  value={complianceInfo.business_type || "Type"}
                  required
                  aria-invalid={errorFieldNames.has("business_type")}
                  onChange={(evt) => updateComplianceInfo({ business_type: evt.target.value })}
                >
                  <option disabled>Type</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="profit">Non Profit</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="corporation">Corporation</option>
                </Select>
              )}
            </fieldset>
          </div>
          {complianceInfo.business_country === "JP" ? (
            <div className="grid grid-flow-col auto-cols-fr gap-6">
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-name-kanji`}>Business Name (Kanji)</label>
                </legend>
                <Input
                  id={`${uid}-business-name-kanji`}
                  type="text"
                  placeholder="Legal Business Name (Kanji)"
                  value={complianceInfo.business_name_kanji || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_name_kanji")}
                  required
                  onChange={(evt) => updateComplianceInfo({ business_name_kanji: evt.target.value })}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-name-kana`}>Legal Business Name (Kana)</label>
                </legend>
                <Input
                  id={`${uid}-business-name-kana`}
                  type="text"
                  placeholder="Business Name (Kana)"
                  value={complianceInfo.business_name_kana || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_name_kana")}
                  required
                  onChange={(evt) => updateComplianceInfo({ business_name_kana: evt.target.value })}
                />
              </fieldset>
            </div>
          ) : null}
          {complianceInfo.business_country === "JP" ? (
            <div className="grid grid-flow-col auto-cols-fr gap-6">
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-building-number`}>Business Block / Building Number</label>
                </legend>
                <Input
                  id={`${uid}-business-building-number`}
                  type="text"
                  placeholder="1-1"
                  value={complianceInfo.business_building_number || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_building_number")}
                  required
                  onChange={(evt) => updateComplianceInfo({ business_building_number: evt.target.value })}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-street-address-kanji`}>Business Street Address (Kanji)</label>
                </legend>
                <Input
                  id={`${uid}-business-street-address-kanji`}
                  type="text"
                  placeholder="Business Street Address (Kanji)"
                  value={complianceInfo.business_street_address_kanji || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_street_address_kanji")}
                  required
                  onChange={(evt) => updateComplianceInfo({ business_street_address_kanji: evt.target.value })}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-street-address-kana`}>Business Street Address (Kana)</label>
                </legend>
                <Input
                  id={`${uid}-business-street-address-kana`}
                  type="text"
                  placeholder="Business Street Address (Kana)"
                  value={complianceInfo.business_street_address_kana || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_street_address_kana")}
                  required
                  onChange={(evt) => updateComplianceInfo({ business_street_address_kana: evt.target.value })}
                />
              </fieldset>
            </div>
          ) : (
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-business-street-address`}>Address</label>
              </legend>
              <Input
                id={`${uid}-business-street-address`}
                placeholder="123 smith street"
                value={complianceInfo.business_street_address || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("business_street_address")}
                onChange={(evt) => updateComplianceInfo({ business_street_address: evt.target.value })}
              />
            </fieldset>
          )}
          <div className="grid grid-flow-col auto-cols-fr gap-6">
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-business-city`}>City</label>
              </legend>
              <Input
                id={`${uid}-business-city`}
                placeholder="Springfield"
                value={complianceInfo.business_city || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("business_city")}
                onChange={(evt) => updateComplianceInfo({ business_city: evt.target.value })}
              />
            </fieldset>
            {complianceInfo.business_country === "US" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-state`}>State</label>
                </legend>
                <Select
                  id={`${uid}-business-state`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    State
                  </option>
                  {states.us.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : complianceInfo.business_country === "CA" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-province`}>Province</label>
                </legend>
                <Select
                  id={`${uid}-business-province`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    Province
                  </option>
                  {states.ca.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : complianceInfo.business_country === "AU" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-state`}>State</label>
                </legend>
                <Select
                  id={`${uid}-business-state`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    State
                  </option>
                  {states.au.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : complianceInfo.business_country === "MX" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-state`}>State</label>
                </legend>
                <Select
                  id={`${uid}-business-state`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    State
                  </option>
                  {states.mx.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : complianceInfo.business_country === "AE" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-state`}>Province</label>
                </legend>
                <Select
                  id={`${uid}-business-state`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    Province
                  </option>
                  {states.ae.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : complianceInfo.business_country === "IE" ? (
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-business-county`}>County</label>
                </legend>
                <Select
                  id={`${uid}-business-county`}
                  required={complianceInfo.is_business}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("business_state")}
                  value={complianceInfo.business_state || ""}
                  onChange={(evt) => updateComplianceInfo({ business_state: evt.target.value })}
                >
                  <option value="" disabled>
                    County
                  </option>
                  {states.ir.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </fieldset>
            ) : null}
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-business-zip-code`}>
                  {complianceInfo.business_country === "US" ? "ZIP code" : "Postal code"}
                </label>
              </legend>
              <Input
                id={`${uid}-business-zip-code`}
                placeholder="12345"
                required={complianceInfo.is_business}
                value={complianceInfo.business_zip_code || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("business_zip_code")}
                onChange={(evt) => updateComplianceInfo({ business_zip_code: evt.target.value })}
              />
            </fieldset>
          </div>
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-business-country`}>Country</label>
            </legend>
            <Select
              id={`${uid}-business-country`}
              value={complianceInfo.business_country || ""}
              disabled={isFormDisabled}
              required={complianceInfo.is_business}
              onChange={(evt) => updateComplianceInfo({ updated_country_code: evt.target.value })}
            >
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code} disabled={name.includes("(not supported)")}>
                  {name}
                </option>
              ))}
            </Select>
          </fieldset>
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-business-phone-number`}>Business phone number</label>
            </legend>
            <Input
              id={`${uid}-business-phone-number`}
              type="tel"
              placeholder="555-555-5555"
              required={complianceInfo.is_business}
              value={complianceInfo.business_phone || ""}
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("business_phone")}
              onChange={(evt) =>
                updateComplianceInfo({
                  business_phone: formatPhoneNumber(evt.target.value, complianceInfo.business_country),
                })
              }
            />
          </fieldset>
          {user.country_supports_native_payouts || complianceInfo.business_country === "AE" ? (
            <fieldset className="space-y-2">
              {complianceInfo.business_country === "US" ? (
                <>
                  <legend className="flex w-full justify-between">
                    <label htmlFor={`${uid}-business-tax-id`}>Business Tax ID (EIN, or SSN for sole proprietors)</label>
                    <a href="/help/article/260-your-payout-settings-page">I'm not sure what my Tax ID is.</a>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12-3456789"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : complianceInfo.business_country === "CA" ? (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Business Number (BN)</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "123456789"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : complianceInfo.business_country === "AU" ? (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Australian Business Number (ABN)</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12 123 456 789"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : complianceInfo.business_country === "GB" ? (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Company Number (CRN)</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12345678"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : complianceInfo.business_country === "AE" ? (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Company tax ID</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12345678"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : complianceInfo.business_country === "MX" ? (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Business RFC</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12345678"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              ) : (
                <>
                  <legend>
                    <label htmlFor={`${uid}-business-tax-id`}>Company tax ID</label>
                  </legend>
                  <Input
                    id={`${uid}-business-tax-id`}
                    type="text"
                    placeholder={user.business_tax_id_entered ? "Hidden for security" : "12345678"}
                    required={complianceInfo.is_business}
                    disabled={isFormDisabled}
                    aria-invalid={errorFieldNames.has("business_tax_id")}
                    onChange={(evt) => updateComplianceInfo({ business_tax_id: evt.target.value })}
                  />
                </>
              )}
            </fieldset>
          ) : null}
          <fieldset className="flex items-center gap-2">
            <legend>
            <label htmlFor={`${uid}-personal-address-is-business-address`} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                id={`${uid}-personal-address-is-business-address`}
                disabled={isFormDisabled}
                onChange={(e) =>
                  e.target.checked &&
                  updateComplianceInfo({
                    street_address: complianceInfo.business_street_address,
                    city: complianceInfo.business_city,
                    state: complianceInfo.business_state,
                    zip_code: complianceInfo.business_zip_code,
                  })
                }
              />
              Same as business
            </label>
            </legend>
          </fieldset>
        </section>
      ) : null}
      <section className="grid gap-8">
        <div className="grid grid-flow-col auto-cols-fr gap-6">
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-first-name`}>First name</label>
            </legend>
            <Input
              id={`${uid}-creator-first-name`}
              type="text"
              placeholder="First name"
              value={complianceInfo.first_name || ""}
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("first_name")}
              required
              onChange={(evt) => updateComplianceInfo({ first_name: evt.target.value })}
            />
            <small className="text-muted">Include your middle name if it appears on your ID.</small>
          </fieldset>
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-last-name`}>Last name</label>
            </legend>
            <Input
              id={`${uid}-creator-last-name`}
              type="text"
              placeholder="Last name"
              value={complianceInfo.last_name || ""}
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("last_name")}
              required
              onChange={(evt) => updateComplianceInfo({ last_name: evt.target.value })}
            />
          </fieldset>
        </div>
        {complianceInfo.is_business && complianceInfo.country === "CA" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-job-title`}>Job title</label>
            </legend>
            <Input
              id={`${uid}-creator-job-title`}
              type="text"
              placeholder="CEO"
              value={complianceInfo.job_title || ""}
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("job_title")}
              required
              onChange={(evt) => updateComplianceInfo({ job_title: evt.target.value })}
            />
          </fieldset>
        ) : null}
        {complianceInfo.country === "JP" ? (
          <>
            <div className="grid grid-flow-col auto-cols-fr gap-6">
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-creator-first-name-kanji`}>First name (Kanji)</label>
                </legend>
                <Input
                  id={`${uid}-creator-first-name-kanji`}
                  type="text"
                  placeholder="First name (Kanji)"
                  value={complianceInfo.first_name_kanji || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("first_name_kanji")}
                  required
                  onChange={(evt) => updateComplianceInfo({ first_name_kanji: evt.target.value })}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-creator-last-name-kanji`}>Last name (Kanji)</label>
                </legend>
                <Input
                  id={`${uid}-creator-last-name-kanji`}
                  type="text"
                  placeholder="Last name (Kanji)"
                  value={complianceInfo.last_name_kanji || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("last_name_kanji")}
                  required
                  onChange={(evt) => updateComplianceInfo({ last_name_kanji: evt.target.value })}
                />
              </fieldset>
            </div>
            <div className="grid grid-flow-col auto-cols-fr gap-6">
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-creator-first-name-kana`}>First name (Kana)</label>
                </legend>
                <Input
                  id={`${uid}-creator-first-name-kana`}
                  type="text"
                  placeholder="First name (Kana)"
                  value={complianceInfo.first_name_kana || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("first_name_kana")}
                  required
                  onChange={(evt) => updateComplianceInfo({ first_name_kana: evt.target.value })}
                />
              </fieldset>
              <fieldset className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-creator-last-name-kana`}>Last name (Kana)</label>
                </legend>
                <Input
                  id={`${uid}-creator-last-name-kana`}
                  type="text"
                  placeholder="Last name (Kana)"
                  value={complianceInfo.last_name_kana || ""}
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("last_name_kana")}
                  required
                  onChange={(evt) => updateComplianceInfo({ last_name_kana: evt.target.value })}
                />
              </fieldset>
            </div>
          </>
        ) : null}
        {complianceInfo.country === "JP" ? (
          <div className="grid grid-flow-col auto-cols-fr gap-6">
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-creator-building-number`}>Block / Building Number</label>
              </legend>
              <Input
                id={`${uid}-creator-building-number`}
                type="text"
                placeholder="1-1"
                value={complianceInfo.building_number || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("building_number")}
                required
                onChange={(evt) => updateComplianceInfo({ building_number: evt.target.value })}
              />
            </fieldset>
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-creator-street-address-kanji`}>Street Address (Kanji)</label>
              </legend>
              <Input
                id={`${uid}-creator-street-address-kanji`}
                type="text"
                placeholder="Street Address (Kanji)"
                value={complianceInfo.street_address_kanji || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("street_address_kanji")}
                required
                onChange={(evt) => updateComplianceInfo({ street_address_kanji: evt.target.value })}
              />
            </fieldset>
            <fieldset className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-creator-street-address-kana`}>Street Address (Kana)</label>
              </legend>
              <Input
                id={`${uid}-creator-street-address-kana`}
                type="text"
                placeholder="Street Address (Kana)"
                value={complianceInfo.street_address_kana || ""}
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("street_address_kana")}
                required
                onChange={(evt) => updateComplianceInfo({ street_address_kana: evt.target.value })}
              />
            </fieldset>
          </div>
        ) : (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-street-address`}>Address</label>
            </legend>
            <Input
              id={`${uid}-creator-street-address`}
              type="text"
              placeholder="Street address"
              required
              value={complianceInfo.street_address || ""}
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("street_address")}
              onChange={(evt) => updateComplianceInfo({ street_address: evt.target.value })}
            />
          </fieldset>
        )}
      </section>
      <div className="grid grid-flow-col auto-cols-fr gap-6">
        <fieldset className="space-y-2">
          <legend>
            <label htmlFor={`${uid}-creator-city`}>City</label>
          </legend>
          <Input
            id={`${uid}-creator-city`}
            type="text"
            placeholder="City"
            value={complianceInfo.city || ""}
            disabled={isFormDisabled}
            aria-invalid={errorFieldNames.has("city")}
            required
            onChange={(evt) => updateComplianceInfo({ city: evt.target.value })}
          />
        </fieldset>
        {complianceInfo.country === "US" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-state`}>State</label>
            </legend>
            <Select
              id={`${uid}-creator-state`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                State
              </option>
              {states.us.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "CA" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-province`}>Province</label>
            </legend>
            <Select
              id={`${uid}-creator-province`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                Province
              </option>
              {states.ca.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "AU" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-state`}>State</label>
            </legend>
            <Select
              id={`${uid}-creator-state`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                State
              </option>
              {states.au.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "MX" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-state`}>State</label>
            </legend>
            <Select
              id={`${uid}-creator-state`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                State
              </option>
              {states.mx.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "AE" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-province`}>Province</label>
            </legend>
            <Select
              id={`${uid}-creator-province`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                Province
              </option>
              {states.ae.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "IE" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-county`}>County</label>
            </legend>
            <Select
              id={`${uid}-creator-county`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                County
              </option>
              {states.ir.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : complianceInfo.country === "BR" ? (
          <fieldset className="space-y-2">
            <legend>
              <label htmlFor={`${uid}-creator-state`}>State</label>
            </legend>
            <Select
              id={`${uid}-creator-state`}
              required
              disabled={isFormDisabled}
              aria-invalid={errorFieldNames.has("state")}
              value={complianceInfo.state || ""}
              onChange={(evt) => updateComplianceInfo({ state: evt.target.value })}
            >
              <option value="" disabled>
                State
              </option>
              {states.br.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </fieldset>
        ) : null}
        <fieldset className="space-y-2">
          <legend>
            <label htmlFor={`${uid}-creator-zip-code`}>
              {complianceInfo.country === "US" ? "ZIP code" : "Postal code"}
            </label>
          </legend>
          <Input
            id={`${uid}-creator-zip-code`}
            type="text"
            placeholder={complianceInfo.country === "US" ? "ZIP code" : "Postal code"}
            value={complianceInfo.zip_code || ""}
            disabled={isFormDisabled}
            aria-invalid={errorFieldNames.has("zip_code")}
            required
            onChange={(evt) => updateComplianceInfo({ zip_code: evt.target.value })}
          />
        </fieldset>
      </div>
      <fieldset className="space-y-2">
        <legend>
          <label htmlFor={`${uid}-creator-country`}>Country</label>
        </legend>
        <Select
          id={`${uid}-creator-country`}
          disabled={isFormDisabled}
          value={complianceInfo.country || ""}
          onChange={(evt) =>
            updateComplianceInfo(
              complianceInfo.is_business ? { country: evt.target.value } : { updated_country_code: evt.target.value },
            )
          }
        >
          {Object.entries(countries).map(([code, name]) => (
            <option key={code} value={code} disabled={name.includes("(not supported)")}>
              {name}
            </option>
          ))}
        </Select>
      </fieldset>
      <fieldset className="space-y-2">
        <legend>
          <label htmlFor={`${uid}-creator-phone`}>Phone number</label>
        </legend>
        <Input
          id={`${uid}-creator-phone`}
          type="tel"
          placeholder="Phone number"
          value={complianceInfo.phone || ""}
          disabled={isFormDisabled}
          aria-invalid={errorFieldNames.has("phone")}
          required
          onChange={(evt) =>
            updateComplianceInfo({ phone: formatPhoneNumber(evt.target.value, complianceInfo.country) })
          }
        />
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="flex w-full justify-between">
          <label>Date of Birth</label>
          <a href="/help/article/260-your-payout-settings-page">Why does Gumroad need this information?</a>
        </legend>
        <div className="grid grid-flow-col auto-cols-fr gap-6">
          <fieldset className={classNames(
              "space-y-2",
              complianceInfo.country !== "US" ? "col-start-2" : "col-start-1"
            )}>
            <Select
              id={`${uid}-creator-dob-month`}
              disabled={isFormDisabled}
              required
              aria-label="Month"
              aria-invalid={errorFieldNames.has("dob_month")}
              value={complianceInfo.dob_month || "Month"}
              onChange={(evt) => updateComplianceInfo({ dob_month: Number(evt.target.value) })}
            >
              <option disabled>Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </Select>
          </fieldset>
          <fieldset
            className={classNames(
              "space-y-2",
              complianceInfo.country !== "US" ? "col-start-1" : "col-start-2"
            )}
          >
            <Select
              id={`${uid}-creator-dob-day`}
              disabled={isFormDisabled}
              required
              aria-label="Day"
              aria-invalid={errorFieldNames.has("dob_day")}
              value={complianceInfo.dob_day || "Day"}
              onChange={(evt) => updateComplianceInfo({ dob_day: Number(evt.target.value) })}
            >
              <option disabled>Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
          </fieldset>
          <fieldset className="space-y-2">
            <Select
              id={`${uid}-creator-dob-year`}
              disabled={isFormDisabled}
              required
              aria-label="Year"
              aria-invalid={errorFieldNames.has("dob_year")}
              value={complianceInfo.dob_year || "Year"}
              onChange={(evt) => updateComplianceInfo({ dob_year: Number(evt.target.value) })}
            >
              <option disabled>Year</option>
              {Array.from({ length: minDobYear - 1900 }, (_, i) => i + 1900).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </fieldset>
        </div>
      </fieldset>
      {user.country_code === "AE" ||
      user.country_code === "SG" ||
      user.country_code === "PK" ||
      user.country_code === "BD" ? (
        <fieldset className="space-y-2">
          <legend>
            <label htmlFor={`${uid}-nationality`}>Nationality</label>
          </legend>
          <Select
            id={`${uid}-nationality`}
            disabled={isFormDisabled}
            aria-invalid={errorFieldNames.has("nationality")}
            value={complianceInfo.nationality || "Nationality"}
            onChange={(evt) => updateComplianceInfo({ nationality: evt.target.value })}
          >
            <option disabled>Nationality</option>
            {Object.entries(countries).map(([code, name]) => (
              <option key={code} value={code} disabled={name.includes("(not supported)")}>
                {name}
              </option>
            ))}
          </Select>
        </fieldset>
      ) : null}
      {(complianceInfo.is_business &&
        complianceInfo.business_country !== null &&
        user.individual_tax_id_needed_countries.includes(complianceInfo.business_country)) ||
      (complianceInfo.country !== null && user.individual_tax_id_needed_countries.includes(complianceInfo.country)) ? (
        <fieldset className="space-y-2">
          {complianceInfo.country === "US" ? (
            user.need_full_ssn ? (
              <div className="space-y-2">
                <legend>
                  <label
                    htmlFor={`${uid}-social-security-number-full`}
                  >
                    Social Security Number
                  </label>
                </legend>
                <Input
                  id={`${uid}-social-security-number-full`}
                  type="text"
                  minLength={9}
                  maxLength={11}
                  placeholder={user.individual_tax_id_entered ? "Hidden for security" : "•••-••-••••"}
                  required
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("individual_tax_id")}
                  onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <legend>
                  <label htmlFor={`${uid}-social-security-number`}>Last 4 digits of SSN</label>
                </legend>
                <Input
                  id={`${uid}-social-security-number`}
                  type="text"
                  minLength={4}
                  maxLength={4}
                  placeholder={user.individual_tax_id_entered ? "Hidden for security" : "••••"}
                  required
                  disabled={isFormDisabled}
                  aria-invalid={errorFieldNames.has("individual_tax_id")}
                  onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
                />
              </div>
            )
          ) : complianceInfo.country === "CA" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-social-insurance-number`}>Social Insurance Number</label>
              </legend>
              <Input
                id={`${uid}-social-insurance-number`}
                type="text"
                minLength={9}
                maxLength={9}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "•••••••••"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "CO" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-colombia-id-number`}>Cédula de Ciudadanía (CC)</label>
              </legend>
              <Input
                id={`${uid}-colombia-id-number`}
                type="text"
                minLength={13}
                maxLength={13}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1.123.123.123"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "UY" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-uruguay-id-number`}>Cédula de Identidad (CI)</label>
              </legend>
              <Input
                id={`${uid}-uruguay-id-number`}
                type="text"
                minLength={11}
                maxLength={11}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1.123.123-1"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "HK" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-hong-kong-id-number`}>Hong Kong ID Number</label>
              </legend>
              <Input
                id={`${uid}-hong-kong-id-number`}
                type="text"
                minLength={8}
                maxLength={9}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "SG" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-singapore-id-number`}>NRIC number / FIN</label>
              </legend>
              <Input
                id={`${uid}-singapore-id-number`}
                type="text"
                minLength={9}
                maxLength={9}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "AE" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-uae-id-number`}>Emirates ID</label>
              </legend>
              <Input
                id={`${uid}-uae-id-number`}
                type="text"
                minLength={15}
                maxLength={15}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789123456"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "MX" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-mexico-id-number`}>Personal RFC</label>
              </legend>
              <Input
                id={`${uid}-mexico-id-number`}
                type="text"
                minLength={13}
                maxLength={13}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1234567891234"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "KZ" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-kazakhstan-id-number`}>Individual identification number (IIN)</label>
              </legend>
              <Input
                id={`${uid}-kazakhstan-id-number`}
                type="text"
                minLength={9}
                maxLength={12}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "AR" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-argentina-id-number`}>CUIL</label>
              </legend>
              <Input
                id={`${uid}-argentina-id-number`}
                type="text"
                minLength={13}
                maxLength={13}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "12-12345678-1"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "PE" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-peru-id-number`}>DNI number</label>
              </legend>
              <Input
                id={`${uid}-peru-id-number`}
                type="text"
                minLength={10}
                maxLength={10}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "12345678-9"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "PK" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-snic`}>National Identity Card Number (SNIC or CNIC)</label>
              </legend>
              <Input
                id={`${uid}-snic`}
                type="text"
                minLength={13}
                maxLength={13}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "•••••••••"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "CR" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-costa-rica-id-number`}>Tax Identification Number</label>
              </legend>
              <Input
                id={`${uid}-costa-rica-id-number`}
                type="text"
                minLength={9}
                maxLength={12}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1234567890"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "CL" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-chile-id-number`}>Rol Único Tributario (RUT)</label>
              </legend>
              <Input
                id={`${uid}-chile-id-number`}
                type="text"
                minLength={8}
                maxLength={9}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "DO" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-dominican-republic-id-number`}>Cédula de identidad y electoral (CIE)</label>
              </legend>
              <Input
                id={`${uid}-dominican-republic-id-number`}
                type="text"
                minLength={13}
                maxLength={13}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123-1234567-1"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "BO" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-bolivia-id-number`}>Cédula de Identidad (CI)</label>
              </legend>
              <Input
                id={`${uid}-bolivia-id-number`}
                type="text"
                minLength={8}
                maxLength={8}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "12345678"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "PY" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-paraguay-id-number`}>Cédula de Identidad (CI)</label>
              </legend>
              <Input
                id={`${uid}-paraguay-id-number`}
                type="text"
                minLength={7}
                maxLength={7}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1234567"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "BD" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-bangladesh-id-number`}>Personal ID number</label>
              </legend>
              <Input
                id={`${uid}-bangladesh-id-number`}
                type="text"
                minLength={1}
                maxLength={20}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "MZ" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-mozambique-id-number`}>Mozambique Taxpayer Single ID Number (NUIT)</label>
              </legend>
              <Input
                id={`${uid}-mozambique-id-number`}
                type="text"
                minLength={9}
                maxLength={9}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123456789"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "GT" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-guatemala-id-number`}>Número de Identificación Tributaria (NIT)</label>
              </legend>
              <Input
                id={`${uid}-guatemala-id-number`}
                type="text"
                minLength={8}
                maxLength={12}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "1234567-8"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : complianceInfo.country === "BR" ? (
            <div className="space-y-2">
              <legend>
                <label htmlFor={`${uid}-brazil-id-number`}>Cadastro de Pessoas Físicas (CPF)</label>
              </legend>
              <Input
                id={`${uid}-brazil-id-number`}
                type="text"
                minLength={11}
                maxLength={14}
                placeholder={user.individual_tax_id_entered ? "Hidden for security" : "123.456.789-00"}
                required
                disabled={isFormDisabled}
                aria-invalid={errorFieldNames.has("individual_tax_id")}
                onChange={(evt) => updateComplianceInfo({ individual_tax_id: evt.target.value })}
              />
            </div>
          ) : null}
        </fieldset>
      ) : null}
    </section>
  );
};
export default AccountDetailsSection;
