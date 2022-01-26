export class cacheManager {
    static getInstance: cacheManager

    cache: { [key: string]: any } = {};

    constructor() {
        cacheManager.getInstance = this;
    }

    async set(key: string, value: any, deleteTime: number = 8.64e+7 /*default - 1 hour - in ms*/) {
        this.cache[key] = value;
        setTimeout(() => {
            delete this.cache[key];
        }, deleteTime);
    }
    async get(key: string) {
        console.log(this.cache.key)
        return this.cache[key] || undefined;
    }
    async exists(key: string) {
        return this.cache[key] !== undefined && this.cache[key] !== null;
    } 

    length() {
        return Object.keys(this.cache).length;
    }
}