import { Version, VersionStage } from './Version';

test('Initialization', () => {
  const version = new Version(1, 2, 3, VersionStage.BETA, 'yo');
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.stage).toEqual(VersionStage.BETA);
  expect(version.label).toEqual('yo');
});

test('Without a label', () => {
  const version = new Version(1, 2, 3, VersionStage.ALPHA);
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.stage).toEqual(VersionStage.ALPHA);
  expect(version.label).toBeUndefined();
});

describe('Version strings', () => {
  it('Shows alpha after the version', () => {
    const version = new Version(1, 2, 3, VersionStage.ALPHA);
    expect(version.displayString).toEqual('1.2.3-alpha');
  });

  it('Appends the label after alpha', () => {
    const version = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    expect(version.displayString).toEqual('1.2.3-alpha-yo');
  });

  it('Shows beta after the version', () => {
    const version = new Version(1, 2, 3, VersionStage.BETA);
    expect(version.displayString).toEqual('1.2.3-beta');
  });

  it('Appends the label after beta', () => {
    const version = new Version(1, 2, 3, VersionStage.BETA, 'yo');
    expect(version.displayString).toEqual('1.2.3-beta-yo');
  });

  it('Does not show a release string', () => {
    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    expect(version.displayString).toEqual('1.2.3');
  });

  it('Appends the label after version for release', () => {
    const version = new Version(1, 2, 3, VersionStage.RELEASED, 'yo');
    expect(version.displayString).toEqual('1.2.3-yo');
  });
});

describe('Version strings', () => {
  it('Returns the stripped string for a release without label', () => {
    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    expect(version.baseVersionString).toEqual('1.2.3');
  });

  it('Returns the stripped string for a release with a label', () => {
    const version = new Version(1, 2, 3, VersionStage.RELEASED, 'yo');
    expect(version.baseVersionString).toEqual('1.2.3');
  });

  it('Returns the stripped string for an alpha without label', () => {
    const version = new Version(1, 2, 3, VersionStage.ALPHA);
    expect(version.baseVersionString).toEqual('1.2.3');
  });

  it('Returns the stripped string for an alpha with a label', () => {
    const version = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    expect(version.baseVersionString).toEqual('1.2.3');
  });

  it('Returns the stripped string for a beta without label', () => {
    const version = new Version(1, 2, 3, VersionStage.BETA);
    expect(version.baseVersionString).toEqual('1.2.3');
  });

  it('Returns the stripped string for a beta with a label', () => {
    const version = new Version(1, 2, 3, VersionStage.BETA, 'yo');
    expect(version.baseVersionString).toEqual('1.2.3');
  });
});

describe('Getting the latest from a list', () => {
  it('Gets the latest from list', () => {
    const version1 = new Version(1, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions);

    expect(latest).toEqual(version3);
  });

  it('Returns the latest regardless of the stage', () => {
    const version1 = new Version(1, 2, 3, VersionStage.ALPHA);
    const version2 = new Version(0, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 0, 4, VersionStage.BETA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions);

    expect(latest).toEqual(version3);
  });

  it('Returns undefined if the list is empty', () => {
    const latest = Version.GetLatest([]);
    expect(latest).toBeUndefined();
  });
});

describe('Getting the latest major', () => {
  it('Gets the latest major', () => {
    const version1 = new Version(2, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 3, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0);

    expect(latest).toEqual(version4);
  });

  it('Returns undefined if there are no majors that match', () => {
    const version1 = new Version(2, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 3, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 4);

    expect(latest).toBeUndefined();
  });

  it('Gets the latest major regardless of stage', () => {
    const version1 = new Version(2, 2, 3, VersionStage.ALPHA);
    const version2 = new Version(0, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 3, 4, VersionStage.BETA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0);

    expect(latest).toEqual(version4);
  });
});

describe('Get the latest major/minor', () => {
  it('Get the latest major/minor combo', () => {
    const version1 = new Version(1, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 3, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2);

    expect(latest).toEqual(version3);
  });

  it('Returns undefined if there are no major/minor combos', () => {
    const version1 = new Version(1, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 3, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 3);

    expect(latest).toBeUndefined();
  });

  it('Get the latest major/minor combo regardless of stage', () => {
    const version1 = new Version(1, 2, 2, VersionStage.RELEASED);
    const version2 = new Version(1, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2);

    expect(latest).toEqual(version3);
  });
});

