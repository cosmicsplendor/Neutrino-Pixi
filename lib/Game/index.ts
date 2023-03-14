import startGameLoop from "./startGameLoop"
import AssetsCache from "@lib/utils/AssetsCache"
import GameScreen from "@lib/entities/GameScreen"
import SoundCtrls from "./SoundCtrls"
import { ReturnType } from "@lib/utils/types"
import Viewport from "@lib/utils/Viewport"
import { Application } from "pixi.js"

type UpdateFn = (dt: number, t: number) => void
type Params = {
    screenFactories: Record<string, (game: Game) => GameScreen>,
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
    constructor({ screenFactories, activeScreen, viewport, update = () => {}, pixiApp }: Params) {
        this.assetsCache = new AssetsCache()
        this.viewport = viewport
        this.update = update
        this.app = pixiApp
        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
            this[screenName].name = screenName
        })
        const resizeRenderer = () => {
            this.app.renderer.resize(viewport.width, viewport.height)
        }
        viewport.on("change", resizeRenderer)
        resizeRenderer()
        if (typeof activeScreen === "string") { this.switchScreen(activeScreen) }
    }
    switchScreen(screenName, ...params) {
        this.activeScreen?.onExit()
        this.activeScreen = this[screenName]
        this.activeScreen.onEnter(...params)
        this.app.stage = this.activeScreen
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