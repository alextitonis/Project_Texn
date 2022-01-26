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
    app.route('/login').post(async (req: express.Request, res: express.Response) => {
        const username = req.body.username
        const password = req.body.password
        const resp = await postgres.getInstance.login(username, password);
        if (resp) {
            res.status(200).send(JSON.stringify({ result: 'success' }));
        } else { 
            res.status(200).send(JSON.stringify({ result: 'not found' }));
        }
    });
    app.route('/registration').post(async (req: express.Request, res: express.Response) => {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        console.log('trying to register');
        const resp = await postgres.getInstance.register(email, username, password);
        if (resp) {
            res.status(200).send(JSON.stringify({ result: 'success' }));
        } else {
            res.status(402).send(JSON.stringify({ result: 'fail' }));
        }
    });
    app.route('/forgot_password').post(async (req: express.Request, res: express.Response) => { 
        const email = req.body.email
        await postgres.getInstance.forgotPassword(email, (password) => {
            res.status(200).send(JSON.stringify({ result: 'success' }));
            emailManager.getInstance.sendEmail(email, 'Forgot Password', 'Your password is: ' + password);
        }, () => {
            res.status(200).send(JSON.stringify({ result: 'fail' }));
        })
    });
    app.route('/artistBiography').post(async(req: express.Request, res: express.Response) => { 
        const artist = req.body.artist
        await audioDB.getInstance.requestBiography(artist, async (biography, img) => { 
            res.status(200).send(JSON.stringify({ result: 'success', artist: biography, img: img }));
        })
    });
    app.route('/artistAlbums').post(async (req: express.Request, res: express.Response) => { 
        const artist = req.body.artist
        await audioDB.getInstance.requestAlbums(artist, async (albums) => { 
            res.status(200).send(JSON.stringify({ result: 'success', artist: albums }));
        })
    });

    app.listen(process.env.PORT, () => {  console.log(`Server listening on http://localhost:${process.env.PORT}`); })
}
