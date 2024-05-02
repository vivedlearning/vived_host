import { makeAppObjectRepo } from "./AppObjectRepo";
import { getSingletonComponent } from "./getSingletonComponent";

describe("Get Singleton Component", () => {
  it("Calls the get singleton on the app object repo", () => {
    const appObjects = makeAppObjectRepo();

    appObjects.getSingleton = jest.fn();

    getSingletonComponent(
      "Mock Component",
      appObjects
    );

    expect(appObjects.getSingleton).toBeCalledWith("Mock Component")
  });
});
