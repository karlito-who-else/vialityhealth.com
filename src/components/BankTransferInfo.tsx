import { Price } from "@/components/Price";

type Settings = {
  bankTransferEnabled?: boolean | null;
  bankTransferHeading?: string | null;
  bankTransferNote?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  swiftCode?: string | null;
  bankTransferFooter?: string | null;
};

type Props = {
  settings: Settings;
  amount?: number | null;
};

export function BankTransferInfo({ settings, amount }: Props) {
  return (
    <div className="bg-card border border-muted rounded-lg p-6 space-y-3">
      <h2 className="font-semibold text-lg">
        {settings?.bankTransferHeading || "Bank Transfer"}
      </h2>
      {settings?.bankTransferNote && (
        <p className="text-sm text-primary/70">{settings.bankTransferNote}</p>
      )}

      <dl className="mt-2 space-y-1 [&_dd]:mb-1.5 md:[&_dd]:mb-0 md:grid md:grid-cols-2 gap-4">
        {settings.bankName && (
          <>
            <dt className="font-medium">Bank:</dt>
            <dd>{settings.bankName}</dd>
          </>
        )}
        {settings.accountName && (
          <>
            <dt className="font-medium">Account Name:</dt>
            <dd>{settings.accountName}</dd>
          </>
        )}
        {settings.accountNumber && (
          <>
            <dt className="font-medium">Account Number:</dt>
            <dd>{settings.accountNumber}</dd>
          </>
        )}
        {settings.routingNumber && (
          <>
            <dt className="font-medium">Routing / Sort Code / BSB:</dt>
            <dd>{settings.routingNumber}</dd>
          </>
        )}
        {settings.swiftCode && (
          <>
            <dt className="font-medium">SWIFT / BIC:</dt>
            <dd>{settings.swiftCode}</dd>
          </>
        )}
      </dl>
      {settings?.bankTransferFooter && (
        <p className="text-xs text-primary/50 mt-2">{settings.bankTransferFooter}</p>
      )}
      {amount && (
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-base font-medium">
            <span>Total to transfer</span>
            <Price amount={amount} />
          </div>
        </div>
      )}
    </div>
  );
}
