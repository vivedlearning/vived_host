import { reject, resolve, Result } from '../ValueObjects/Result';

export enum VersionStage {
  RELEASED = 'released',
  BETA = 'beta',
  ALPHA = 'alpha',
}

export class Version {
  static GetLatest(
    versions: Version[],
    considerPreReleasedStage?: VersionStage.ALPHA | VersionStage.BETA,
  ): Version | undefined {
    let latest: Version | undefined = undefined;

    for (let i = 0; i < versions.length; i++) {
      const v = versions[i];

      if (v.stage !== VersionStage.RELEASED && v.stage !== considerPreReleasedStage) continue;

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
    considerPreReleasedStage?: VersionStage.ALPHA | VersionStage.BETA,
  ): Version | undefined {
    let latest: Version | undefined;

    for (const v of versions) {
      if (v.stage !== VersionStage.RELEASED && v.stage !== considerPreReleasedStage) continue;
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
    considerPreReleasedStage?: VersionStage.ALPHA | VersionStage.BETA,
  ): Version | undefined {
    let latest: Version | undefined;

    for (const v of versions) {
      if (v.stage !== VersionStage.RELEASED && v.stage !== considerPreReleasedStage) continue;
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

  static FromString(versionString: string, stage: VersionStage = VersionStage.RELEASED): Version {
    const stringSplit = versionString.split('.');

    if (stringSplit.length !== 3) {
      throw new Error(`Unable to parse version string: ${versionString} because it could not be split into 3 parts`);
    }

    const major = parseInt(stringSplit[0], 10);
    const minor = parseInt(stringSplit[1], 10);
    const patchLabel = stringSplit[2];
    let patch = NaN;
    let label: string | undefined;

    const indexOfDash = patchLabel.indexOf('-');

    if (indexOfDash > 0) {
      const patchStr = patchLabel.substring(0, indexOfDash);
      patch = parseInt(patchStr, 10);
      label = patchLabel.substring(indexOfDash + 1);
    } else {
      patch = parseInt(patchLabel, 10);
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

    const version = new Version(major, minor, patch, stage, label);
    return version;
  }

  static AreEqual(v1: Version, v2: Version): boolean {
    if(v1.major !== v2.major) return false;
    if(v1.minor !== v2.minor) return false;
    if(v1.patch !== v2.patch) return false;
    if(v1.stage !== v2.stage) return false;
    if(v1.label !== v2.label) return false;
    return true;
  }

  static IsNewerVersion(a: Version, b: Version): boolean {
    if(a.major < b.major) return true;
    if(a.minor < b.minor) return true;
    if(a.patch < b.patch) return true;

    return false;
  }

  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly stage: VersionStage;
  readonly label?: string;
  readonly displayString: string;

  constructor(major: number, minor: number, patch: number, stage: VersionStage, label?: string) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.stage = stage;
    this.label = label;

    let strVal = `${major}.${minor}.${patch}`;

    if (stage === VersionStage.ALPHA) {
      strVal = strVal + '-alpha';
    } else if (this.stage === VersionStage.BETA) {
      strVal = strVal + '-beta';
    }

    if (this.label) {
      strVal = strVal + `-${label}`;
    }

    this.displayString = strVal;
  }
}
