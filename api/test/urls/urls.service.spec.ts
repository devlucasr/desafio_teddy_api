import { UrlsService } from '../../src/modules/urls/application/urls.service';
import { cacheMock } from '../__mocks__/cache.mock';

describe('UrlsService', () => {
  let service: UrlsService;
  let repo: {
    isShortCodeTaken: jest.Mock
    create: jest.Mock
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = {
      isShortCodeTaken: jest.fn(),
      create: jest.fn()
    };

    const dep0 = repo as unknown as ConstructorParameters<typeof UrlsService>[0];
    const dep1 = cacheMock as unknown as ConstructorParameters<typeof UrlsService>[1];
    service = new UrlsService(dep0, dep1);
  });

  it('createShort: cria registro e retorna shortUrl', async () => {
    repo.isShortCodeTaken.mockResolvedValueOnce(false);
    repo.create.mockResolvedValue({
      id: 1,
      slug: 'abc123',
      original: 'https://ex.com',
      clicks: 0
    });

    const res = await service.createShort('https://ex.com', '1');

    expect(repo.create).toHaveBeenCalled();
    expect(res).toHaveProperty('shortUrl');
    expect(typeof res.shortUrl).toBe('string');
  });
});
