import {
    ActionNotImplemented,
    HostHandler,
    RequestHandler,
    UnableToParsePayload,
    UnsupportedRequestVerion,
} from '../../Entities';

export type ShowSelectModelAction = (callback: (modelId: string) => void) => void;

export class ShowSelectModelBase extends RequestHandler {
    readonly requestType = 'SHOW_SELECT_MODEL';

    action: ShowSelectModelAction = () => {
        throw new ActionNotImplemented(this.requestType);
    };

    handleRequest = (version: number, payload: unknown) => {
        if (version === 1) {
            const castPayload = this.castPayloadV1(payload);
            this.action(castPayload);
        } else {
            throw new UnsupportedRequestVerion(this.requestType, version);
        }
    };

    private castPayloadV1(payload: unknown): (modelId: string) => void {
        const castPayload = payload as Payload_V1;
        if (castPayload.callback === undefined) {
            throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
        }

        return castPayload.callback;
    }

    constructor(hostHandler: HostHandler) {
        super();
        hostHandler.registerRequestHandler(this);
    }
}

type Payload_V1 = {
    callback: (modelId: string) => void
};
