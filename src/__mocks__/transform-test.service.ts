import { IUser } from '../transform-test.service';

export const mockUser: IUser = {
  id: 'from-mock',
};

export const mockUseService = jest.fn<IUser, []>().mockReturnValue(mockUser);

export function useService(): IUser {
  return mockUseService();
}
