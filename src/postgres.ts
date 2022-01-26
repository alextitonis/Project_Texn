import { Client } from 'pg';

export class postgres {
    static getInstance: postgres
    client: Client;

    constructor() {
        postgres.getInstance = this;
    }

    async connect() {
        this.client = new Client({
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT,
            host: process.env.PGHOST,
            ssl: process.env.PGSSL ? {
                rejectUnauthorized: false
            } : false
        });
        const res = await this.client.query('SELECT NOW()')
        const query = 'CREATE TABLE IF NOT EXISTS users(username varchar(255), email varchar(255), password varchar(255))';
        await this.client.query(query)
    }

    async login(username: string, password: string) {
        const query = "SELECT * FROM users WHERE username=$1 AND password=$2"
        const values = [username, password]

        const res = await postgres.getInstance.client.query(query, values);
        return res && res.rows && res.rows.length > 0;
    }
    async register(email: string, username: string, password: string) {
        const query = "SELECT * FROM users WHERE email=$1 OR username=$2"
        const values = [email, username]
        console.log(query, values);

        const res = await postgres.getInstance.client.query(query, values);
        console.log(res);
        if (res && res.rows && res.rows.length > 0) return false;
        
        const query2 = "INSERT INTO users(email, username, password) VALUES($1, $2, $3)"
        const values2 = [email, username, password]

        await postgres.getInstance.client.query(query2, values2);
        return true;
    }

    async forgotPassword(email: string, callback: Function, errorCallback: Function) {
        const query = "SELECT * FROM users WHERE email=$1"
        const values = [email]

        await postgres.getInstance.client.query(query, values, (err, res) => {
            if (err) {
                console.log(err)
                errorCallback()
            } else {
                if (res && res.rows) {
                    if (res.rows.length > 0) {
                        const password = res.rows.password
                        if (password && password.length > 0) {
                            callback(password)
                        }
                    }
                }
            }
        })
    }
}