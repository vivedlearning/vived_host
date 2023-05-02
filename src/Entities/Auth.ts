import { ObservableEntity } from "./ObservableEntity";

export abstract class Auth extends ObservableEntity {
    abstract login(username: string, password: string): Promise<void>;
    abstract logout(): Promise<void>;
    abstract refreshAuthenticatedUser(): Promise<void>;
}

export function makeAuth(): Auth {
    return new AuthImp();
}

class AuthImp extends Auth {
    login(username: string, password: string): Promise<void> {
        return Promise.reject(this.functionNotInjectedError("login"));
    }

    logout(): Promise<void> {
        return Promise.reject(this.functionNotInjectedError("logout"))
    }

    refreshAuthenticatedUser(): Promise<void> {
        return Promise.reject(this.functionNotInjectedError("getCurrentAuthenticatedUser"))
    }

    private functionNotInjectedError(functionName: string): Error {
        return new Error(`Auth function ${functionName} has not been injected`);
    }
}