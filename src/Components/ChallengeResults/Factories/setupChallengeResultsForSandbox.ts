import { HostAppObjectRepo } from "../../../HostAppObject";
import { makeChallengeResults } from "../Entities";
import { makeChallengeResultsPM } from "../PMs";

export function setupChallengeResultsForSandbox(appObjects: HostAppObjectRepo) {
  const ao = appObjects.getOrCreate("ChallengeResults");

  makeChallengeResults(ao);

  // PM
  makeChallengeResultsPM(ao);
}
