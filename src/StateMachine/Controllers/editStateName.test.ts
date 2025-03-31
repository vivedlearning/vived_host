import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {MockEditStateNameUC } from "../Mocks/MockEditStateNameUC";
import { editStateName } from "./editStateName";

describe("editStateName", () => {
	let appObjects: AppObjectRepo;
	let mockUC: MockEditStateNameUC;
	let mockEditFunction: jest.Mock;
	const testId = "test-state-id";
	const testName = "New State Name";

	beforeEach(() => {
		// Create a fresh repository for each test
		appObjects = makeAppObjectRepo();
		const testAppObject = appObjects.getOrCreate(testId);

		// Create the mock UC
		mockUC = new MockEditStateNameUC(testAppObject);
		
		// Setup the spy on the mock function
		mockEditFunction = jest.fn();
		mockUC.editStateName = mockEditFunction;
	});

	it("should call EditStateNameUC with the provided name", () => {
		// Call the controller function
		editStateName(testName, testId, appObjects);

		// Verify the use case was called with the correct name
		expect(mockEditFunction).toBeCalledWith(testName);
	});

	it("should do nothing when UC cannot be found", () => {
		// Call with an ID that doesn't have the UC
		const nonExistentId = "non-existent-id";

		// This should not throw an error
		expect(() => {
			editStateName(testName, nonExistentId, appObjects);
		}).not.toThrow();

		// Verify our original mock wasn't called
		expect(mockEditFunction).not.toHaveBeenCalled();
	});

	it("should submit a warning when UC is not found", () => {
		// Spy on the warning submission method
		const submitWarningSpy = jest.spyOn(appObjects, "submitWarning");

		// Call the controller function with a non-existent ID
		editStateName(testName, "non-existent-id", appObjects);

		// Verify warning was submitted
		expect(submitWarningSpy).toHaveBeenCalledWith(
			"editStateName",
			"Unable to find EditStateNameUC"
		);

		// Verify that the edit function was not called
		expect(mockEditFunction).not.toHaveBeenCalled();
	});
});
