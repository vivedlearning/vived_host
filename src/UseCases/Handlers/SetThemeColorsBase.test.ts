import { makeHostHandler } from '../../Entities';
import { SetThemeColorsBase, SetThemeColorsDTO } from './SetThemeColorsBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const setThemeColors = new SetThemeColorsBase(hostHandler);
  return { hostHandler, setThemeColors };
}

function makeBasicDTO(): SetThemeColorsDTO {
  return {
    colors: { primary: 'primary', onPrimary: 'onPrimary' },
  };
}

describe('Start SetThemeColors base handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const setThemeColors = new SetThemeColorsBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(setThemeColors);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { setThemeColors } = makeTestRig();

    expect(() => setThemeColors.action(makeBasicDTO())).toThrowError();
  });

  it('Converts the payload into the DTO for the action', () => {
    const { setThemeColors } = makeTestRig();
    setThemeColors.action = jest.fn();

    const expectDTO = makeBasicDTO();
    const payload = {
      colors: { primary: 'primary', onPrimary: 'onPrimary' },
    };
    setThemeColors.handleRequest(1, payload);

    expect(setThemeColors.action).toBeCalledWith(expectDTO);
  });

  it('Throws for an unsupported version', () => {
    const { setThemeColors } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: 'anAsset',
      callback: mockCallback,
    };

    expect(() => setThemeColors.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the payload is bungled', () => {
    const { setThemeColors } = makeTestRig();
    setThemeColors.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => setThemeColors.handleRequest(1, payload)).toThrowError();
  });
});
