export function roundHalfToEven(number: number): number {
  const roundedNumber = Math.round(number);
  if (Math.abs(roundedNumber - number) === 0.5 && roundedNumber % 2 !== 0) {
    return roundedNumber > number ? roundedNumber - 1 : roundedNumber + 1;
  }
  return roundedNumber;
}

export function alphaToHex(alpha: number): string {
  if (alpha < 0 || alpha > 1) {
    console.warn("[alphaToHex] Alpha value must be between 0 and 1.");
    return "00";
  }

  const alpha255 = roundHalfToEven(alpha * 255);
  const alphaHex = alpha255.toString(16).padStart(2, "0");

  return alphaHex;
}
