import { Color } from "./Color";

describe("Color value object - RGBA", () => {
  it("Make a color as expected", () => {
    const color = Color.RGBA(10, 20, 30, 40);

    expect(color.r).toEqual(10);
    expect(color.g).toEqual(20);
    expect(color.b).toEqual(30);
    expect(color.a).toEqual(40);
  });

  it("Clamps the color values to a minumum value of 0", () => {
    const color = Color.RGBA(-1, -1, -1, -1);

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(0);
  });

  it("Clamps the color values to a maximum value of 255", () => {
    const color = Color.RGBA(300, 300, 300, 300);

    expect(color.r).toEqual(255);
    expect(color.g).toEqual(255);
    expect(color.b).toEqual(255);
    expect(color.a).toEqual(255);
  });
});

describe("Color value object - RGB", () => {
  it("Make a color as expected", () => {
    const color = Color.RGB(10, 20, 30);

    expect(color.r).toEqual(10);
    expect(color.g).toEqual(20);
    expect(color.b).toEqual(30);
    expect(color.a).toEqual(255);
  });

  it("Clamps the color values to a minumum value of 0", () => {
    const color = Color.RGB(-1, -1, -1);

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);
  });

  it("Clamps the color values to a maximum value of 255", () => {
    const color = Color.RGB(300, 300, 300);

    expect(color.r).toEqual(255);
    expect(color.g).toEqual(255);
    expect(color.b).toEqual(255);
    expect(color.a).toEqual(255);
  });
});

describe("Color from Hex", () => {
  // See https://www.rapidtables.com/convert/color/hex-to-rgb.html
  it("Properly converts red", () => {
    const color = Color.Hex("FF0000");

    expect(color.r).toEqual(255);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);
  });

  it("Properly converts green", () => {
    const color = Color.Hex("00FF00");

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(255);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);
  });

  it("Properly converts blue", () => {
    const color = Color.Hex("0000FF");

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(255);
    expect(color.a).toEqual(255);
  });

  it("Properly converts gray", () => {
    const color = Color.Hex("808080");

    expect(color.r).toEqual(128);
    expect(color.g).toEqual(128);
    expect(color.b).toEqual(128);
    expect(color.a).toEqual(255);
  });

  it("Warns if something goes wrong and returns black", () => {
    console.warn = jest.fn();
    const color = Color.Hex("Your Mom goes to college");

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);

    expect(console.warn).toBeCalled();
  });
});

describe("Color from X11", () => {
  it("Finds the proper color by name", () => {
    const color = Color.X11("OrangeRed");

    expect(color.r).toEqual(255);
    expect(color.g).toEqual(69);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);
  });

  it("Warns if the X11 color is not found and returns black", () => {
    console.warn = jest.fn();
    const color = Color.X11("Your Mom goes to college");

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
    expect(color.a).toEqual(255);

    expect(console.warn).toBeCalled();
  });

  it("Checks for equality", () => {
    const colorA = Color.X11("OrangeRed");
    const colorB = Color.X11("LemonChiffon");
    const colorC = Color.X11("OrangeRed");

    expect(Color.Equal(colorA, colorC)).toEqual(true);
    expect(Color.Equal(colorA, colorB)).toEqual(false);
  });

  it("Gets the hex", () => {
    const c = Color.Hex("#fcba03");
    expect(c.hex).toEqual("#fcba03");
  });

  it("Gets the Data Transfer Object", () => {
    const color = Color.RGBA(10, 20, 30, 40);

    expect(color.dto).toEqual({
      r: 10,
      g: 20,
      b: 30,
      a: 40,
    });
  });

  it("Makes a Color from a DTO", () => {
    const color = Color.FromDTO({
      r: 10,
      g: 20,
      b: 30,
      a: 40,
    });

    expect(color.r).toEqual(10);
    expect(color.g).toEqual(20);
    expect(color.b).toEqual(30);
    expect(color.a).toEqual(40);
  });

  it("Color name is not case sensitive", () => {
    const color1 = Color.X11("OrangeRed");
    const color2 = Color.X11("orangered");
    const color3 = Color.X11("orangeRed");

    expect(color1).toEqual(color2);
    expect(color1).toEqual(color3);
  });
});
