import { useService } from './transform-test.service';
import { mockUser, mockUseService } from './__mocks__/transform-test.service';

jest.mock('./transform-test.service');

describe('Jest transform service', () => {
  it('supports direct import from files in __mocks__ folder', () => {
    mockUseService.mockReturnValueOnce({
      id: 'local-mock',
    });

    expect(useService().id).toBe('local-mock');
  });

  it('can be manual mocked', () => {
    expect(useService().id).toBe(mockUser.id);
  });
});
