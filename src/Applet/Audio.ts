export function PlaySfx(audio: HTMLAudioElement) {
    audio.currentTime = 0;
    audio.play()
}

var currentMusic: HTMLAudioElement|null = null;
export function PlayMusic(music: HTMLAudioElement|null, loop = true) {
    if(music && currentMusic != music) {
        music.currentTime = 0;
    }
    if(currentMusic) {
        currentMusic.pause();
    }
    currentMusic = music;
    if(currentMusic) {
        currentMusic.loop = loop;
        currentMusic.play();
    }
}
