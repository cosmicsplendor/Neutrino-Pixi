import { isNull } from "./core"
import { Callback } from "./types"
type events = Record<string, Callback[]>
class Observable {
    private events: events = {}
    private oneOffs: Callback[] = []
    constructor(eventNames: string[]) {
        this.events = eventNames.reduce((events, event) => {
            events[event] = []
            return events
        }, this.events)
    }
    on(eventName: string, callback: Callback) {
        if (!this.events[eventName]) {
            throw new Error(`attempting to listen to an unknown event: "${eventName}"`)
        }
        this.events[eventName].push(callback)
    }
    once(eventName: string, callback: Callback) {
        // callback.once = true
        this.oneOffs.push(callback)
        this.on(eventName, callback)
    }
    off(eventName: string, callback?: Callback) {
        if (isNull(callback)) {
            this.events[eventName] = []
            return
        }
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
    }
    emit(eventName: string, ...params: any[]) {
        this.events[eventName].forEach(callback => {
            callback(...params)
            if (this.oneOffs.includes(callback)) {
                this.off(eventName, callback)
                this.oneOffs = this.oneOffs.filter(cb => cb !== callback)
            }
        })
    }
}

export default Observable