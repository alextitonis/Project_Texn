import { postgres } from '../postgres';

const p = new postgres();
p.connect();
const email = "test@gmail.com"
const username = "test"
const _password = "test"

test('test the register, login and forgot password functions', async() => {
    await p.register(email, username, _password, () => {}, () => {});
    await p.login(username, _password, () => {}, () => { expect(true).toBe(true) });
    await p.forgotPassword(email, (password) => { expect(password).toBe(_password) }, () => {})
})