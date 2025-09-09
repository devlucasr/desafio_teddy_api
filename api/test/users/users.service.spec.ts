import { UsersService } from '../../src/modules/users/application/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

type CreateUserInput = { name: string; email: string; password: string };
type PublicUser = { id: number; name: string; email: string };
type RepoUser = PublicUser & { password: string };

type UsersRepoMock = {
  findByEmail: jest.Mock<Promise<RepoUser | null>, [string]>;
  create: jest.Mock<
    Promise<RepoUser>,
    [CreateUserInput & { password: string }]
  >;
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: UsersRepoMock;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    const dep0 = repo as unknown as ConstructorParameters<
      typeof UsersService
    >[0];
    service = new UsersService(dep0);
  });

  it('create: cadastra usuário com senha hasheada e retorna user público', async () => {
    repo.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');

    const input: CreateUserInput = {
      name: 'Lucas',
      email: 'a@a.com',
      password: 'Abc@1234'
    };
    const created: RepoUser = {
      id: 1,
      name: 'Lucas',
      email: 'a@a.com',
      password: 'hashed'
    };
    repo.create.mockResolvedValue(created);

    const res = (await (
      service as unknown as {
        create: (d: CreateUserInput) => Promise<PublicUser>;
      }
    ).create(input)) as PublicUser;

    expect(repo.findByEmail).toHaveBeenCalledWith('a@a.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('Abc@1234', expect.any(Number));
    expect(repo.create).toHaveBeenCalledWith({ ...input, password: 'hashed' });
    expect(res).toEqual({ id: 1, name: 'Lucas', email: 'a@a.com' });
  });

  it('create: falha se e-mail já existe', async () => {
    const existing: RepoUser = {
      id: 9,
      name: 'Ex',
      email: 'dup@a.com',
      password: 'x'
    };
    repo.findByEmail.mockResolvedValue(existing);

    const input: CreateUserInput = {
      name: 'Lucas',
      email: 'dup@a.com',
      password: 'Abc@1234'
    };

    await expect(
      (
        service as unknown as {
          create: (d: CreateUserInput) => Promise<PublicUser>;
        }
      ).create(input)
    ).rejects.toThrow();
    expect(repo.create).not.toHaveBeenCalled();
  });
});
