import {
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { HostStateMachine } from "../../StateMachine";
import {
  ChallengeResultHitData,
  ChallengeResultMultiHitData,
  ChallengeResultProgressData,
  ChallengeResultQualityData,
  ChallengeResultScoreData,
  ChallengeResultsEntity,
  ChallengeResultType
} from "../Entities";

export interface ChallengeResultVM {
  id: string;
  slideName: string;
  attempts: number;
  message: string;
  resultType: ChallengeResultType;
  resultData:
    | ChallengeResultHitData
    | ChallengeResultMultiHitData
    | ChallengeResultQualityData
    | ChallengeResultScoreData
    | ChallengeResultProgressData;
}

export abstract class ChallengeResultsListPM extends HostAppObjectPM<
  ChallengeResultVM[]
> {
  static type = "ChallengeResultsListPM";

  static get(appObjects: HostAppObjectRepo) {
    return appObjects.getSingleton<ChallengeResultsListPM>(
      ChallengeResultsListPM.type
    );
  }
}

export function makeChallengeResultsPM(
  appObject: HostAppObject
): ChallengeResultsListPM {
  return new ChallengeResultsPMImp(appObject);
}

class ChallengeResultsPMImp extends ChallengeResultsListPM {
  private get results() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  vmsAreEqual(a: ChallengeResultVM[], b: ChallengeResultVM[]): boolean {
    if (a.length !== b.length) return false;

    let areEqual = true;
    a.forEach((aResult, i) => {
      const bResult = b[i];
      if (aResult.id !== bResult.id) areEqual = false;
      else if (aResult.attempts !== bResult.attempts) areEqual = false;
    });
    return areEqual;
  }

  onEntityChange = (): void => {
    if (!this.results || !this.stateMachine) return;

    const organizedResults: ChallengeResultVM[] = [];

    this.results.results.forEach((result) => {
      const state = this.stateMachine!.getStateByID(result.slideID);
      if (state) {
        const vm: ChallengeResultVM = {
          id: result.slideID,
          slideName: state.name,
          attempts: result.tries,
          resultType: result.type,
          message: result.message,
          resultData: result.resultData
        };

        organizedResults.push(vm);
      }
    });

    this.doUpdateView(organizedResults);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, ChallengeResultsListPM.type);
    this.onEntityChange();
    this.results?.addChangeObserver(this.onEntityChange);

    this.appObjects.registerSingleton(this);
  }
}
