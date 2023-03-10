import Observable from "@lib/utils/Observable"

export type Options = {
    loop: boolean, volume: number, pan: number, speed: number
}

abstract class AbstractAudio {
    protected static _on = true
    playing: boolean = false
    static getPaused() {
        return this.isOn()
    }
    static isOn = () => this._on
    static off() { 
        this._on = false
    }
    static on() {
        this._on = true
    }
    static loadResource: (url: string) => Promise<any> = async () => { return Promise.resolve() }
    private static lifecycleObservable = new Observable([ "create", "destroy" ])
    static emitDestroy(soundObj: AbstractAudio) { 
        this.lifecycleObservable.emit("destroy", soundObj)
    }
    static emitCreate(soundObj: AbstractAudio) { 
        this.lifecycleObservable.emit("create", soundObj)
    }
    static onDestroy(handler: (soundObj: AbstractAudio) => void) {
        this.lifecycleObservable.on("destroy", handler)
    }
    static onCreate(handler: (soundObj: AbstractAudio) => void) {
        this.lifecycleObservable.on("create", handler)
    }
    abstract pause(): void
    abstract resume(): void
    abstract play(from: number, duration: number, volume: number): void
}

export default AbstractAudio