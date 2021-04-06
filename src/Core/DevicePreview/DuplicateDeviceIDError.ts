export class DuplicateDeviceIDError extends Error {
  constructor(id: string) {
    super(`${id} is a duplicate`)
  }
} 
