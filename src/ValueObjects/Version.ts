import { reject, resolve, Result } from "../ValueObjects/Result";

export class Version {
  static GetLatest(versions: Version[]): Version | undefined {
    if (versions.length === 0) return undefined;

    let latest = new Version(0, 0, 0);

    versions.forEach((v) => {
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
    });

    return latest;
  }

  static GetLatestWithMajor(
    versions: Version[],
    major: number
  ): Version | undefined {
    if (versions.length === 0) return undefined;

    let latest: Version | undefined;

    for(const v of versions) {

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
    minor: number
  ): Version | undefined {
    if (versions.length === 0) return undefined;

    let latest: Version | undefined;

    for(const v of versions) {

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

  static FromString(versionString: string): Result<Version, Error> {
    const stringSplit = versionString.split(".");

    if (stringSplit.length !== 3) {
      const err = new Error(
        `Unable to parse version string: ${versionString} because it could not be split into 3 parts`
      );
      return reject(err);
    }

    const major = parseInt(stringSplit[0], 10);
    const minor = parseInt(stringSplit[1], 10);
    const patchLabel = stringSplit[2];
    let patch = NaN;
    let label: string | undefined;

    const indexOfDash = patchLabel.indexOf("-");

    if (indexOfDash > 0) {
      const patchStr = patchLabel.substring(0, indexOfDash);
      patch = parseInt(patchStr, 10);
      label = patchLabel.substring(indexOfDash + 1);
    } else {
      patch = parseInt(patchLabel, 10);
    }

    if (isNaN(major)) {
      const err = new Error(
        `Unable to parse version string: ${versionString} because Major is not a number`
      );
      return reject(err);
    }
    if (isNaN(minor)) {
      const err = new Error(
        `Unable to parse version string: ${versionString} because Minor is not a number`
      );
      return reject(err);
    }
    if (isNaN(patch)) {
      const err = new Error(
        `Unable to parse version string: ${versionString} because Patch is not a number`
      );
      return reject(err);
    }

    const version = new Version(major, minor, patch, label);
    return resolve(version);
  }

  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly label?: string;

  toString = (): string => {
    if (this.label) {
      return `${this.major}.${this.minor}.${this.patch}-${this.label}`;
    } else {
      return `${this.major}.${this.minor}.${this.patch}`;
    }
  };

  equals = (otherVersion: Version): boolean => {
    if (otherVersion.major !== this.major) return false;
    if (otherVersion.minor !== this.minor) return false;
    if (otherVersion.patch !== this.patch) return false;
    if (otherVersion.label !== this.label) return false;

    return true;
  };

  constructor(major: number, minor: number, patch: number, label?: string) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.label = label;
  }
}
