import GameScreen from "@lib/entities/GameScreen"
import Game from "@lib/Game"
import TexAtlasLocator from '@lib/service locators/TexAtlas'
import { TexAtlas } from '@lib/entities/TexRegion'
import { BaseTexture } from "pixi.js"
import { AtlasData } from "@lib/entities/TexRegion"

import { LEVEL } from "../names"
import atlasDataUri from "@assets/texAtlas/data.cson"
import atlasImgUri from "@assets/texAtlas/image.png"

type Param = { game: Game }
const assets = [
    atlasImgUri,
    atlasDataUri
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
            const atlasBaseTex = assetsCache.get(atlasImgUri) as BaseTexture
            const atlasData = assetsCache.get(atlasDataUri) as AtlasData
            const texAtlas = new TexAtlas(atlasBaseTex, atlasData)
            TexAtlasLocator.register(texAtlas)
            this.game.switchScreen(LEVEL)
        })
    }
    onExit() { }
}

export default LoadingScreen