import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/modules/users/presentation/http/users.controller';
import { UsersService } from 'src/modules/users/application/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let serviceMock: { create: jest.Mock };

  beforeEach(async () => {
    serviceMock = { create: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: serviceMock }]
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
  });

  it('create delega ao service e retorna wrapper { data }', async () => {
    const dto = { name: 'Lucas', email: 'a@a.com', password: 'Abc@1234' };
    const expected = { id: 1, name: 'Lucas', email: 'a@a.com' };

    serviceMock.create.mockResolvedValue(expected);

    const res = await (controller as unknown as {
      create: (body: typeof dto) => Promise<{ data: typeof expected }>;
    }).create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ data: expected });
  });
});
