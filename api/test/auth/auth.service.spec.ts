import { AuthService } from '../../src/modules/auth/application/auth.service';
import { jwtServiceMock } from '../__mocks__/jwt.mock';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: { findByEmail: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepo = { findByEmail: jest.fn() };

    const dep0 = usersRepo as unknown as ConstructorParameters<typeof AuthService>[0];
    const dep1 = jwtServiceMock as unknown as ConstructorParameters<typeof AuthService>[1];
    service = new AuthService(dep0, dep1);
  });

  it('login: retorna accessToken quando credenciais ok', async () => {
    usersRepo.findByEmail.mockResolvedValue({ id: 1, email: 'a@a.com', name: 'A', password: 'hashed' })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await service.login('a@a.com', 'Abc@1234');

    expect(usersRepo.findByEmail).toHaveBeenCalledWith('a@a.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('Abc@1234', 'hashed');
    expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    expect(jwtServiceMock.signAsync.mock.calls[0][0]).toMatchObject({ sub: 1 });
    expect(res).toEqual({ access_token: 'signed.jwt.token' });
  });

  it('login: lança erro quando senha incorreta', async () => {
    usersRepo.findByEmail.mockResolvedValue({ id: 1, email: 'a@a.com', name: 'A', password: 'hashed' })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('a@a.com', 'wrong-pass')).rejects.toThrow();
  });

  it('login: lança erro quando usuário não existe', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    await expect(service.login('ghost@a.com', 'qualquer')).rejects.toThrow();
  });
});
