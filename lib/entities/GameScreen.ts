import Node from "./Node"

abstract class GameScreen extends Node {
    bgColor: string = "#f0a0d0" // only hex string supported
    abstract onExit(): void
    abstract onEnter(...args: any[]): void
}

export default GameScreen