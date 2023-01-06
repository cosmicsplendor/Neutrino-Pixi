import SoundPool from "./SoundPool"
import SoundGroup from "./SoundGroup"
import SoundClass, { Options } from "./index"

export type SpriteMeta = {
    [Key: string]: {
        start: number,
        duration: number
    }
}

class SoundSprite {
    meta: SpriteMeta
    resource: AudioBuffer
    constructor(param: { resource: AudioBuffer, resourceID: string, meta: SpriteMeta}) {
        const { resource, resourceID, meta } = param
        if (!resource) { throw new Error(`Null audio resource: ${resourceID}`) }
        this.meta = meta
        this.resource = resource
    }
    create(frame: string, opts?: Partial<Options>) {
        const { meta, resource } = this
        const newSound = new SoundClass(resource, opts)
        newSound.play = newSound.play.bind(newSound, meta[frame].start, meta[frame].duration)
        return newSound
    }
    createPool(frame: string, size?: number, opts?: Partial<Options>) {
        const newPool = new SoundPool({ 
            resource: this.resource, size,
            ...this.meta[frame], // destructuring to get start and duration props
            ...opts
        })
        return newPool
    }
    createGroup(frames: string[], poolSize = 1, opts?: Partial<Options>) {
        const mutations = frames.map(frame => this.createPool(frame, poolSize, opts))
        const newGroup = new SoundGroup(mutations)
        return newGroup
    }
}

export default SoundSprite