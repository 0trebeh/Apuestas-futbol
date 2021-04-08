type UserRegister = {
  name: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  document?: string;
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
