type UserRegister = {
  name: string;
  email: string;
  password: string;
};

type UserLogin = {
  email: string;
  password: string;
};

type TokenPayload = {
  id: number;
  username: string;
};

export type {UserRegister, UserLogin, TokenPayload};
