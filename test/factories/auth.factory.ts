type RegisterDto = {
  name: string
  email: string
  password: string
}

type LoginDto = {
  email: string
  password: string
}

function randomEmail() {
  return `user${Math.floor(Math.random() * 1_000_000)}@example.com`;
}

function randomName() {
  const first = ['Lucas', 'Ana', 'João', 'Marina', 'Paulo', 'Carla'];
  const last = ['Silva', 'Souza', 'Oliveira', 'Ferreira', 'Costa', 'Almeida'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

export function makeRegisterDto(overrides: Partial<RegisterDto> = {}): RegisterDto {
  return {
    name: overrides.name ?? randomName(),
    email: overrides.email ?? randomEmail(),
    password: overrides.password ?? 'Abc@1234'
  };
}

export function makeLoginDto(overrides: Partial<LoginDto> = {}): LoginDto {
  return {
    email: overrides.email ?? randomEmail(),
    password: overrides.password ?? 'Abc@1234'
  };
}
