import { offlineErrMsg } from "@lib/constants"
import { isNull } from "@utils/core"
import AbstractAudio from "./AbstractAudio"
import type { Options } from "./AbstractAudio"

type decodeAudioData = (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>

const ctx = isNull(AudioContext) ? null : new AudioContext()
const startAudio = (node: AudioBufferSourceNode, startTime: number, from: number, duration: number) => {
    if (node.loop) {
        node.loopStart = from
        node.loopEnd = from + duration
        return node.start(startTime, from)
    }
    node.start(startTime, from, duration)
}

const decodeAudioData: decodeAudioData = arrayBuffer => {
    if (isNull(ctx)) return
    return new Promise((resolve, reject) => {
        ctx.decodeAudioData(arrayBuffer, resolve, reject)
    })
}

class WebAudio extends AbstractAudio {
    static loadResource = (src: string): Promise<AudioBuffer> => {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then(res => res.arrayBuffer())
                .then(arrayBuffer => decodeAudioData(arrayBuffer))
                .then(audioBuffer => resolve(audioBuffer))
                .catch(() => reject({ message: offlineErrMsg }))
        })
    }
    static destroy(soundObj: WebAudio) {
        WebAudio.emitDestroy(soundObj)
    }
    private buffer: AudioBuffer
    private volumeNode: GainNode
    private panNode: StereoPannerNode
    private _speed: number
    private _loop: boolean
    private playedFrom: number
    private offset: number
    private playTill: number
    private lastPlayedAt: number
    private onEnded: () => void
    private sourceNode: AudioBufferSourceNode
    constructor(buffer: AudioBuffer, opts: Partial<Options> = {}) {
        const { loop = false, volume = 1, pan = 0, speed = 1 } = opts
        super()
        // initializing core props
        this.buffer = buffer
        this.panNode = ctx.createStereoPanner()
        this.volumeNode = ctx.createGain()

        // initializing settings
        this.panNode.pan.value = pan
        this.volumeNode.gain.value = volume
        this._speed = speed
        this._loop = loop // loop, once set, cannot be changed

        // initializing state variables
        this.playedFrom = 0 // starting point of the current play session
        this.offset = 0 // marker between starting and end points indicating playing progress
        this.playTill = buffer.duration // end point of the current play session
        this.lastPlayedAt = 0 // last time the play method was invoked
        this.playing = false // the sound starts off paused

        WebAudio.emitCreate(this)
        this.onEnded = () => this.playing = false
    }
    pause() {
        if (!this.playing) { return }
        const timeSinceLastPlayed = ctx.currentTime - this.lastPlayedAt
        const newOffset = this.offset + timeSinceLastPlayed
        const duration = this.playTill - this.playedFrom
        this.offset = this._loop ? newOffset % duration : Math.min(newOffset, duration)
        this._stop()
    }
    resume() {
        if (this.playing || !WebAudio.isOn()) { return }
        const { playedFrom, offset, playTill } = this
        const resFrom = playedFrom + offset
        const duration = playTill - resFrom
        this._play(resFrom, duration)
    }
    play(from = 0, _duration: number, volume: number) {
        if (this.playing || !WebAudio.isOn()) { return }
        if (volume) { this.volume = volume }
        const duration = _duration || this.buffer.duration
        this.playedFrom = from // starting point
        this.offset = 0 // marker between starting point and endpoint reset to zero
        this.playTill = from + duration // end point
        this.lastPlayedAt = ctx.currentTime
        this._play(from, duration)
    }
    set speed(val: number) {
        this._speed = val
        this.sourceNode && this.sourceNode.playbackRate.setValueAtTime(val, 0)
    }
    get speed() {
        return this._speed
    }
    set volume(val: number) {
        this.volumeNode.gain.setValueAtTime(val, 0)
    }
    set pan(val) {
        this.panNode.pan.setValueAtTime(val, 0)
    }
    get pan() {
        return this.panNode.pan.value
    }
    private _stop() {
        const { sourceNode } = this
        sourceNode && sourceNode.stop(0)
    }
    private _play(from: number, duration: number) {
        const { buffer, panNode, volumeNode, _loop, _speed } = this
        const sourceNode = ctx.createBufferSource()
        this.sourceNode = sourceNode
        this.lastPlayedAt = ctx.currentTime

        sourceNode.buffer = buffer
        sourceNode.loop = _loop
        sourceNode.playbackRate.value = _speed

        sourceNode.connect(panNode)
        panNode.connect(volumeNode)
        volumeNode.connect(ctx.destination)

        startAudio(sourceNode, ctx.currentTime, from, duration)

        sourceNode.onended = this.onEnded
        this.playing = true
    }
}

export default WebAudio