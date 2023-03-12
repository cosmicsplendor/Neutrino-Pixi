import GameScreen from "@lib/entities/GameScreen"
import Crane from "./Crane"

class LevelScreen extends GameScreen {
    onEnter() {
        const crane = new Crane()
        this.add(crane)
    }
    onExit() {

    }
}

export default LevelScreen