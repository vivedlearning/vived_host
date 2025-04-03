import { AppObjectRepo } from "@vived/core";
import { ChallengeResultsEntity, makeChallengeResults } from "../Entities";
import { makeChallengeResultsPM, makeHasChallengeResultsPM } from "../PMs";

export function setupChallengeResults(
  appObjects: AppObjectRepo
): ChallengeResultsEntity {
  const ao = appObjects.getOrCreate("ChallengeResults");

  const entity = makeChallengeResults(ao);

  // PM
  makeChallengeResultsPM(ao);
  makeHasChallengeResultsPM(ao);

  return entity;
}
