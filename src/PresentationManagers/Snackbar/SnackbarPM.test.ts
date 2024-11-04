import { makeSnackbarRepo } from '../../Entities';
import { SnackbarPM, SnackbarVM } from './SnackbarPM';

function viewCallbackCount(view: jest.Mock<any, any>): number {
  return view.mock.calls.length;
}

function getLastModel(view: jest.Mock<any, any>): SnackbarVM | undefined {
  const cnt = viewCallbackCount(view);
  if (cnt > 0) {
    return view.mock.calls[cnt - 1][0];
  } else {
    return undefined;
  }
}

function makeTestRig() {
  const snackbarRepo = makeSnackbarRepo();
  const view = jest.fn();
  const pm = new SnackbarPM(snackbarRepo, view);
  return { snackbarRepo, pm, view };
}

test('PM initializes', () => {
  const { view } = makeTestRig();
  const callbackCount = viewCallbackCount(view);
  const lastVM = getLastModel(view);
  expect(callbackCount).toEqual(1);
  expect(lastVM?.message).toEqual(undefined);
});

test('PM updates when use case changes', () => {
  const { snackbarRepo, view } = makeTestRig();
  snackbarRepo.makeSnackbar('test');
  const lastVM = getLastModel(view);
  expect(lastVM?.message).toEqual('test');
});

test('View notified of a change', () => {
  const { snackbarRepo, view } = makeTestRig();
  snackbarRepo.makeSnackbar('test');
  const callbackCount = viewCallbackCount(view);
  expect(callbackCount).toEqual(2);
});

test('PM disposes', () => {
  const { snackbarRepo, pm, view } = makeTestRig();
  pm.dispose();
  snackbarRepo.makeSnackbar('test');
  const lastVM = getLastModel(view);
  expect(lastVM?.message).toEqual(undefined);
});

test('Action and duration get set correctly', () => {
  const { snackbarRepo, view } = makeTestRig();
  snackbarRepo.makeSnackbar(
    'test',
    {
      actionButtonText: 'action',
      action: () => {
        const test = 2;
      },
    },
    2,
  );
  const lastVM = getLastModel(view);
  expect(lastVM?.actionButtonText).toEqual('action');
  expect(lastVM?.durationInSeconds).toEqual(2);
});
