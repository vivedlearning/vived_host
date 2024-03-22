import { Version, VersionStage } from './Version';

test('Initialization', () => {
  const version = new Version(1, 2, 3, VersionStage.BETA, 'yo');
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.stage).toEqual(VersionStage.BETA);
  expect(version.label).toEqual('yo');
  expect(version.displayString).toEqual('1.2.3-beta-yo');
});

test('Without a label', () => {
  const version = new Version(1, 2, 3, VersionStage.ALPHA);
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.stage).toEqual(VersionStage.ALPHA);
  expect(version.label).toBeUndefined();
  expect(version.displayString).toEqual('1.2.3-alpha');
});

test('Display string does not include a release string', () => {
  const v1 = new Version(1, 2, 3, VersionStage.RELEASED, 'yo');

  expect(v1.displayString).toEqual('1.2.3-yo');

  const v2 = new Version(1, 2, 3, VersionStage.RELEASED);

  expect(v2.displayString).toEqual('1.2.3');
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

  it('Returns undefined if there is no released version', () => {
    const version1 = new Version(1, 2, 3, VersionStage.ALPHA);
    const version2 = new Version(0, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 0, 4, VersionStage.BETA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions);

    expect(latest).toBeUndefined();
  });

  it('Returns undefined if the list is empty', () => {
    const latest = Version.GetLatest([]);
    expect(latest).toBeUndefined();
  });

  it('Only considers Released by default', () => {
    const version1 = new Version(1, 2, 3, VersionStage.BETA);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions);

    expect(latest).toEqual(version2);
  });

  it('Can consider Alpha', () => {
    const version1 = new Version(1, 2, 3, VersionStage.BETA);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions, VersionStage.ALPHA);

    expect(latest).toEqual(version3);
  });

  it('Gets the latest from list even if alpha is considered', () => {
    const version1 = new Version(1, 2, 3, VersionStage.ALPHA);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions, VersionStage.ALPHA);

    expect(latest).toEqual(version3);
  });

  it('Can consider Beta', () => {
    const version1 = new Version(1, 2, 3, VersionStage.BETA);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions, VersionStage.BETA);

    expect(latest).toEqual(version1);
  });

  it('Gets the latest from list even if beta is considered', () => {
    const version1 = new Version(1, 2, 3, VersionStage.BETA);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(1, 2, 4, VersionStage.RELEASED);
    const version4 = new Version(0, 0, 4, VersionStage.RELEASED);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatest(versions, VersionStage.BETA);

    expect(latest).toEqual(version3);
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

  it('Returns undefined if there are no released', () => {
    const version1 = new Version(2, 2, 3, VersionStage.ALPHA);
    const version2 = new Version(0, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const version4 = new Version(0, 3, 4, VersionStage.BETA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0);

    expect(latest).toBeUndefined();
  });

  it('Only considers release by default', () => {
    const version1 = new Version(2, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(0, 2, 4, VersionStage.BETA);
    const version4 = new Version(0, 3, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0);

    expect(latest).toEqual(version2);
  });

  it('Gets the latest major while consider alpha', () => {
    const version1 = new Version(2, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(0, 2, 4, VersionStage.BETA);
    const version4 = new Version(0, 3, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0, VersionStage.ALPHA);

    expect(latest).toEqual(version4);
  });

  it('Gets the latest major while consider beta', () => {
    const version1 = new Version(2, 2, 3, VersionStage.RELEASED);
    const version2 = new Version(0, 2, 3, VersionStage.RELEASED);
    const version3 = new Version(0, 2, 4, VersionStage.BETA);
    const version4 = new Version(0, 3, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3, version4];

    const latest = Version.GetLatestWithMajor(versions, 0, VersionStage.BETA);

    expect(latest).toEqual(version3);
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

  it('Only considers released by default', () => {
    const version1 = new Version(1, 2, 2, VersionStage.RELEASED);
    const version2 = new Version(1, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2);

    expect(latest).toEqual(version1);
  });

  it('Returns undefined if there are no released versions', () => {
    const version1 = new Version(1, 2, 2, VersionStage.BETA);
    const version2 = new Version(1, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2);

    expect(latest).toBeUndefined();
  });

  it('Considers Alpha releases', () => {
    const version1 = new Version(1, 2, 2, VersionStage.RELEASED);
    const version2 = new Version(1, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2, VersionStage.ALPHA);

    expect(latest).toEqual(version3);
  });

  it('Considers Beta releases', () => {
    const version1 = new Version(1, 2, 2, VersionStage.RELEASED);
    const version2 = new Version(1, 2, 3, VersionStage.BETA);
    const version3 = new Version(1, 2, 4, VersionStage.ALPHA);
    const versions = [version1, version2, version3];

    const latest = Version.GetLatestWithMajorMinor(versions, 1, 2, VersionStage.BETA);

    expect(latest).toEqual(version2);
  });
});

describe('Version from string', () => {
  it('Forms the version from string', () => {
    const version = Version.FromString('1.2.3');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toBeUndefined();
  });

  it('Forms the version from string with label', () => {
    const version = Version.FromString('1.2.3-your-mom');

    expect(version.major).toEqual(1);
    expect(version.minor).toEqual(2);
    expect(version.patch).toEqual(3);
    expect(version.label).toEqual('your-mom');
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

  it('Defaults the Stage to Released', () => {
    const version = Version.FromString('1.2.3');

    expect(version.stage).toEqual(VersionStage.RELEASED);
  });

  it('Can set the stage', () => {
    const version = Version.FromString('1.2.3', VersionStage.BETA);

    expect(version.stage).toEqual(VersionStage.BETA);
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
