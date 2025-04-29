# Unit Test Best Practices

Use the following best practices when writing and refactoring tests:

- Use the command `npm run test:once TEST_FILE_NAME` to run a test
- Do not add appObjects.submitWarning = jest.fn() to the test rig.
- If a test is expected to warn, add `appObjects.submitWarning = jest.fn()` to that specific test.