import { DialogSpinner } from './DialogSpinner';

function makeTestRig() {
  const spinner = new DialogSpinner('title', 'a message');
  const observer = jest.fn();
  spinner.addObserver(observer);

  return { spinner, observer };
}

describe('Spinner Dialog', () => {
  it('Notifies when the message changes', () => {
    const { spinner, observer } = makeTestRig();
    spinner.addObserver(observer);

    spinner.message = 'A new message';

    expect(spinner.message).toEqual('A new message');
    expect(observer).toBeCalled();
  });

  it('Closes if it has been alive long enough', () => {
    const { spinner, observer } = makeTestRig();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(0);

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(spinner.mininumuLifespan + 1);

    spinner.close();

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Doesn't close until the min lifespan has passed", () => {
    jest.useFakeTimers();
    const { spinner, observer } = makeTestRig();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(0);

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(0.5 * spinner.mininumuLifespan);

    spinner.close();

    expect(spinner.isOpen).toEqual(true);
    expect(observer).not.toBeCalled();

    jest.advanceTimersByTime(0.5 * spinner.mininumuLifespan);

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Bases the lifespan on when it was opened', () => {
    jest.useFakeTimers();
    const { spinner, observer } = makeTestRig();
    observer.mockClear();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(2 * spinner.mininumuLifespan);

    expect(observer).not.toBeCalled();

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(2.5 * spinner.mininumuLifespan);

    spinner.close();

    expect(spinner.isOpen).toEqual(true);
    expect(observer).not.toBeCalled();

    jest.advanceTimersByTime(0.5 * spinner.mininumuLifespan);

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });
});
