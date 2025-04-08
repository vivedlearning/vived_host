import { makeAppObjectRepo } from "@vived/core";
import { MockUpdateAppUC } from "../Mocks/MockUpdateAppUC";
import { UpdateAppUC } from "./UpdateAppUC";

describe("UpdateAppUC", () => {
	describe("static get functions", () => {
		it("should return the UC when it exists on the app object", () => {
			// Arrange
			const appObjects = makeAppObjectRepo();
			const appId = "test-app-id";
			const appObject = appObjects.getOrCreate(appId);
			const mockUpdateAppUC = new MockUpdateAppUC(appObject);
			
			// Act
			const result = UpdateAppUC.get(appObject);
			
			// Assert
			expect(result).toBe(mockUpdateAppUC);
		});
		
		it("should return undefined when the UC doesn't exist on the app object", () => {
			// Arrange
			const appObjects = makeAppObjectRepo();
			const appId = "test-app-id";
			const appObject = appObjects.getOrCreate(appId);
			const submitWarningSpy = jest.spyOn(appObject.appObjectRepo, "submitWarning");
			
			// Act
			const result = UpdateAppUC.get(appObject);
			
			// Assert
			expect(result).toBeUndefined();
			expect(submitWarningSpy).toHaveBeenCalledWith(
				"UpdateAppUC.get",
				expect.stringContaining("Unable to find UpdateAppUC on app object")
			);
		});
		
		it("should return the UC when using getByID with a valid ID", () => {
			// Arrange
			const appObjects = makeAppObjectRepo();
			const appId = "test-app-id";
			const appObject = appObjects.getOrCreate(appId);
			const mockUpdateAppUC = new MockUpdateAppUC(appObject);
			
			// Act
			const result = UpdateAppUC.getByID(appId, appObjects);
			
			// Assert
			expect(result).toBe(mockUpdateAppUC);
		});
		
		it("should return undefined when using getByID with an invalid ID", () => {
			// Arrange
			const appObjects = makeAppObjectRepo();
			const invalidAppId = "invalid-app-id";
			const submitWarningSpy = jest.spyOn(appObjects, "submitWarning");
			
			// Act
			const result = UpdateAppUC.getByID(invalidAppId, appObjects);
			
			// Assert
			expect(result).toBeUndefined();
			expect(submitWarningSpy).toHaveBeenCalledWith(
				"UpdateAppUC.getByID",
				expect.stringContaining("Unable to find App Object by id")
			);
		});
	});
});