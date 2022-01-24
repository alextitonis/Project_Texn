import { urlencoded, json }  from 'express';
import express = require('express');
import { audioDB } from './audioDB';
import { emailManager } from './emailManager';
import { postgres } from './postgres';

export async function create() {
    const router = express.Router();
    router.use(urlencoded({ extended: false }));
    const app = express()
    app.use(json())

    app.get('/test', (req, res) => {
        res.send('Hello World I am running locally');
    });
    app.route('/login').post((req: express.Request, res: express.Response) => {
        const username = req.body.username
        const password = req.body.password
        postgres.getInstance.login(username, password, () => {
            res.status(402).send(JSON.stringify({ result: 'fail' }));
        }, (found) => {
            if (found) {
                res.status(200).send(JSON.stringify({ result: 'success' }));
            } else {
                res.status(200).send(JSON.stringify({ result: 'not found' }));
            }
        })
    });
    app.route('/registration').post((req: express.Request, res: express.Response) => {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        postgres.getInstance.register(email, username, password, () => {
            res.status(402).send(JSON.stringify({ result: 'fail' }));
        }, () => {
            res.status(200).send(JSON.stringify({ result: 'success' }));
        })
    });
    app.route('/forgot_password').post((req: express.Request, res: express.Response) => { 
        const email = req.body.email
        postgres.getInstance.forgotPassword(email, (password) => {
            res.status(200).send(JSON.stringify({ result: 'success' }));
            emailManager.getInstance.sendEmail(email, 'Forgot Password', 'Your password is: ' + password);
        }, () => {
            res.status(200).send(JSON.stringify({ result: 'fail' }));
        })
    });
    app.route('/artistBiography').post((req: express.Request, res: express.Response) => { 
        const artist = req.body.artist
        audioDB.getInstance.requestBiography(artist, async (biography, img) => { 
            res.status(200).send(JSON.stringify({ result: 'success', artist: biography, img: img }));
        })
    });
    app.route('/artistAlbums').post((req: express.Request, res: express.Response) => { 
        const artist = req.body.artist
        audioDB.getInstance.requestAlbums(artist, async (albums) => { 
            res.status(200).send(JSON.stringify({ result: 'success', artist: albums }));
        })
    });

    app.listen(process.env.PORT, () => {  console.log(`Server listening on http://localhost:${process.env.PORT}`); })
}
