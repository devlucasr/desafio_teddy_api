import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from '../../src/modules/urls/presentation/http/urls.controller';
import { UrlsService } from 'src/modules/urls/application/urls.service';

type UrlsServiceMock = {
  createShort: jest.Mock<Promise<{ shortUrl: string }>, [string, (string | undefined)?]>;
};

describe('UrlsController', () => {
  let controller: UrlsController;
  let serviceMock: UrlsServiceMock;

  beforeEach(async () => {
    serviceMock = { createShort: jest.fn() as UrlsServiceMock['createShort'] };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: serviceMock }]
    }).compile();

    controller = moduleRef.get<UrlsController>(UrlsController);
  });

  it('create delega ao service', async () => {
    serviceMock.createShort.mockResolvedValue({ shortUrl: 'http://localhost/xxx' });

    const req = { user: { id: '7' } } as unknown as Parameters<UrlsController['create']>[1];
    const res = await (
      controller as unknown as {
        create: (dto: { destination: string } | string, req?: unknown) => Promise<{ shortUrl: string }>;
      }
    ).create({ destination: 'https://ex.com' }, req);

    expect(serviceMock.createShort).toHaveBeenCalled();
    const last = serviceMock.createShort.mock.calls.at(-1);
    const firstArg = last?.[0] as unknown;
    const value = typeof firstArg === 'string' ? firstArg : (firstArg as { destination?: string })?.destination;
    expect(value).toBe('https://ex.com');
    expect(res).toEqual({ shortUrl: 'http://localhost/xxx' });
  });
});
