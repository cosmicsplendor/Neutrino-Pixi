import { Optional } from "@lib/utils/types"

type AlphaKeys = "q" | "w" | "e" | "r" | "a" | "s" | "d" | "f" | "z" | "x" | "c" | "v"
type MetaKeys = "control" | "shift" | "alt" | "escape" | "space" | "enter" | "tab"
type ArrowKeys = "arrowleft" | "arrowtop" | "arrowright" | "arrowdown"

type Key = AlphaKeys | MetaKeys | ArrowKeys
type KeyState = { held: Boolean, pressed: Boolean }
type KeyStateHash = Optional<Record<Key, KeyState>>
type KeyStateAttrib = keyof KeyState
type Mappings = Record<string, Key | Key[]>

const parseKey = (key: string) => {
    return key.toLowerCase()
}
class KeyControls {
    private mappings: Mappings
    private keyStates: KeyStateHash = {}
    private keys: Key[] = []
    constructor(mappings: Mappings) {
        const recordKey = k => {
            this.keyStates[k] = { held: false, pressed: false}
            this.keys.push(k)
        }

        this.mappings = mappings
        Object.values(mappings)
            .forEach((keyOrKeys) => {
                if (Array.isArray(keyOrKeys)) {
                    keyOrKeys.forEach(recordKey)
                    return
                }
                recordKey(keyOrKeys)
            })
        
        document.addEventListener("keydown", e => {
            const key = parseKey(e.key)

            if (key in this.keyStates) {
                this.keyStates[key].pressed = true
                this.keyStates[key].held = true
            }
        })
        document.addEventListener("keyup", e => {
            const key = parseKey(e.key)

            if (key in this.keyStates) {
                this.keyStates[key].pressed = false
                this.keyStates[key].held = false
            }
        })
    }
    get(alias: string, attrib: KeyStateAttrib = "held") {
        const keyOrKeys = this.mappings[alias]
        if (Array.isArray(keyOrKeys)) {
            return keyOrKeys.some(key => this.keyStates[key][attrib])
        }
        return this.keyStates[keyOrKeys][attrib]
    }
    resetPressed() {
        this.keys.forEach(key => {
            this.keyStates[key].pressed = false
        })
    }
}

export default KeyControls