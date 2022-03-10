import { makeSnackbarRepo, SnackbarAction } from './SnackbarRepo';

function makeTestRig() {
  const snackbarRepo = makeSnackbarRepo();
  const observer = jest.fn();
  snackbarRepo.addObserver(observer);
  return { snackbarRepo, observer };
}

test('Initial state', () => {
  const { snackbarRepo } = makeTestRig();
  expect(snackbarRepo.getCurrentSnackbar()).toEqual(undefined);
});

test('Making a snackbar triggers the observer', () => {
  const { snackbarRepo, observer } = makeTestRig();

  snackbarRepo.makeSnackbar('testing');

  expect(observer).toBeCalledWith(expect.objectContaining({ message: 'testing' }));
});

test('Default duration is 4 seconds', () => {
  const { snackbarRepo } = makeTestRig();
  snackbarRepo.makeSnackbar('testing');
  expect(snackbarRepo.getCurrentSnackbar()?.durationInSeconds).toEqual(4);
});

test('Observer can be removed', () => {
  const { snackbarRepo, observer } = makeTestRig();
  observer.mockClear();
  snackbarRepo.removeObserver(observer);
  snackbarRepo.makeSnackbar('testing');
  expect(observer).not.toBeCalled();
});

test('Snackbar duration can be set when made', () => {
  const { snackbarRepo } = makeTestRig();

  snackbarRepo.makeSnackbar('testing', undefined, 1);
  expect(snackbarRepo.getCurrentSnackbar()?.durationInSeconds).toEqual(1);
});

test('Snackbar action can be set when made', () => {
  const actionFunction = jest.fn();
  const action: SnackbarAction = {
    actionButtonText: 'action text',
    action: actionFunction,
  };
  const { snackbarRepo } = makeTestRig();

  snackbarRepo.makeSnackbar('testing', action);
  expect(snackbarRepo.getCurrentSnackbar()?.snackbarAction?.actionButtonText).toEqual('action text');
});

test('Current snackbar can be dismissed', () => {
  const { snackbarRepo } = makeTestRig();
  snackbarRepo.makeSnackbar('testing');

  snackbarRepo.dismissActiveSnackbar();
  expect(snackbarRepo.getCurrentSnackbar()).toBeUndefined();
});

test('Calling the active action', () => {
  const { snackbarRepo } = makeTestRig();
  const actionFunction = jest.fn();
  snackbarRepo.makeSnackbar('testing', {
    action: actionFunction,
    actionButtonText: 'action text',
  });
  snackbarRepo.callActiveSnackbarAction();
  expect(actionFunction).toHaveBeenCalled();
  expect(snackbarRepo.getCurrentSnackbar()).toBeUndefined();
});

test('Snackbar with empty text throws error', () => {
  const { snackbarRepo } = makeTestRig();

  const snackResult = snackbarRepo.makeSnackbar('');
  expect(snackResult.isRejected).toEqual(true);
  expect(snackResult.error).not.toBeUndefined();
});

test('Snackbar with negative time throws error', () => {
  const { snackbarRepo } = makeTestRig();

  const snackResult = snackbarRepo.makeSnackbar('testing', undefined, -2);
  expect(snackResult.isRejected).toEqual(true);
  expect(snackResult.error).not.toBeUndefined();
});

test('Snackbar with negative time throws error', () => {
  const { snackbarRepo } = makeTestRig();
  const snackResult = snackbarRepo.makeSnackbar('testing', {
    actionButtonText: '',
    action: () => {
      const test = 2;
    },
  });

  expect(snackResult.isRejected).toEqual(true);
  expect(snackResult.error).not.toBeUndefined();
});
