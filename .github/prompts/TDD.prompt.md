# Test Driven Development Workflow

If you are asked to follow TDD when writing any code you need to follow the following steps in order:

1. Write a Failing Test
	- Create a test that will fail initially
	- Avoid mocking the component under test
	- Focus on testing behavior, not implementation

2. Verify Test Failure
	- Execute the test and confirm it fails
	- Do not implement any fixes at this stage
	- Document expected vs actual behavior

3. Commit Failing Test
	- Stage changes
	- Create a clear commit message
	- Push the failing test

4. Implement Solution
	- Write minimal code to make test pass
	- Keep test code unchanged
	- Run tests frequently
	- Refactor while maintaining test coverage
	- Iterate until all tests pass

## Commands
- Use the following command to run test: `cd LOCAL_PATH ; npm run test:once "Path to test"`
- Example: `cd c:\Users\amosp\Documents\WebGL\vivedlearning_host ; npm run test:once "StateMachine/Entities/HostStateEntity.test.ts"`

## Exceptions
The following file should not be follow this process unless explicitly asked
- Main.ts
- Mocks
- Factories