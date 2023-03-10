import startGameLoop from "./startGameLoop"
import AssetsCache from "../AssetsCache"
import GameScreen from "@lib/entities/GameScreen"
import SoundCtrls from "./SoundCtrls"
import { ReturnType } from "../types"

type Params = {
    assetsCache: AssetsCache,
    screenFactories: any[],
    activeScreen: any
}
class Game {
    activeScreen: GameScreen
    private _assetsCache: AssetsCache
    private soundCtrls = new SoundCtrls()
    private loopCtrls: ReturnType<typeof startGameLoop>
    paused = false
    constructor({ assetsCache, screenFactories, activeScreen }: Params) {
        this._assetsCache = assetsCache

        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
            this[screenName].name = screenName
        })

        if (activeScreen) { this.switchScreen(activeScreen) }
    }
    get assetsCache() { return this._assetsCache }
    switchScreen(screenName, ...params) {
        if (this.activeScreen) {
            this.activeScreen?.onExit()
        }
        this.activeScreen = this[screenName]
        // if (this.activeScreen.background) { this.renderer.changeBackground(this.activeScreen.background) }
        this.activeScreen?.onEnter(...params)
    }
    disposeScreen(screen) {
        this[screen.name] = null
    }
    _update(dt, t) {
       if (this.activeScreen.update) {
           this.activeScreen.update(dt, t)
       }
    }
    start() {
        this.loopCtrls = startGameLoop({
            mainUpdateFn: () => {},
            game: this
        })
    }
    turnOffSound() {
        this.soundCtrls.off()
    }
    turnOnSound() {
        this.soundCtrls.off()
    }
    pause() {
        if (this.paused) { return }
        this.paused = true
        this.loopCtrls?.pause()
        this.soundCtrls.pause()
        return 
    }
    resume() {
        if (!this.paused) { return }
        this.paused = false
        this.loopCtrls.resume()
        this.soundCtrls.resume()
    }
    reset() {
        this.paused = false
        this.loopCtrls.resume()
        this.soundCtrls.reset()
    }
}

export default Game