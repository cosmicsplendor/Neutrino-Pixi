import { isNull } from "./core"

type callback = (...params: any[]) => void
type events = Record<string, callback[]>
class Observable {
    private events: events = {}
    private oneOffs: callback[] = []
    constructor(eventNames: string[]) {
        this.events = eventNames.reduce((events, event) => {
            events[event] = []
            return events
        }, this.events)
    }
    on(eventName: string, callback: callback) {
        if (!this.events[eventName]) {
            throw new Error(`attempting to listen to an unknown event: "${eventName}"`)
        }
        this.events[eventName].push(callback)
    }
    once(eventName: string, callback: callback) {
        // callback.once = true
        this.oneOffs.push(callback)
        this.on(eventName, callback)
    }
    off(eventName: string, callback?: callback) {
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