export enum VersionStage {
  RELEASED = 'released',
  BETA = 'beta',
  ALPHA = 'alpha',
}

export class Version {
  static GetLatest(
    versions: Version[],
  ): Version | undefined {
    let latest: Version | undefined;

    for(const v of versions){
      if (latest === undefined) {
        latest = v;
        continue;
      }

      if (v.major > latest.major) {
        latest = v;
      } else if (v.major === latest.major) {
        if (v.minor > latest.minor) {
          latest = v;
        } else if (v.minor === latest.minor) {
          if (v.patch > latest.patch) {
            latest = v;
          }
        }
      }
    }

    return latest;
  }

  static GetLatestWithMajor(
    versions: Version[],
    major: number,
  ): Version | undefined {
    let latest: Version | undefined;

    for (const v of versions) {
      if (v.major !== major) continue;

      if (latest === undefined) {
        latest = v;
        continue;
      }

      if (v.minor > latest.minor) {
        latest = v;
      } else if (v.minor === latest.minor) {
        if (v.patch > latest.patch) {
          latest = v;
        }
      }
    }

    return latest;
  }

  static GetLatestWithMajorMinor(
    versions: Version[],
    major: number,
    minor: number,
  ): Version | undefined {
    let latest: Version | undefined;

    for (const v of versions) {
      if (v.major !== major) continue;
      if (v.minor !== minor) continue;

      if (latest === undefined) {
        latest = v;
        continue;
      }

      if (v.patch > latest.patch) {
        latest = v;
      }
    }

    return latest;
  }

  static FromString(versionString: string): Version {
    const stringSplit = versionString.split('.');

    if (stringSplit.length !== 3) {
      throw new Error(`Unable to parse version string: ${versionString} because it could not be split into 3 parts`);
    }

    const major = parseInt(stringSplit[0], 10);
    const minor = parseInt(stringSplit[1], 10);
    const patchStageLabel = stringSplit[2];
    let patch = NaN;
    let stageLabel: string | undefined;

    const indexOfDash = patchStageLabel.indexOf('-');

    if (indexOfDash > 0) {
      const patchStr = patchStageLabel.substring(0, indexOfDash);
      patch = parseInt(patchStr, 10);
      stageLabel = patchStageLabel.substring(indexOfDash + 1);
    } else {
      patch = parseInt(patchStageLabel, 10);
    }

    if (isNaN(major)) {
      throw new Error(`Unable to parse version string: ${versionString} because Major is not a number`);
    }
    if (isNaN(minor)) {
      throw new Error(`Unable to parse version string: ${versionString} because Minor is not a number`);
    }
    if (isNaN(patch)) {
      throw new Error(`Unable to parse version string: ${versionString} because Patch is not a number`);
    }

    let stage = VersionStage.RELEASED;
    let label: string | undefined;

    if (stageLabel) {
      const stageLabelSplit = stageLabel.split('-');

      if (stageLabelSplit.length > 0) {
        const stringAsStage = this.stringToStage(stageLabelSplit[0]);

        if (stringAsStage === undefined) {
          label = stageLabel;
        } else {
          stage = stringAsStage;
          if (stageLabelSplit.length > 1) {
            label = stageLabel.replace(`${stageLabelSplit[0]}-`, '');
          }
        }
      }
    }

    const version = new Version(major, minor, patch, stage, label);
    return version;
  }

  private static stringToStage(str: string): VersionStage | undefined {
    if (str === VersionStage.ALPHA) {
      return VersionStage.ALPHA;
    } else if (str === VersionStage.BETA) {
      return VersionStage.BETA;
    }

    return undefined;
  }

  static AreEqual(v1: Version, v2: Version): boolean {
    if (v1.major !== v2.major) return false;
    if (v1.minor !== v2.minor) return false;
    if (v1.patch !== v2.patch) return false;
    if (v1.stage !== v2.stage) return false;
    if (v1.label !== v2.label) return false;
    return true;
  }

  static IsNewerVersion(a: Version, b: Version): boolean {
    if (a.major < b.major) return true;
    if (a.minor < b.minor) return true;
    if (a.patch < b.patch) return true;

    return false;
  }

  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly stage: VersionStage;
  readonly label?: string;
  readonly displayString: string;
  readonly baseVersionString: string;

  constructor(major: number, minor: number, patch: number, stage: VersionStage, label?: string) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.stage = stage;
    this.label = label;

    this.baseVersionString= `${major}.${minor}.${patch}`;

    let displayString = this.baseVersionString;
    if (stage === VersionStage.ALPHA) {
      displayString = displayString + '-alpha';
    } else if (this.stage === VersionStage.BETA) {
      displayString = displayString + '-beta';
    }

    if (this.label) {
      displayString = displayString + `-${label}`;
    }

    this.displayString = displayString;
  }
}
