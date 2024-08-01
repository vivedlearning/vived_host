import { MemoizedString } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { HostStateEntity } from "./HostStateEntity";

export enum ChallengeResponse {
  NONE = "NONE",
  SCORE = "SCORE",
  HIT = "HIT",
  MULTIHIT = "MULTIHIT",
  PROGRESS = "PROGRESS",
  QUALITY = "QUALITY"
}

export abstract class HostEditingStateEntity extends HostAppObjectEntity {
  static type = "HostEditingStateEntity";

  abstract isEditing: boolean;
  abstract id: string;
  abstract name: string;
  abstract assets: string[];
  abstract expectedResponse: ChallengeResponse | undefined;
  abstract appID: string;
  abstract stateData: object;

  abstract startNewState(): void;
  abstract startEditing(state: HostStateEntity): void;
  abstract cancelEditState(): void;
  abstract finishEditing(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<HostEditingStateEntity>(
      HostEditingStateEntity.type,
      appObjects
    );
  }
}

export function makeHostEditingStateEntity(
  appObject: HostAppObject
): HostEditingStateEntity {
  return new HostEditingStateEntityImp(appObject);
}

class HostEditingStateEntityImp extends HostEditingStateEntity {
  isEditing: boolean = false;

  id = "";
  appID = "";

  private memoizedName = new MemoizedString("", this.notifyOnChange);
  get name(): string {
    return this.memoizedName.val;
  }
  set name(val: string) {
    this.memoizedName.val = val;
  }

  private _data = {};
  get stateData(): object {
    return this._data;
  }
  set stateData(val: object) {
    const currentData = JSON.stringify(this._data);
    const newData = JSON.stringify(val);

    if (currentData === newData) {
      return;
    }

    this._data = val;
    this.notifyOnChange();
  }

  private _assets: string[] = [];
  get assets() {
    return [...this._assets];
  }
  set assets(val: string[]) {
    if (val.length !== this._assets.length) {
      this._assets = val;
      this.notifyOnChange();
      return;
    }

    let somethingHasChanged = false;
    val.forEach((newAsset, i) => {
      const existingAsset = this._assets[i];
      if (existingAsset !== newAsset) {
        somethingHasChanged = true;
      }
    });

    if (!somethingHasChanged) {
      return;
    }

    this._assets = val;
    this.notifyOnChange();
  }

  private _expectedResponse: ChallengeResponse | undefined;
  get expectedResponse() {
    return this._expectedResponse;
  }
  set expectedResponse(val: ChallengeResponse | undefined) {
    if (val === this._expectedResponse) return;

    this._expectedResponse = val;
    this.notifyOnChange();
  }
  
  startNewState(): void {
    throw new Error("Method not implemented.");
  }

  startEditing(state: HostStateEntity): void {
    this.id = state.id;
    this.name = state.name;
    this.expectedResponse = state.expectedResponse;
    this.appID = state.appID;
    this.assets = [...state.assets];
    this.stateData = {...state.stateData}
    this.isEditing = true;
  }

  cancelEditState(): void {
    throw new Error("Method not implemented.");
  }

  finishEditing(): void {
    throw new Error("Method not implemented.");
  }

  constructor(appObject: HostAppObject) {
    super(appObject, HostEditingStateEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
