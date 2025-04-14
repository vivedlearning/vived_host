Your goal is to create a new PM

- Reference the app object architecture described in @vived/core. Specifically pay attention to Presentation Managers (PMs)
- Refer to the ExampleFolder in @vived/core for example code and tests
- Create a new file in the PMs folder for the feature that this PM belongs to. If you do not know what feature this PM belongs to, ask.
- If you do not know what Entity to observe ask for it
- If the entity you are observing is a singleton, then assume this PM is also a singleton. Otherwise assume it is non-singleton
- If you do not know if this PM should be a singleton, ask
- If you do not know what the VM should be, ask
- If this is a singleton, do not implement the dispose function. If it is not a singleton, implement a dispose function
- Create a test file for the PM. Be sure to test for equal VMs and make sure every property in the VM is checked for a change. These should be separate tests
- Test to make sure that this PM is updated when the Entity changes
- Do not mock the entity or entities
- If this PM is a singleton be sure to test to see if it registers as a singleton
- Make a Mock for this PM in the mocks folder.
- Make an adapter for this PM in the Adapters folder
- When testing the adapter use the Mock PM
- Add the Mock, Adapter, and PM to their local index files for export
