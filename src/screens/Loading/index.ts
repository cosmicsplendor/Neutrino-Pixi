import GameScreen from "@lib/entities/GameScreen"
import Game from "@lib/Game"
import TexAtlasLocator from '@lib/service locators/TexAtlas'
import { TexAtlas } from '@lib/entities/TexRegion'
import { BaseTexture } from "pixi.js"

import { LEVEL } from "../names"
import atlasData from "@assets/texAtlas/data"
import atlasImg from "@assets/texAtlas/image.png"

type Param = { game: Game }
const assets = [
    atlasImg
]
class LoadingScreen extends GameScreen {
    game: Game
    constructor({ game }: Param) {
        super()
        this.game = game
    }
    onEnter() {
        const { assetsCache } = this.game
        assetsCache.load(assets)
        assetsCache.once("load", () => {
            TexAtlasLocator.register(new TexAtlas(assetsCache.get(atlasImg) as BaseTexture, atlasData))
            this.game.switchScreen(LEVEL)
        })
    }
    onExit() { }
}

export default LoadingScreen