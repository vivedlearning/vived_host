import * as BOUNDARY from "./boundary";
import * as ENTITIES from "./Entity";
import { SnackbarWithEmptyActionButtonTextError } from "./SnackbarWithEmptyActionButtonTextError";
import { SnackbarWithEmptyMessageError } from "./SnackbarWithEmptyMessageError";
import { SnackbarWithInvalidDurationError } from "./SnackbarWithInvalidDurationError";

export class SnackbarUCImp implements BOUNDARY.SnackbarUC {
    private snackbarQueue: ENTITIES.Snackbar[];
    private defaultDurationInSeconds: number;
    private observers: BOUNDARY.SnackbarObserver[] = [];
    private monitoringSnackbarTime: boolean = false;

    constructor(defaultDurationInSeconds: number = 4) {
        this.snackbarQueue = [];
        this.defaultDurationInSeconds = defaultDurationInSeconds;
    }

    makeSnackbar = (message: string, snackbarAction?: BOUNDARY.SnackbarAction | undefined, durationInSeconds?: number | undefined) => {
        if (message.trim().length === 0) {
            throw new SnackbarWithEmptyMessageError();
        }

        if (snackbarAction && snackbarAction.actionButtonText.trim().length === 0) {
            throw new SnackbarWithEmptyActionButtonTextError();
        }

        const duration = durationInSeconds ?? this.defaultDurationInSeconds;
        if (duration <= 0) {
            throw new SnackbarWithInvalidDurationError(duration);
        }

        const snackbar: ENTITIES.Snackbar = {
            message,
            durationInSeconds: duration,
            snackbarAction
        }

        this.snackbarQueue.push(snackbar);
        this.notifyObservers();
        this.monitorSnackbarTime();
    }

    getCurrentSnackbar = (): BOUNDARY.Snackbar | undefined => {
        return this.snackbarQueue.length > 0 ? this.snackbarQueue[0] : undefined;
    }

    dismissActiveSnackbar = () => {
        if (this.snackbarQueue.length > 0) {
            this.snackbarQueue.splice(0, 1);
            this.notifyObservers();
        }
    }

    callActiveSnackbarAction = () => {
        const currentSnackbar = this.getCurrentSnackbar();
        if (currentSnackbar) {
            if (currentSnackbar.snackbarAction) {
                currentSnackbar.snackbarAction.action();
                this.dismissActiveSnackbar();
            }
        }
    }

    addObserver = (observer: BOUNDARY.SnackbarObserver) => {
        this.observers.push(observer);
    }

    removeObserver = (observer: BOUNDARY.SnackbarObserver) => {
        const index = this.observers.indexOf(observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    private async monitorSnackbarTime() {
        if (this.monitoringSnackbarTime) { return; }

        const loopFrequencyInSeconds: number = .1;
        this.monitoringSnackbarTime = true;

        while (this.snackbarQueue.length > 0) {
            const currentSnackbar = this.getCurrentSnackbar();
            if (currentSnackbar) {
                let currentTimeout = currentSnackbar.durationInSeconds;
                while (this.getCurrentSnackbar() === currentSnackbar && currentTimeout > 0) {
                    await new Promise(resolve => setTimeout(resolve, loopFrequencyInSeconds * 1000));
                    currentTimeout -= loopFrequencyInSeconds;
                }
                if (this.getCurrentSnackbar() === currentSnackbar && currentTimeout <= 0) {
                    this.dismissActiveSnackbar();
                }
            }
        }
        this.monitoringSnackbarTime = false;
    }

    private notifyObservers() {
        this.observers.forEach((obs) => obs.onSnackbarChange(this.getCurrentSnackbar()));
    }

}