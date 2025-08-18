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
    title: 'Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
}