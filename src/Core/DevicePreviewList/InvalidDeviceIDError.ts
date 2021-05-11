export class InvalidDeviceIDError extends Error {
  constructor(id: string) {
    super(`${id} is invalid`)
  }
} 
