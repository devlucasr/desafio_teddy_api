type User = {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

function randomEmail() {
  return `user${Math.floor(Math.random() * 1_000_000)}@example.com`;
}

function randomName() {
  const first = ['Lucas', 'Ana', 'João', 'Marina', 'Paulo', 'Carla'];
  const last = ['Silva', 'Souza', 'Oliveira', 'Ferreira', 'Costa', 'Almeida'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: overrides.id ?? Math.floor(Math.random() * 10_000) + 1,
    name: overrides.name ?? randomName(),
    email: overrides.email ?? randomEmail(),
    password: overrides.password ?? 'hashed',
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date()
  };
}
