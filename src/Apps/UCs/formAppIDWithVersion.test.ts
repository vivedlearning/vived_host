import { makeAppObjectRepo, Version, VersionStage } from "@vived/core";
import { makeAppEntity } from "../Entities";
import { formAppIDWithVersion } from "./formAppIDWithVersion";

it("Forms the id with version string as expedected", () => {
  const appObjects = makeAppObjectRepo();
  const app = makeAppEntity(appObjects.getOrCreate("app0"));

  const version = new Version(1, 2, 3, VersionStage.BETA, "A Label");

  expect(formAppIDWithVersion(app, version)).toEqual("app0-1_2_3");
});
