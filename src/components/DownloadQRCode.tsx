"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import QRCode from "qrcode";

import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";

type Props = {
  slug: string;
  businessName: string;
};

export default function DownloadQRCode({
  slug,
  businessName,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [
    profileUrl,
    setProfileUrl,
  ] = useState("");

  const [copied, setCopied] =
    useState(false);

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(true);

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function generateQRCode() {
      if (!canvasRef.current) return;

      try {
        setIsGenerating(true);
        setError("");

        const url =
          `${window.location.origin}/q/${slug}`;

        await QRCode.toCanvas(
          canvasRef.current,
          url,
          {
            width: 360,
            margin: 3,
            errorCorrectionLevel: "H",
          }
        );

        setProfileUrl(url);
      } catch {
        setError(
          "Unable to generate the QR code. Please refresh and try again."
        );
      } finally {
        setIsGenerating(false);
      }
    }

    generateQRCode();
  }, [slug]);

  async function copyProfileUrl() {
    if (!profileUrl) return;

    try {
      await navigator.clipboard.writeText(
        profileUrl
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the link. Please copy it manually."
      );
    }
  }

  async function downloadQRCode() {
    if (
      !profileUrl ||
      isDownloading
    ) {
      return;
    }

    try {
      setIsDownloading(true);
      setError("");

      const largeCanvas =
        document.createElement("canvas");

      await QRCode.toCanvas(
        largeCanvas,
        profileUrl,
        {
          width: 1600,
          margin: 4,
          errorCorrectionLevel: "H",
        }
      );

      const link =
        document.createElement("a");

      link.download =
        `${slug}-qr-code.png`;

      link.href =
        largeCanvas.toDataURL(
          "image/png"
        );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setError(
        "Unable to download the QR code. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex justify-center">
          <div className="relative inline-flex rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/90">
                <Loader2 className="h-7 w-7 animate-spin text-gray-500" />

                <span className="sr-only">
                  Generating QR code
                </span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="block h-auto max-w-full"
              aria-label={`${businessName} QR code`}
            />
          </div>
        </div>

        {profileUrl && (
          <div className="mx-auto mt-8 max-w-lg">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Digital profile
            </p>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 pl-4">
              <p className="min-w-0 flex-1 truncate text-sm text-gray-600">
                {profileUrl}
              </p>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-950"
                aria-label="Open public profile"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={downloadQRCode}
            disabled={
              isGenerating ||
              isDownloading ||
              !profileUrl
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download QR Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={copyProfileUrl}
            disabled={
              isGenerating ||
              !profileUrl
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          High-resolution PNG suitable for print
          and digital use.
        </p>
      </section>

      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-950">
          Use it on
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "Business cards",
            "Packaging",
            "Flyers",
            "Signs",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-center text-sm font-medium text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}