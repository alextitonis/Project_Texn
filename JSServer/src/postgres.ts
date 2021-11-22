import { Client } from 'pg';

export class postgres {
    static getInstance: postgres
    client: Client;

    constructor() {
        postgres.getInstance = this;
    }

    async connect() {
        this.client = new Client();
        this.client.connect();
        const res = await postgres.getInstance.client.query('SELECT NOW()')
    }

    async login(username: string, password: string, errorCallback: Function, callback: Function) {
        const query = "SELECT * FROM users WHERE username=$1 AND password=$2"
        const values = [username, password]

        postgres.getInstance.client.query(query, values, (err, res) => {
            if (err) {
                console.log(err)
                errorCallback()
            } else {
                callback()
            }
        });
    }
    async register(email: string, username: string, password: string, errorCallback: Function, callback: Function) {
        const query = "SELECT * FROM users WHERE email=$1 OR passowrd=$2"
        const values = [email, username]

        postgres.getInstance.client(query, values, (err, res) => {
            if (err) {
                console.log(err)
                errorCallback()
            } else {
                const query2 = "INSERT INTO users(username, email, password) VALUES($1, $2, $3)"
                const values2 = [email, username, password]

                postgres.getInstance.client(query2, values2, (err, res) => {
                    if (err) {
                        console.log(err)
                        errorCallback()
                    } else {
                        callback()
                    }
                })
            }
        })
    }
}