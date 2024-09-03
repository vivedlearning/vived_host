import { addAlphaToHex } from "./addAlphaToHex";

describe("addAlphaToHex", () => {
  it("should add alpha channel to hex color code", () => {
    expect(addAlphaToHex("#ffffff", 0.5)).toBe("#ffffff80");
    expect(addAlphaToHex("#000000", 0.1)).toBe("#0000001a");
    expect(addAlphaToHex("#123456", 0)).toBe("#12345600");
    expect(addAlphaToHex("#abcdef", 1)).toBe("#abcdefff");
  });

  it("should add alpha channel to short hex color code", () => {
    expect(addAlphaToHex("#fff", 0.5)).toBe("#ffffff80");
    expect(addAlphaToHex("#000", 0.1)).toBe("#0000001a");
  });

  it("should log a warning and return Hex with alpha 0 if alpha value is out of bounds", () => {
    console.warn = jest.fn();
    expect(addAlphaToHex("#ffffff", -0.1)).toBe("#ffffff00");
    expect(console.warn).toHaveBeenCalledWith(
      "[alphaToHex] Alpha value must be between 0 and 1."
    );
    expect(addAlphaToHex("#ffffff", 1.1)).toBe("#ffffff00");
    expect(console.warn).toHaveBeenCalledWith(
      "[alphaToHex] Alpha value must be between 0 and 1."
    );
  });

  it("should log a warning and return #000 for invalid hex values", () => {
    console.warn = jest.fn();
    expect(addAlphaToHex("#gggggg", 0.5)).toBe("#000");
    expect(console.warn).toHaveBeenCalledWith(
      "[addAlphaToHex] Hex value is not valid."
    );

    expect(addAlphaToHex("#ffff", 0.5)).toBe("#000");
    expect(console.warn).toHaveBeenCalledWith(
      "[addAlphaToHex] Hex value is not valid."
    );

    expect(addAlphaToHex("ffffff", 0.5)).toBe("#000");
    expect(console.warn).toHaveBeenCalledWith(
      "[addAlphaToHex] Hex value is not valid."
    );

    expect(addAlphaToHex("#fff0", 0.5)).toBe("#000");
    expect(console.warn).toHaveBeenCalledWith(
      "[addAlphaToHex] Hex value is not valid."
    );
  });
});
