import AbstractAudio from "./AbstractAudio"
class NullAudio extends AbstractAudio {
    pause() { }
    resume() { }
    play() { }
}
export default NullAudio