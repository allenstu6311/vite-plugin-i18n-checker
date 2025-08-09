const a = {
    test: '123',
    b: {
        c: '456',
        d: [1, 2, 3],
        e: {
            f: '789',
        }
    }
}

export default {
    ...a,
    title: '登入',
    username: '帳號',
    password: '密碼',
    login: '登入',
}