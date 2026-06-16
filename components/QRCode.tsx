import { QRCodeSVG } from "qrcode.react";

type QRCodeProps = {
  value: string;
};

export function QRCode({ value }: QRCodeProps) {
  return (
    <div className="qr-card">
      <QRCodeSVG value={value} size={96} level="M" marginSize={1} />
      <p>Escanea para abrir el portafolio profesional.</p>
    </div>
  );
}
