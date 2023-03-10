import Sound from "@utils/sound"
import AbstractAudio from "../Sound/APIs/AbstractAudio"

class SoundCtrls {
    private sounds: AbstractAudio[] = []
    private pausedSounds: AbstractAudio[] = []
    constructor() {
        Sound.onCreate(sound => this.sounds.push(sound))
        Sound.onDestroy(sound => {
            this.sounds = this.sounds.filter(s => s !== sound)
            this.pausedSounds = this.sounds.filter(s => s !== sound)
        })
    }
    pause() {
        this.pausedSounds = this.sounds.filter(sound => sound.playing) // sounds that were playing before pause call
        this.sounds.forEach(sound => {
            sound.pause()
        })
    }
    resume() {
        this.pausedSounds.forEach(sound => {
            sound.resume()
        })
        this.reset()
    }
    stop() {
        this.sounds.forEach(sound => { // pausing all sounds without keeping setting pausedSounds effectively stops them until sth else calls play
            sound.pause()
        })
    }
    reset() {
        this.pausedSounds = []
    }
    off() {
        this.stop()
        Sound.off()
    }
    on() {
        Sound.on()
    }
}

export default SoundCtrls