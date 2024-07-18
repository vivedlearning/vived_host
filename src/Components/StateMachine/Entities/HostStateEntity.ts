import { MemoizedString } from "../../../Entities";
import { HostAppObject, HostAppObjectEntity } from "../../../HostAppObject";

export enum ChallengeResponse {
  NONE = "NONE",
  SCORE = "SCORE",
  HIT = "HIT",
  MULTIHIT = "MULTIHIT",
  PROGRESS = "PROGRESS",
  QUALITY = "QUALITY"
}

export interface StateDTO {
  id: string;
  name: string;
  data: object;
  assets: string[];
  response: string | undefined;
  appID: string;
}

export abstract class HostStateEntity extends HostAppObjectEntity {
  static type = "HostStateEntity";

  abstract get id(): string;

  abstract name: string;
  abstract assets: string[];
  abstract expectedResponse: ChallengeResponse | undefined;
  abstract appID: string;
  abstract getDTO(): StateDTO;
  abstract setDTO(dto: StateDTO):void;

  abstract get stateData(): object;
  abstract setStateData(val: object, checkForChange?: boolean): void;
}

export function makeHostStateEntity(appObject: HostAppObject): HostStateEntity {
  return new HostStateEntityImp(appObject);
}

class HostStateEntityImp extends HostStateEntity {
	
  get id(): string {
    return this.appObject.id;
  }

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

  setStateData(val: object, checkForChange?: boolean): void {
    let notify = true;
    if (checkForChange) {
      const currentData = JSON.stringify(this._data);
      const newData = JSON.stringify(val);

      if (currentData === newData) {
        notify = false;
      }
    }

    this._data = val;
    if (notify) {
      this.notifyOnChange();
    }
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

	getDTO(): StateDTO {
		return {
      id: this.id,
      assets: [...this._assets],
      data: this._data,
      name: this.memoizedName.val,
      response: this._expectedResponse,
      appID: this.appID
    };
	}

	setDTO(dto: StateDTO): void {
		if (dto.id !== this.id) {
      this.warn("DTO id does not match my ID. Skipping");
      return;
    }

    this.setStateData(dto.data, true);
    this.assets = [...dto.assets];
    this.memoizedName.val = dto.name;
    this.memoisedAppID.val = dto.appID;

    if ((<any>Object).values(ChallengeResponse).includes(dto.response)) {
      this.expectedResponse = dto.response as ChallengeResponse;
    } else {
      this.expectedResponse = undefined;
    }
	}

  private memoisedAppID = new MemoizedString("", this.notifyOnChange);
  get appID(): string {
    return this.memoisedAppID.val;
  }
  set appID(val: string) {
    this.memoisedAppID.val = val;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateEntity.type);
  }
}
