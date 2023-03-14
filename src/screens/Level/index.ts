import GameScreen from "@lib/entities/GameScreen"
import Game from "@lib/Game"
import { rand } from "@lib/utils/math"
import Crane from "./Crane"

class LevelScreen extends GameScreen {
    constructor(private game: Game) {
        super()
    }
    onEnter() {
        for (let i = 0; i < 100; i++) {
            const crane = new Crane()
            crane.x = rand(this.game.viewport.width)
            crane.y = rand(this.game.viewport.height)
            this.add(crane)
        }
    }
    onExit() {

    }
}

export default LevelScreen