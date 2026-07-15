import { QRCodeSVG } from "qrcode.react";
import { t, type AppLanguage } from "../data/i18n";

type QRCodeProps = {
  language?: AppLanguage;
  value: string;
};

export function QRCode({ language = "es", value }: QRCodeProps) {
  return (
    <div className="qr-card">
      <QRCodeSVG value={value} size={96} level="M" marginSize={1} />
      <p>{t(language, "qr.help")}</p>
    </div>
  );
}
