"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Message } from "@/components/Message";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface BankfulFormProps {
  onCardDetails: (details: {
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  isProcessing: boolean;
  error?: string | null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(" ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return digits;
}

export const BankfulForm: React.FC<BankfulFormProps> = ({
  onCardDetails,
  isProcessing,
  error,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const displayError = error || validationError;

  const validate = (): boolean => {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 16) {
      setValidationError("Invalid card number");
      return false;
    }

    const expiryDigits = cardExpiry.replace(/\D/g, "");
    if (expiryDigits.length !== 4) {
      setValidationError("Invalid expiry date (use MM/YY)");
      return false;
    }

    const month = parseInt(expiryDigits.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      setValidationError("Invalid expiry month");
      return false;
    }

    const cvvDigits = cardCvv.replace(/\D/g, "");
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      setValidationError("Invalid CVV");
      return false;
    }

    if (!cardholderName.trim()) {
      setValidationError("Cardholder name is required");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nameParts = cardholderName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const rawExpiry = cardExpiry.replace(/\s/g, "").replace("/", "");
    const month = rawExpiry.slice(0, 2);
    const year = rawExpiry.slice(2);
    const fullYear = year.length === 2 ? `20${year}` : year;

    onCardDetails({
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardExpiry: `${month}/${fullYear}`,
      cardCvv,
      firstName,
      lastName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="bankful-cardholder-name">Cardholder Name</Label>
        <Input
          id="bankful-cardholder-name"
          placeholder="John Smith"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          disabled={isProcessing}
          required
          autoComplete="cc-name"
        />
      </div>

      <div>
        <Label htmlFor="bankful-card-number">Card Number</Label>
        <Input
          id="bankful-card-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          disabled={isProcessing}
          required
          autoComplete="cc-number"
          inputMode="numeric"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="bankful-expiry">Expiry Date</Label>
          <Input
            id="bankful-expiry"
            placeholder="MM / YY"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
            disabled={isProcessing}
            required
            autoComplete="cc-exp"
            inputMode="numeric"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="bankful-cvv">CVV</Label>
          <Input
            id="bankful-cvv"
            placeholder="123"
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            disabled={isProcessing}
            required
            autoComplete="cc-csc"
            inputMode="numeric"
            type="password"
          />
        </div>
      </div>

      {displayError && <Message error={displayError} />}

      <Button type="submit" disabled={isProcessing} className="self-start">
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="w-4 h-4" />
            Processing…
          </span>
        ) : (
          "Pay with Card"
        )}
      </Button>
    </form>
  );
};
