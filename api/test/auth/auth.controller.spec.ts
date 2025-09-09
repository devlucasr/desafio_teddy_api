import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/presentation/http/auth.controller';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import { makeLoginDto } from '../factories/auth.factory';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: { login: jest.Mock };

  beforeEach(async () => {
    authServiceMock = { login: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('login delega ao service e retorna o token', async () => {
    const dto = makeLoginDto({ email: 'a@a.com', password: 'Abc@1234' });
    const expected = { accessToken: 't' };
    authServiceMock.login.mockResolvedValue(expected);

    const res = await controller.login(dto);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto.email, dto.password);
    expect(res).toEqual(expected);
  });
});
