import startGameLoop from "./startGameLoop"
import AssetsCache from "../AssetsCache"
import GameScreen from "@lib/entities/GameScreen"
import SoundCtrls from "./SoundCtrls"
import { ReturnType } from "../types"
import Viewport from "../Viewport"
import { Application } from "pixi.js"

type UpdateFn = (dt: number, t: number) => void
type Params = {
    assetsCache: AssetsCache,
    screenFactories: any[],
    activeScreen?: string,
    viewport: Viewport,
    update?: UpdateFn,
    pixiApp: Application
}
class Game {
    activeScreen: GameScreen
    private update: UpdateFn
    private _assetsCache: AssetsCache
    private _viewport: Viewport
    private soundCtrls = new SoundCtrls()
    private loopCtrls: ReturnType<typeof startGameLoop>
    private app: Application
    get assetsCache() { return this._assetsCache }
    get viewport() { return this._viewport }
    private set assetsCache(assetsCache: AssetsCache) { this._assetsCache = assetsCache }
    private set viewport(viewport: Viewport) { this._viewport = viewport }
    paused = false
    constructor({ assetsCache, screenFactories, activeScreen, viewport, update = () => {}, pixiApp }: Params) {
        this.assetsCache = assetsCache
        this.viewport = viewport
        this.update = update
        this.app = pixiApp
        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
            this[screenName].name = screenName
        })
        viewport.on("change", () => {
            this.app.renderer.resize(viewport.width, viewport.height)
        })
        if (typeof activeScreen === "string") { this.switchScreen(activeScreen) }
    }
    switchScreen(screenName, ...params) {
        this.activeScreen?.onExit()
        this.activeScreen = this[screenName]
        // if (this.activeScreen.background) { this.renderer.changeBackground(this.activeScreen.background) }
        this.activeScreen?.onEnter(...params)
    }
    disposeScreen(screen) {
        this[screen.name] = null
    }
    start() {
        this.loopCtrls = startGameLoop({
            mainUpdateFn: this.update,
            game: this
        })
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
    turnOffSound() {
        this.soundCtrls.off()
    }
    turnOnSound() {
        this.soundCtrls.off()
    }
}

export default Game