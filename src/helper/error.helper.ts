export const throwError = (message: string, status: number): never => {
  throw {
    message,
    status,
    error: new Error(),
  };
};
