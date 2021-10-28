export interface IUser {
  id: string;
}

export function useService(): IUser {
  return {
    id: 'from-service',
  };
}
