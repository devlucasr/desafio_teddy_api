export type DomainUser = {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type PublicUser = Pick<
  DomainUser,
  'id' | 'name' | 'email' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export type CreateUserInput = {
  name: string
  email: string
  password: string
}
