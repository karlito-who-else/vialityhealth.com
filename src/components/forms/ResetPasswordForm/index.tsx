"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { FormError } from "@/components/forms/FormError";
import { FormItem } from "@/components/forms/FormItem";
import { Message } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/Auth";

type FormData = {
  password: string;
  passwordConfirm: string;
};

export const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!token) {
        setError("Invalid or missing reset token.");
        return;
      }

      try {
        await resetPassword({
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          token,
        });
        setSuccess(true);
        setError("");
      } catch (_error) {
        setError(
          _error instanceof Error
            ? _error.message
            : "An error occurred while resetting your password. Please try again.",
        );
      }
    },
    [token, resetPassword],
  );

  if (!token) {
    return (
      <div>
        <h1 className="text-xl mb-4">Invalid Reset Link</h1>
        <Message error="This password reset link is invalid or has expired. Please request a new password reset." />
      </div>
    );
  }

  return (
    <div>
      {!success && (
        <div>
          <h1 className="text-xl mb-4">Reset Your Password</h1>
          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <Message className="mb-8" error={error} />

            <FormItem className="mb-4">
              <Label htmlFor="password" className="mb-2">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", { required: "Password is required." })}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem className="mb-8">
              <Label htmlFor="passwordConfirm" className="mb-2">
                Confirm New Password
              </Label>
              <Input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                {...register("passwordConfirm", {
                  required: "Please confirm your password.",
                  validate: (value) => value === password || "Passwords do not match.",
                })}
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>

            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Resetting…" : "Reset Password"}
            </Button>
          </form>
        </div>
      )}
      {success && (
        <div>
          <h1 className="text-xl mb-4">Password Reset Successfully</h1>
          <div className="prose">
            <p>Your password has been reset. You can now log in with your new password.</p>
            <Button
              variant="default"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
