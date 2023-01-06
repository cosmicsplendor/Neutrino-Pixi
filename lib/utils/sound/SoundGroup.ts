import SoundPool from "./SoundPool"
class SoundGroup { // a list of slightly varying mutations of a sound (pool)
    private accessIdx: number = 0
    constructor(private mutations: SoundPool[]) { }
    play(volume: number) {
        const { mutations, accessIdx } = this
        mutations[accessIdx].play(volume)
        this.accessIdx = (accessIdx + 1) % mutations.length // round robin algorithm
    }
    pause() {
        this.mutations.forEach(mutation => {
            mutation.pause()
        })
    }
    resume() {
        this.mutations.forEach(mutation => {
            mutation.resume()
        })
    }
}

export default SoundGroup