export type Options = {
    loop: boolean, volume: number, pan: number, speed: number
}

abstract class AbstractAudio {
    protected static _on = true
    playing: boolean = false
    static isOn = () => this._on
    static getPaused() {
        return this.isOn()
    }
    static off() { 
        this._on = false
    }
    static on() {
        this._on = true
    }
    static loadResource: (url: string) => Promise<void> = async () => { return Promise.resolve() }
    static destroy(soundObj: AbstractAudio) { 
        this.onDestroyed(soundObj)
    }
    static onDestroyed: (soundObj: AbstractAudio) => void
    static onCreated: (soundObj: AbstractAudio) => void
    abstract pause(): void
    abstract resume(): void
    abstract play(from: number, duration: number, volume: number): void
}

export default AbstractAudio