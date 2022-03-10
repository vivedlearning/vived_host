import { MemoizedBoolean } from "./MemoizedBoolean";

test("Initial value is stored", ()=>{
  const memoizedTrue = new MemoizedBoolean(true, jest.fn());
  expect(memoizedTrue.val).toEqual(true);

  const memoizedFalse = new MemoizedBoolean(false, jest.fn());
  expect(memoizedFalse.val).toEqual(false);
})

test("Callback is called when something changes", ()=>{
  const cb = jest.fn();
  const memoizedBoolean = new MemoizedBoolean(true, cb);

  expect(cb).not.toBeCalled();

  memoizedBoolean.val = false;

  expect(cb).toBeCalled();
  cb.mockClear();

  memoizedBoolean.val = true;

  expect(cb).toBeCalled();
})

test("CB is only called when something has changed", ()=>{
  const cb = jest.fn();
  const memoizedBoolean = new MemoizedBoolean(true, cb);

  memoizedBoolean.val = true;
  memoizedBoolean.val = true;
  memoizedBoolean.val = true;

  expect(cb).not.toBeCalled();
})