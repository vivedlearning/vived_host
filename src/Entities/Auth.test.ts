import { makeAuth } from "./Auth";

describe("Auth Entity", () => {
    it("Rejects if login is called before it is injected", async () => {
        const auth = makeAuth();

        await expect(auth.login("username", "password")).rejects.toEqual(
            new Error(`Auth function login has not been injected`)
        );
    });

    it("Allows the login to be injected", async () => {
        const auth = makeAuth();
        const mockFetchData = jest.fn();
        mockFetchData.mockReturnValueOnce("user data");

        auth.login = mockFetchData;

        await auth.login("username", "password");

        expect(mockFetchData).toBeCalledWith("username", "password");
    });

    it("Rejects if logout is called before it is injected", async () => {
        const auth = makeAuth();

        await expect(auth.logout()).rejects.toEqual(
            new Error(`Auth function logout has not been injected`)
        );
    });

    it("Allows the logout to be injected", async () => {
        const auth = makeAuth();
        const mockFetchData = jest.fn();
        mockFetchData.mockReturnValueOnce("user data");

        auth.logout = mockFetchData;

        await auth.logout();

        expect(mockFetchData).toBeCalled();
    });

    it("Rejects if getCurrentAuthenticatedUser is called before it is injected", async () => {
        const auth = makeAuth();

        await expect(auth.refreshAuthenticatedUser()).rejects.toEqual(
            new Error(`Auth function getCurrentAuthenticatedUser has not been injected`)
        );
    });

    it("Allows the getCurrentAuthenticatedUser to be injected", async () => {
        const auth = makeAuth();
        const mockFetchData = jest.fn();
        mockFetchData.mockReturnValueOnce("user data");

        auth.refreshAuthenticatedUser = mockFetchData;

        await auth.refreshAuthenticatedUser();

        expect(mockFetchData).toBeCalled();
    });
});
