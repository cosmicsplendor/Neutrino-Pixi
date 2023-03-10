import Node from "./Node"

class GameScreen extends Node {
    onExit?: () => void
    onEnter?: (...args: any[]) => void
}

export default GameScreen