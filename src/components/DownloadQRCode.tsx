"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Props = {
  slug: string;
  businessName: string;
};

export default function DownloadQRCode({
  slug,
  businessName,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      const profileUrl = `${window.location.origin}/q/${slug}`;

      if (!canvasRef.current) return;

      await QRCode.toCanvas(canvasRef.current, profileUrl, {
        width: 320,
        margin: 4,
        errorCorrectionLevel: "H",
      });

      setDownloadUrl(profileUrl);
    };

    generateQRCode();
  }, [slug]);

  async function copyProfileUrl() {
    if (!downloadUrl) return;

    await navigator.clipboard.writeText(downloadUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function downloadQRCode() {
    if (!canvasRef.current) return;

    const link = document.createElement("a");

    link.download = `${slug}-qr-code.png`;
    link.href = canvasRef.current.toDataURL("image/png");

    link.click();
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">
          Your QR code
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Anyone who scans this QR code will see your business profile.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <canvas ref={canvasRef} />
        </div>

        <p className="mt-4 break-all text-center text-sm text-gray-500">
          {downloadUrl}
        </p>

        <div className="mt-5 flex w-full max-w-sm gap-3">
          <button
            type="button"
            onClick={downloadQRCode}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white"
          >
            Download QR
          </button>

          <button
            type="button"
            onClick={copyProfileUrl}
            className="rounded-lg border border-gray-300 px-4 py-3 font-medium"
          >
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          {businessName} QR profile
        </p>
      </div>
    </div>
  );
}