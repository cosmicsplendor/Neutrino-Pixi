import Node from "./Node"

abstract class GameScreen extends Node {
    abstract onExit(): void
    abstract onEnter(...args: any[]): void
}

export default GameScreen