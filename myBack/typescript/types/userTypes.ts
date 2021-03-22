type UserRegister = {
    username: string,
    email: string,
    password: string
}

type UserLogin = {
    username: string,
    password: string
}

type TokenPayload = {
    id: number,
    username: string,
}

export type {
    UserRegister,
    UserLogin,
    TokenPayload
}