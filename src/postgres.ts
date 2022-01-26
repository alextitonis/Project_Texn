import { Client } from 'pg';

export class postgres {
    static getInstance: postgres
    client: Client;

    constructor() {
        postgres.getInstance = this;
    }

    async connect() {
        const config = {
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT,
            host: process.env.PGHOST,
            ssl: process.env.PGSSL ? {
                rejectUnauthorized: false
            } : false
        }
        this.client = new Client(config);
        this.client.connect();
        const res = await this.client.query('SELECT NOW()')
        console.log(res);
    }

    async login(username: string, password: string, errorCallback: Function, callback: Function) {
        const query = "SELECT * FROM users WHERE username=$1 AND password=$2"
        const values = [username, password]

        await postgres.getInstance.client.query(query, values, (err, res) => {
            if (err) {
                console.log(err)
                if (errorCallback)
                errorCallback()
            } else {
                if (callback)
                callback(res && res.rows && res.rows.length > 0)
            }
        });
    }
    async register(email: string, username: string, password: string, errorCallback: Function, callback: Function) {
        const query = "SELECT * FROM users WHERE email=$1 OR username=$2"
        const values = [email, username]

        await postgres.getInstance.client.query(query, values, (err, res) => {
            if (err) {
                console.log(err)
                if (errorCallback)
                errorCallback()
            } else {
                const query2 = "INSERT INTO users(username, email, password) VALUES($1, $2, $3)"
                const values2 = [email, username, password]

                postgres.getInstance.client.query(query2, values2, (err, res) => {
                    if (err) {
                        console.log(err)
                        if (errorCallback)
                        errorCallback()
                    } else {
                        if (callback)
                        callback()
                    }
                })
            }
        })
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