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
    <div className="bg-card border rounded-lg p-6 space-y-3">
      <h2 className="font-semibold text-lg">
        {settings?.bankTransferHeading || "Bank Transfer"}
      </h2>
      {settings?.bankTransferNote && (
        <p className="text-sm text-primary/70">{settings.bankTransferNote}</p>
      )}
      <div className="space-y-2 text-sm">
        {settings?.bankName && (
          <div className="flex justify-between">
            <span className="text-primary/60">Bank</span>
            <span className="font-medium">{settings.bankName}</span>
          </div>
        )}
        {settings?.accountName && (
          <div className="flex justify-between">
            <span className="text-primary/60">Account Name</span>
            <span className="font-medium">{settings.accountName}</span>
          </div>
        )}
        {settings?.accountNumber && (
          <div className="flex justify-between">
            <span className="text-primary/60">Account Number</span>
            <span className="font-medium">{settings.accountNumber}</span>
          </div>
        )}
        {settings?.routingNumber && (
          <div className="flex justify-between">
            <span className="text-primary/60">Routing / Sort Code</span>
            <span className="font-medium">{settings.routingNumber}</span>
          </div>
        )}
        {settings?.swiftCode && (
          <div className="flex justify-between">
            <span className="text-primary/60">SWIFT / BIC</span>
            <span className="font-medium">{settings.swiftCode}</span>
          </div>
        )}
      </div>
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
