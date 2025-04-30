# Unit Test Best Practices

Use the following best practices when writing and refactoring tests:

- Fix all compiler errors
- Use the command `npm run test:once TEST_FILE_NAME` to run a test
- Do not add `appObjects.submitWarning = jest.fn()` globally
- If a test is expected to warn, add `appObjects.submitWarning = jest.fn()` to that specific test.
- Do not add `appObjects.submitError = jest.fn()` globally
- If a test is expected to submit an error, add `appObjects.submitError = jest.fn()` to that specific test.
- Do not nest a describe block inside another describe block
- Name the App Object Repo appObjects
- Do not mock the App Object Repo
- Construct the App Object Repo with `appObjects = makeAppObjectRepo()`
- Make new app objects with `appObject = appObjects.getOrCreate("test object name")`
- Avoid mocking entities
- Avoid local mocks. Instead look for mocks in the Mock folder
- If you are testing an Adapter use a mock PM from the Mock folder
- If the script being tested calls a UC, use a mock for that UC from the Mocks folder
- Use "it" for test blocks instead of "test"
- makeTestRig is no longer preferred. Instead use local variables which are set in the beforeEach test function
- Keep tests completely free of comments - the test code and descriptive "it" statements should be self-explanatory
- Do not add explanatory comments to test sections like "// Setup", "// Act", "// Assert", etc.
- Do not repeat the test name or description in comments
- Do not include comments explaining what the code is doing - the code should speak for itself
- Implement one test at a time