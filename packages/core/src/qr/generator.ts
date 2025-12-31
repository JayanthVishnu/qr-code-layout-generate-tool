import QRCode from "qrcode";

const qrCache = new Map<string, string>();

export async function generateQR(text: string): Promise<string> {
  if (qrCache.has(text)) {
    return qrCache.get(text)!;
  }
  try {
    const url = await QRCode.toDataURL(text);
    qrCache.set(text, url);
    return url;
  } catch (err) {
    console.error("Error generating QR code", err);
    return "";
  }
}
