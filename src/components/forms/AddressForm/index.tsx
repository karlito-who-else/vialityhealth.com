"use client";

import { useAddresses } from "@payloadcms/plugin-ecommerce/client/react";
import { defaultCountries as supportedCountries } from "@payloadcms/plugin-ecommerce/client/react";
import { deepMergeSimple } from "payload/shared";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { FormError } from "@/components/forms/FormError";
import { FormItem } from "@/components/forms/FormItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/Auth";
import { Address, Config } from "@/payload-types";

import { titles } from "./constants";

type AddressFormValues = {
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
};

type Props = {
  addressID?: Config["db"]["defaultIDType"];
  initialData?: Omit<Address, "country" | "id" | "updatedAt" | "createdAt"> & { country?: string };
  callback?: (data: Partial<Address>) => void;
  /**
   * If true, the form will not submit to the API.
   */
  skipSubmission?: boolean;
  /**
   * The kind of address this form represents. Used to scope the HTML
   * `autocomplete` tokens (`shipping` or `billing`) so password managers
   * and the browser autofill treat shipping and billing fields separately.
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
   */
  addressType?: "shipping" | "billing";
};

const buildAutoComplete = (
  detail: string,
  addressType: Props["addressType"],
): string => (addressType ? `${addressType} ${detail}` : detail);

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
  addressType,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: initialData,
  });

  const { createAddress, updateAddress } = useAddresses();
  const { user, status } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      setSubmitError(null);

      if (!skipSubmission && !user) {
        if (status === "loggedOut") {
          setSubmitError("Please sign in to save an address.");
        } else {
          setSubmitError("Verifying your session, please try again in a moment.");
        }
        return;
      }

      const newData = deepMergeSimple(initialData || {}, data);

      setIsSubmitting(true);
      try {
        if (!skipSubmission) {
          if (addressID) {
            await updateAddress(addressID, newData);
          } else {
            await createAddress(newData);
          }
        }

        if (callback) {
          callback(newData);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong saving your address. Please try again.";
        const friendly =
          message === "User must be logged in to update or create an address"
            ? "Your session is no longer active. Please sign in again to save this address."
            : message;
        setSubmitError(friendly);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      initialData,
      skipSubmission,
      callback,
      addressID,
      updateAddress,
      createAddress,
      user,
      status,
    ],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <FormItem className="shrink">
            <Label htmlFor="title">Title</Label>

            <Select
              {...register("title")}
              onValueChange={(value) => {
                setValue("title", value, { shouldValidate: true });
              }}
              defaultValue={initialData?.title || ""}
            >
              <SelectTrigger id="title">
                <SelectValue placeholder="Title" />
              </SelectTrigger>
              <SelectContent>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.title && <FormError message={errors.title.message} />}
          </FormItem>
          <FormItem>
            <Label htmlFor="firstName">First name*</Label>
            <Input
              id="firstName"
              autoComplete={buildAutoComplete("given-name", addressType)}
              {...register("firstName", { required: "First name is required." })}
            />
            {errors.firstName && <FormError message={errors.firstName.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="lastName">Last name*</Label>
            <Input
              autoComplete={buildAutoComplete("family-name", addressType)}
              id="lastName"
              {...register("lastName", { required: "Last name is required." })}
            />
            {errors.lastName && <FormError message={errors.lastName.message} />}
          </FormItem>
        </div>

        <FormItem>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            autoComplete={buildAutoComplete("tel", addressType)}
            {...register("phone")}
          />
          {errors.phone && <FormError message={errors.phone.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            autoComplete={buildAutoComplete("organization", addressType)}
            {...register("company")}
          />
          {errors.company && <FormError message={errors.company.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="addressLine1">Address line 1*</Label>
          <Input
            id="addressLine1"
            autoComplete={buildAutoComplete("address-line1", addressType)}
            {...register("addressLine1", { required: "Address line 1 is required." })}
          />
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="addressLine2">Address line 2</Label>
          <Input
            id="addressLine2"
            autoComplete={buildAutoComplete("address-line2", addressType)}
            {...register("addressLine2")}
          />
          {errors.addressLine2 && <FormError message={errors.addressLine2.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            autoComplete={buildAutoComplete("address-level2", addressType)}
            {...register("city", { required: "City is required." })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            autoComplete={buildAutoComplete("address-level1", addressType)}
            {...register("state")}
          />
          {errors.state && <FormError message={errors.state.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="postalCode">Zip Code*</Label>
          <Input
            id="postalCode"
            autoComplete={buildAutoComplete("postal-code", addressType)}
            {...register("postalCode", { required: "Postal code is required." })}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="country">Country*</Label>

          <Select
            {...register("country", {
              required: "Country is required.",
            })}
            onValueChange={(value) => {
              setValue("country", value, { shouldValidate: true });
            }}
            required
            defaultValue={initialData?.country || ""}
          >
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {supportedCountries.map((country) => {
                const value = typeof country === "string" ? country : country.value;
                const label =
                  typeof country === "string"
                    ? country
                    : typeof country.label === "string"
                      ? country.label
                      : value;

                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.country && <FormError message={errors.country.message} />}
        </FormItem>
      </div>

      {submitError && <FormError message={submitError} className="mb-4" />}

      <Button type="submit" disabled={isSubmitting || (!skipSubmission && !user)}>
        {isSubmitting ? "Saving…" : "Save Address"}
      </Button>
    </form>
  );
};
