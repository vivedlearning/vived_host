import { MemoizedString } from "./MemoizedString";

test("Initial value is stored", ()=>{
  const memoizedNumber = new MemoizedString("string1", jest.fn());
  expect(memoizedNumber.val).toEqual("string1");
})

test("Callback is called when something changes", ()=>{
  const cb = jest.fn();
  const memoizedNumber = new MemoizedString("string1", cb);

  expect(cb).not.toBeCalled();

  memoizedNumber.val = "string2";

  expect(cb).toBeCalled();
})

test("CB is only called when something has changed", ()=>{
  const cb = jest.fn();
  const memoizedNumber = new MemoizedString("string1", cb);

  memoizedNumber.val = "string1";
  memoizedNumber.val = "string1";
  memoizedNumber.val = "string1";

  expect(cb).not.toBeCalled();
})