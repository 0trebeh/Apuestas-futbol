type DefaultResponse = {
    title: string,
    content: string
}

type LoginSuccess = {
    title: string,
    content: string,
    token: string
}

export type {
    DefaultResponse,
    LoginSuccess
}