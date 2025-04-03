import {
	AppObject,
	AppObjectPM,
	AppObjectRepo,
	getSingletonComponent
} from "@vived/core";
import { ChallengeResultsEntity } from "../Entities";

export abstract class HasChallengeResultsPM extends AppObjectPM<boolean> {
  static type = "HasChallengeResultsPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HasChallengeResultsPM>(
      HasChallengeResultsPM.type,
      appObjects
    );
  }
}

export function makeHasChallengeResultsPM(
  appObject: AppObject
): HasChallengeResultsPM {
  return new HasChallengeResultsPMImp(appObject);
}

class HasChallengeResultsPMImp extends HasChallengeResultsPM {
  private get resultsEntity() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = (): void => {
    if (!this.resultsEntity) return;

    const hasAssessmentResults =
      this.resultsEntity.results?.length > 0 || false;

    this.doUpdateView(hasAssessmentResults);
  };

  constructor(appObject: AppObject) {
    super(appObject, HasChallengeResultsPM.type);

    this.appObjects.registerSingleton(this);
    this.resultsEntity?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
