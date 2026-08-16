"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

type QRCodeProps = {
  path: string;
};

export default function QRCodeDisplay({ path }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const url = `${window.location.origin}${path}`;

    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "H",
    });
  }, [path]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl"
        aria-label="Business QR code"
      />
    </div>
  );
}