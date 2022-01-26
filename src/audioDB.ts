import axios from 'axios'
import imageToBase64 = require('image-to-base64');
import { cacheManager } from './cacheManager';

export class audioDB { 
    static getInstance: audioDB;

    constructor() {
        audioDB.getInstance = this;
    }

    async requestBiography(artist: string, callback: Function) {
    if (!artist || artist.length <= 0) return 'invalid artist!'

    if (await cacheManager.getInstance.exists(artist)) {
        return cacheManager.getInstance.get(artist);
    }

    console.log('requesting')
    await axios.get(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${artist}`).then(async res => {
        let artist = ''
        let img = '';
        if (res.data.artists.length <= 0) artist = 'no artist found!'
        else {
            artist = res.data.artists[0].strBiographyEN
            img = res.data.artists[0].strArtistThumb;
            img = await imageToBase64(img);
            await cacheManager.getInstance.set(artist, artist + '', 8.64e+7)
        }

        callback(artist, img)
        })
    }
    async requestAlbums(artist: string, callback: Function) {
        if (!artist || artist.length <= 0) return 'invalid artist!'
    
        if (await cacheManager.getInstance.exists(artist)) {
            return cacheManager.getInstance.get(artist);
        }
    
        console.log('requesting')
        await axios.get(`https://theaudiodb.com/api/v1/json/2/discography.php?s=${artist}`).then(async res => {
            let artist = ''
            if (res.data.album.length <= 0) artist = 'no albums found!'
            else {
                artist = res.data.album
                await cacheManager.getInstance.set(artist, artist + '', 8.64e+7)
            }
    
            callback(artist)
            })
        }
}