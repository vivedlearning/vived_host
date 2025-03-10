import { AppObjectRepo } from "@vived/core";
import { makeChallengeResults } from "../Entities";
import { makeChallengeResultsPM } from "../PMs";

export function setupChallengeResultsForSandbox(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("ChallengeResults");

  makeChallengeResults(ao);

  // PM
  makeChallengeResultsPM(ao);
}
