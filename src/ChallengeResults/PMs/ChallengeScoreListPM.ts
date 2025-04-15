import {
  AppObject,
  AppObjectPM,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { HostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import { ChallengeResultsEntity } from "../Entities/ChallengeResults";

export interface SlideScoreVM {
  id: string;
  displayName: string;
  score: number;
}

export abstract class ChallengeScoreListPM extends AppObjectPM<SlideScoreVM[]> {
  static readonly type = "ChallengeScoreListPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ChallengeScoreListPM>(
      ChallengeScoreListPM.type,
      appObjects
    );
  }
}

export function makeChallengeScoreListPM(
  appObject: AppObject
): ChallengeScoreListPM {
  return new ChallengeScoreListPMImp(appObject);
}

class ChallengeScoreListPMImp extends ChallengeScoreListPM {
  private get challengeResults() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  vmsAreEqual(a: SlideScoreVM[], b: SlideScoreVM[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i].id) return false;
      if (a[i].displayName !== b[i].displayName) return false;
      if (a[i].score !== b[i].score) return false;
    }
    return true;
  }

  onEntityChange = (): void => {
    if (!this.challengeResults || !this.stateMachine) return;

    const slideScores: SlideScoreVM[] = [];

    // Get all states from state machine
    const stateIds = this.stateMachine.states;

    // Process each state
    stateIds.forEach((slideId, index) => {
      // Skip slides that don't have a result
      if (!this.challengeResults!.getResultForSlide(slideId)) return;

      const state = this.stateMachine!.getStateByID(slideId);
      if (state) {
        // Get score for this slide using the method from ChallengeResults
        const score = this.challengeResults!.getScoreForSlide(slideId);

        // Format the display name
        const displayName = `Slide ${index + 1}: ${state.name}`;

        // Add to results
        slideScores.push({
          id: slideId,
          displayName,
          score
        });
      }
    });

    this.doUpdateView(slideScores);
  };

  constructor(appObject: AppObject) {
    super(appObject, ChallengeScoreListPM.type);

    // Initialize with empty array
    this.doUpdateView([]);

    // Subscribe to changes in entities
    this.challengeResults?.addChangeObserver(this.onEntityChange);
    this.stateMachine?.addChangeObserver(this.onEntityChange);

    // Initial update
    this.onEntityChange();

    // Register as singleton
    this.appObjects.registerSingleton(this);
  }
}
