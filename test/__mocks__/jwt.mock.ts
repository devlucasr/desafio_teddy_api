export const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('signed.jwt.token'),
  signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
  verify: jest.fn().mockReturnValue({ sub: 1 })
};
