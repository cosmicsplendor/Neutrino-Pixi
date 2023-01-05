import type { Sound } from "./index"
import SoundClass, { Options } from "./index"

type ConstructorParam = Partial<Options> & {
    resource: AudioBuffer,
    start: number,
    duration: number,
    size?: number,
}
const findFree = (instances: Array<Sound>) => {
    for (let i = instances.length - 1; i > -1; i--) {
        if (!instances[i].playing) {
            return instances[i]
        }
    }
}
class SoundPool {
    private resource: AudioBuffer
    private start: number
    private duration: number
    private instances: Sound[]
    constructor(param: ConstructorParam) {
        const { resource, start, duration, size = 1, loop, volume, pan, speed } = param
        this.resource = resource
        this.start = start
        this.duration = duration
        this.instances = Array(size).fill(new SoundClass(resource, { loop, volume, pan, speed }))
    }
    play(volume: number) {
        const freeInstance = findFree(this.instances)
        if (freeInstance) {
            freeInstance.play(this.start, this.duration, volume)
            return
        }
        const newInstance = new SoundClass(this.resource)
        this.instances.push(newInstance)

        newInstance.play(this.start, this.duration, volume)
    }
    pause() {
        this.instances.forEach(instance => {
            instance.pause()
        })
    }
    resume() {
        this.instances.forEach(instance => {
            instance.resume()
        })
    }
}

export default SoundPool