describe('Version from string', () => {
  it('Forms the version from string', () => {
    const version = Version.FromString('1.2.3');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toBeUndefined();
    expect(version.stage).toEqual(VersionStage.RELEASED);
  });

  it('Gets the alpha stage from the string', () => {
    const version = Version.FromString('1.2.3-alpha');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toBeUndefined();
    expect(version.stage).toEqual(VersionStage.ALPHA);
  });

  it('Gets the alpha stage and label from the string', () => {
    const version = Version.FromString('1.2.3-alpha-your-mom');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toEqual('your-mom');
    expect(version.stage).toEqual(VersionStage.ALPHA);
  });

  it('Gets the beta stage from the string', () => {
    const version = Version.FromString('1.2.3-beta');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toBeUndefined();
    expect(version.stage).toEqual(VersionStage.BETA);
  });

  it('Gets the beta stage and label from the string', () => {
    const version = Version.FromString('1.2.3-beta-your-mom');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toEqual('your-mom');
    expect(version.stage).toEqual(VersionStage.BETA);
  });

  it('Gets the label for a released stage from the string', () => {
    const version = Version.FromString('1.2.3-yo');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toEqual('yo');
    expect(version.stage).toEqual(VersionStage.RELEASED);
  });

  it('Forms the version from string with a hyphenated label', () => {
    const version = Version.FromString('1.2.3-your-mom');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toEqual('your-mom');
    expect(version.stage).toEqual(VersionStage.RELEASED);
  });

  it('Throws if there are not enough parts', () => {
    expect.assertions(1);

    try {
      Version.FromString('1.2');
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  it('Throws if there are too many parts', () => {
    expect.assertions(1);
    try {
      Version.FromString('1.2.3.4');
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  it('Throws if major is not a number', () => {
    expect.assertions(1);
    try {
      Version.FromString('boo.2.3');
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  it('Throws if minor is not a number', () => {
    expect.assertions(1);
    try {
      Version.FromString('1.boo.3');
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  it('Throws if patch is not a number', () => {
    expect.assertions(1);
    try {
      Version.FromString('1.2.boo');
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });
});

describe('Testing are equal', () => {
  it('Returns true if equal', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    expect(Version.AreEqual(v1, v2)).toEqual(true);
  });

  it('Returns false if the majors are different', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(2, 2, 3, VersionStage.ALPHA, 'yo');
    expect(Version.AreEqual(v1, v2)).toEqual(false);
  });

  it('Returns false if the minors are different', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 1, 3, VersionStage.ALPHA, 'yo');
    expect(Version.AreEqual(v1, v2)).toEqual(false);
  });

  it('Returns false if the patches are different', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 2, VersionStage.ALPHA, 'yo');
    expect(Version.AreEqual(v1, v2)).toEqual(false);
  });

  it('Returns false if the stages are different', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 3, VersionStage.BETA, 'yo');
    expect(Version.AreEqual(v1, v2)).toEqual(false);
  });

  it('Returns false if the labels are different', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 3, VersionStage.ALPHA);
    expect(Version.AreEqual(v1, v2)).toEqual(false);
  });
});

describe('Testing for a newer version', () => {
  it('Returns true if the major version is larger', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(2, 2, 3, VersionStage.BETA);
    expect(Version.IsNewerVersion(v1, v2)).toEqual(true);
  });

  it('Returns true if the minor version is larger', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 3, 3, VersionStage.BETA);
    expect(Version.IsNewerVersion(v1, v2)).toEqual(true);
  });

  it('Returns true if the patch version is larger', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 4, VersionStage.BETA);
    expect(Version.IsNewerVersion(v1, v2)).toEqual(true);
  });

  it('Returns false if equal', () => {
    const v1 = new Version(1, 2, 3, VersionStage.ALPHA, 'yo');
    const v2 = new Version(1, 2, 3, VersionStage.BETA);
    expect(Version.IsNewerVersion(v1, v2)).toEqual(false);
  });
});
