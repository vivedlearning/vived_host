import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostStateEntity } from "../Entities/HostStateEntity";

export abstract class EditStateNameUC extends AppObjectUC {
  static readonly type = "EditStateNameUC";

  abstract editStateName(name: string): void;

  static get(appObj: AppObject): EditStateNameUC | undefined {
    return appObj.getComponent<EditStateNameUC>(this.type);
  }

  static getById(
    id: string,
    appObjects: AppObjectRepo
  ): EditStateNameUC | undefined {
    return appObjects.get(id)?.getComponent<EditStateNameUC>(this.type);
  }
}

export function makeEditStateNameUC(appObject: AppObject): EditStateNameUC {
  return new EditStateNameUCImp(appObject);
}

class EditStateNameUCImp extends EditStateNameUC {
  private get hostStateEntity() {
    return this.getCachedLocalComponent<HostStateEntity>(HostStateEntity.type);
  }

  editStateName = (name: string) => {
    if (!this.hostStateEntity) {
      this.warn("Unable to find HostStateEntity");
      return;
    }

    this.hostStateEntity.name = name;
  };

  constructor(appObject: AppObject) {
    super(appObject, EditStateNameUC.type);
  }
}
