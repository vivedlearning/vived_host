import { Version } from "./Version"

test("Inialization", ()=>{
  const version = new Version(1,2,3,"yo");
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.label).toEqual("yo");
  expect(version.toString()).toEqual("1.2.3-yo");
})

test("Without a label", ()=>{
  const version = new Version(1,2,3);
  expect(version.major).toEqual(1);
  expect(version.minor).toEqual(2);
  expect(version.patch).toEqual(3);
  expect(version.label).toBeUndefined()
  expect(version.toString()).toEqual("1.2.3");
})

test("Equals", ()=>{
  const version = new Version(1,2,3);
  expect(version.equals(new Version(1,2,3))).toEqual(true);
  expect(version.equals(new Version(1,2,4))).toEqual(false);
  expect(version.equals(new Version(1,3,3))).toEqual(false);
  expect(version.equals(new Version(2,2,3))).toEqual(false);
  expect(version.equals(new Version(1,2,3, "pasta"))).toEqual(false);
})

test("Getting the latest from list", ()=>{
  const version1 = new Version(1,2,3);
  const version2 = new Version(0,2,3);
  const version3 = new Version(1,2,4);
  const version4 = new Version(0,0,4);
  const versions = [
    version1,
    version2,
    version3,
    version4
  ]

  const latest = Version.GetLatest(versions);

  expect(latest).toEqual(version3);
})

test("Getting the latest from list returns undefined if the list is empty", ()=>{
  const latest = Version.GetLatest([]);
  expect(latest).toBeUndefined();
})

test("Getting the latest major", ()=>{
  const version1 = new Version(2,2,3);
  const version2 = new Version(0,2,3);
  const version3 = new Version(1,2,4);
  const version4 = new Version(0,3,4);
  const versions = [
    version1,
    version2,
    version3,
    version4
  ]

  const latest = Version.GetLatestWithMajor(versions, 0);

  expect(latest).toEqual(version4);
})

test("Getting the latest with a bad major returns undefined", ()=>{
  const version1 = new Version(2,2,3);
  const version2 = new Version(0,2,3);
  const version3 = new Version(1,2,4);
  const version4 = new Version(0,3,4);
  const versions = [
    version1,
    version2,
    version3,
    version4
  ]

  const latest = Version.GetLatestWithMajor(versions, 4);

  expect(latest).toBeUndefined();
})

test("Getting the latest major minor", ()=>{
  const version1 = new Version(1,2,3);
  const version2 = new Version(0,2,3);
  const version3 = new Version(1,2,4);
  const version4 = new Version(0,3,4);
  const versions = [
    version1,
    version2,
    version3,
    version4
  ]

  const latest = Version.GetLatestWithMajorMinor(versions, 1, 2);

  expect(latest).toEqual(version3);
})

test("Getting the latest major minor can return undefined", ()=>{
  const version1 = new Version(1,2,3);
  const version2 = new Version(0,2,3);
  const version3 = new Version(1,2,4);
  const version4 = new Version(0,3,4);
  const versions = [
    version1,
    version2,
    version3,
    version4
  ]

  const latest = Version.GetLatestWithMajorMinor(versions, 1, 3);

  expect(latest).toBeUndefined();
})

test("From string", ()=>{
  const result = Version.FromString("1.2.3");
  expect(result.isResolved).toEqual(true);

  expect(result.value?.major).toEqual(1);
  expect(result.value?.minor).toEqual(2);
  expect(result.value?.patch).toEqual(3);
  expect(result.value?.label).toBeUndefined();
})

test("From string with label", ()=>{
  const result = Version.FromString("1.2.3-your-mom");
  expect(result.isResolved).toEqual(true);

  expect(result.value?.major).toEqual(1);
  expect(result.value?.minor).toEqual(2);
  expect(result.value?.patch).toEqual(3);
  expect(result.value?.label).toEqual("your-mom");
})

test("Not enough parts rejects", ()=>{
  const result = Version.FromString("1.2");
  expect(result.isRejected).toEqual(true);
  expect(result.error).not.toBeUndefined();
})

test("Too many parts rejects", ()=>{
  const result = Version.FromString("1.2.3.4");
  expect(result.isRejected).toEqual(true);
  expect(result.error).not.toBeUndefined();
})

test("Major is not a number should reject", ()=>{
  const result = Version.FromString("boo.2.3");
  expect(result.isRejected).toEqual(true);
  expect(result.error).not.toBeUndefined();
})

test("Minor is not a number should reject", ()=>{
  const result = Version.FromString("1.boo.3");
  expect(result.isRejected).toEqual(true);
  expect(result.error).not.toBeUndefined();
})

test("Patch is not a number should reject", ()=>{
  const result = Version.FromString("1.2.boo");
  expect(result.isRejected).toEqual(true);
  expect(result.error).not.toBeUndefined();
})
