import { AppObjectRepo } from "@vived/core";
import { ChallengeResultsEntity, makeChallengeResults } from "../Entities";
import {
  makeChallengeResultsPM,
  makeChallengeScoreListPM,
  makeHasChallengeResultsPM
} from "../PMs";

export function setupChallengeResults(
  appObjects: AppObjectRepo
): ChallengeResultsEntity {
  const ao = appObjects.getOrCreate("ChallengeResults");

  const entity = makeChallengeResults(ao);

  // PM
  makeChallengeResultsPM(ao);
  makeChallengeScoreListPM(ao);
  makeHasChallengeResultsPM(ao);

  return entity;
}
