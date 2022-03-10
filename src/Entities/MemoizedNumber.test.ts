import { MemoizedNumber } from "./MemoizedNumber";

test("Initial value is stored", ()=>{
  const memoizedNumber = new MemoizedNumber(33, jest.fn());
  expect(memoizedNumber.val).toEqual(33);
})

test("Callback is called when something changes", ()=>{
  const cb = jest.fn();
  const memoizedNumber = new MemoizedNumber(33, cb);

  expect(cb).not.toBeCalled();

  memoizedNumber.val = 55;

  expect(cb).toBeCalled();
})

test("CB is only called when something has changed", ()=>{
  const cb = jest.fn();
  const memoizedNumber = new MemoizedNumber(33, cb);

  memoizedNumber.val = 33;
  memoizedNumber.val = 33;
  memoizedNumber.val = 33;

  expect(cb).not.toBeCalled();
})