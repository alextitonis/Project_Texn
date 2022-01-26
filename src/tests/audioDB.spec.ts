import { audioDB } from '../audioDB';
import { cacheManager } from '../cacheManager';

const adb = new audioDB();
new cacheManager();

test('biography length should not be 0', async() => {
  await adb.requestBiography('drake', (artist, img) => {
    expect(artist.length).not.toBe(0)
    expect(artist).not.toBe('no artist found!')
  });
})

test('album length should not be 0', async() => {
  await adb.requestAlbums('drake', (artist) => {
    expect(artist.length).not.toBe(0)
    expect(artist).not.toBe('no albums found!')
  })
})