import { Color } from "../ValueObjects";
import { MemoizedColor } from "./MemoizedColor";

test("Initial value is stored", () => {
  const initialColor = Color.RGBA(5, 6, 7, 8);
  const memoizedVector = new MemoizedColor(initialColor, jest.fn());
  expect(memoizedVector.val).toEqual(Color.RGBA(5, 6, 7, 8));
});

test("Callback is called when the val changes", () => {
  const cb = jest.fn();
  const initialColor = Color.RGBA(5, 6, 7, 8);
  const memoizedQuat = new MemoizedColor(initialColor, cb);

  memoizedQuat.val = Color.RGBA(8, 9, 10, 11);

  expect(cb).toBeCalled();
});

test("Callback is called only when the val changes", () => {
  const cb = jest.fn();
  const initialColor = Color.RGBA(5, 6, 7, 8);
  const memoizedQuat = new MemoizedColor(initialColor, cb);

  memoizedQuat.val = Color.RGBA(5, 6, 7, 8);
  memoizedQuat.val = Color.RGBA(5, 6, 7, 8);
  memoizedQuat.val = Color.RGBA(5, 6, 7, 8);

  expect(cb).not.toBeCalled();
});

test("Setting the value quietly should not notify", () => {
  const cb = jest.fn();
  const memoizedQuat = new MemoizedColor(Color.RGBA(5, 6, 7, 8), cb);

  memoizedQuat.setValQuietly(Color.RGBA(0, 0, 0, 0));

  expect(cb).not.toBeCalled();
});
