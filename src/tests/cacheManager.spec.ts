import { cacheManager } from '../cacheManager';

const cm = new cacheManager();

test('test the cache manager auto remove and add functions', async() => {
    expect(cm.length()).toBe(0);

    await cm.set('test_key', 'test_value', 1000);
    expect(cm.length()).toBe(1);

    await delay(1500);
    expect(cm.length()).toBe(0);
})

const delay = ms => new Promise(res => setTimeout(res, ms));