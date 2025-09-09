type User = {
  id: number
  name?: string
  email: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

type Url = {
  id: number
  slug: string
  original: string
  clicks: number
  userId?: number
  createdAt?: Date
  updatedAt?: Date
}

type ModelMock<T> = {
  findUnique: jest.Mock<Promise<T | null>, unknown[]>
  findFirst: jest.Mock<Promise<T | null>, unknown[]>
  create: jest.Mock<Promise<T>, unknown[]>
  update: jest.Mock<Promise<T>, unknown[]>
  delete: jest.Mock<Promise<T>, unknown[]>
}

export type PrismaLike = {
  user: ModelMock<User>
  url: ModelMock<Url>
  $transaction: <T>(cb: (tx: PrismaLike) => T | Promise<T>) => Promise<T>
}

const transactionImpl: PrismaLike['$transaction'] = async <T>(
  cb: (tx: PrismaLike) => T | Promise<T>
): Promise<T> => {
  return cb(prismaMock as PrismaLike);
};

const $transactionMock = jest.fn(transactionImpl) as PrismaLike['$transaction'];

export const prismaMock: PrismaLike = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  url: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  $transaction: $transactionMock
};
