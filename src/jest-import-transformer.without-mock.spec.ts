import { useService } from './transform-test.service';
import { mockUser, mockUseService } from './__mocks__/transform-test.service';

describe('Jest transform service', () => {
  it('does not change imports if not manually mocked', () => {
    expect(mockUseService()).toBe(mockUser);
    expect(mockUser.id).toBe('from-mock');
    expect(useService().id).toBe('from-service');
  });
});
