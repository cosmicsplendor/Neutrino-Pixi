import { Application } from 'pixi.js'
import Viewport from '@lib/utils/Viewport'
import Game from '@lib/Game'
import * as screens from "./screens/names"
import LoadingScreen from './screens/Loading'
import LevelScreen from './screens/Level'

const app = new Application({
    view: document.getElementById("arena") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
})
const viewport = new Viewport((width, height) => {
    return { width, height }
})
const game = new Game({
    pixiApp: app,
    viewport,
    screenFactories: {
        [screens.LOADING]: game => {
            return new LoadingScreen({ game })
        },
        [screens.LEVEL]: game => {
            return new LevelScreen(game)
        }
    }
})
game.switchScreen(screens.LOADING)
game.start()