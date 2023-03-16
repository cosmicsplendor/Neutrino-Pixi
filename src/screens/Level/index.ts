import Camera from "@lib/entities/Camera"
import GameScreen from "@lib/entities/GameScreen"
import TexRegion from "@lib/entities/TexRegion"
import Game from "@lib/Game"
import { rand } from "@lib/utils/math"
import Ball from "./Ball"

class LevelScreen extends GameScreen {
    constructor(private game: Game) {
        super()
    }
    onEnter() {
        const ball = new Ball()
        const camera = new Camera({
            subject: ball,
            viewport: this.game.viewport,
            world: { width: 10e4, height: 10e4 },
            z: 1
        })
        for (let i = 0; i < 100; i++) {
            const crane = new TexRegion("crane")
            crane.x = (i % 20) * 120
            crane.y = Math.floor(i / 20) * 120
            camera.add(crane)
        }
        camera.add(ball)
        this.add(camera)
    }
    onExit() {

    }
}

export default LevelScreen