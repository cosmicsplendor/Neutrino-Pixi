import WebAudio from "./APIs/WebAudio"
import NullAudio from "./APIs/NullAudio"
import { isNull } from "@utils/core"
export type { Options } from "./APIs/AbstractAudio"

export const webAudioSupported = !isNull(AudioContext)
export type Sound = WebAudio | NullAudio    
const SoundClass = webAudioSupported ? WebAudio: NullAudio

export default SoundClass