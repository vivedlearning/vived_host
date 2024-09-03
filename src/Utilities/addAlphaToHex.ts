import { alphaToHex } from "./alphaToHex";

export function addAlphaToHex(hex: string, alpha: number): string {
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    console.warn("[addAlphaToHex] Hex value is not valid.");
    return "#000";
  }

  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const alphaHex = alphaToHex(alpha);
  return `${hex}${alphaHex}`;
}
