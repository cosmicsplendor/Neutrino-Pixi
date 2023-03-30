import Camera from "@lib/entities/Camera"
import GameScreen from "@lib/entities/GameScreen"
import TexRegion from "@lib/entities/TexRegion"
import Game from "@lib/Game"
import Ball from "./Ball"
import TiledLevel, { LevelData } from "@lib/entities/TiledLevel"
import levelDataUri from "@assets/levels/level1.cson"

class LevelScreen extends GameScreen {
    backgroundColor = "#000000"
    constructor(private game: Game) {
        super()
    }
    onEnter() {
        const ball = new Ball()

        const camera = new Camera({
            subject: ball,
            viewport: this.game.viewport,
            world: { width: 10e4, height: 10e4 },
        })
        for (let i = 0; i < 100; i++) {
            const crane = new TexRegion("crane")
            crane.x = (i % 20) * 120
            crane.y = Math.floor(i / 20) * 120
            camera.add(crane)
        }
        camera.add(ball)
        camera.add(ball)
        this.add(camera)

        // const levelData = this.game.assetsCache.get(levelDataUri) as LevelData
        // const level = new TiledLevel({ player: ball, data: levelData, factories: { player: (x, y, props, player, level) => {
        //     player.x = x
        //     player.y = y
        //     level.add(player)
        //     level.setSubject(player)
        //     return player
        // }}, viewport: this.game.viewport })
        // this.add(level)
    }
    onExit() {

    }
}

export default LevelScreen