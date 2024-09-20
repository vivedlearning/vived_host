import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeUserTokenPMMock } from "../Mocks/UserTokenPMMock";
import { userTokenAdapter } from "./userTokenAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeUserTokenPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("User Token PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(userTokenAdapter.defaultVM).toEqual("");
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    userTokenAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    userTokenAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
