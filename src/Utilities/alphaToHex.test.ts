import { alphaToHex, roundHalfToEven } from "./alphaToHex";

describe("roundHalfToEven", () => {
  it("should round 0.49 to 0", () => {
    expect(roundHalfToEven(0.49)).toBe(0);
  });

  it("should round 0.5 to 0", () => {
    expect(roundHalfToEven(0.5)).toBe(0);
  });

  it("should round 0.51 to 1", () => {
    expect(roundHalfToEven(0.51)).toBe(1);
  });

  it("should round 0.55 to 1", () => {
    expect(roundHalfToEven(0.55)).toBe(1);
  });

  it("should round 0.75 to 1", () => {
    expect(roundHalfToEven(0.75)).toBe(1);
  });

  it("should round 123.5 to 124", () => {
    expect(roundHalfToEven(123.5)).toBe(124);
  });
});

describe("alphaToHex", () => {
  it("should return '00' for alpha 0", () => {
    expect(alphaToHex(0)).toBe("00");
  });

  it("should return 'ff' for alpha 1", () => {
    expect(alphaToHex(1)).toBe("ff");
  });

  it("should return '1f' for alpha 0.12 (12%)", () => {
    expect(alphaToHex(0.12)).toBe("1f");
  });

  it("should return '80' for alpha 0.5 (50%)", () => {
    expect(alphaToHex(0.5)).toBe("80");
  });

  it("should return 'bf' for alpha 0.75 (75%)", () => {
    expect(alphaToHex(0.75)).toBe("bf");
  });

  it("should return '00' for alpha just above 0", () => {
    expect(alphaToHex(0.0012)).toBe("00");
  });

  it("should return '03' for alpha 0.01", () => {
    expect(alphaToHex(0.01)).toBe("03");
  });

  it("should return '03' for alpha just above 0 with rounding", () => {
    expect(alphaToHex(0.01)).toBe("03");
  });

  it("should return 'ff' for alpha just below 1", () => {
    expect(alphaToHex(0.9988)).toBe("ff");
  });

  it("should return 'fc' for alpha 0.99", () => {
    expect(alphaToHex(0.99)).toBe("fc");
  });

  it("should return 'fc' for alpha just below 1 with rounding", () => {
    expect(alphaToHex(0.99)).toBe("fc");
  });

  it("should return 'fe' for alpha 0.996", () => {
    expect(alphaToHex(0.996)).toBe("fe");
  });

  it("should return 'fe' for alpha 0.998", () => {
    expect(alphaToHex(0.998)).toBe("fe");
  });

  it("should log a warning and return '00' (0) for alpha less than 0", () => {
    console.warn = jest.fn();
    expect(alphaToHex(-0.1)).toBe("00");
    expect(console.warn).toHaveBeenCalledWith(
      "[alphaToHex] Alpha value must be between 0 and 1."
    );
  });

  it("should log a warning and return '00' (0) for alpha greater than 1", () => {
    console.warn = jest.fn();
    expect(alphaToHex(1.1)).toBe("00");
    expect(console.warn).toHaveBeenCalledWith(
      "[alphaToHex] Alpha value must be between 0 and 1."
    );
  });
});
