import Camera from "@lib/entities/Camera"
import Node from "@lib/entities/Node"
import Game from "."
type Params = {
    mainUpdateFn: (dt: number, t: number) => void,
    game: Game,
    step?: number
}
export const updateRecursively = (node: Node, dt: number, t: number, rootNode: Node=node) => {
    node.descendants.forEach(desc => {
        node.visible = rootNode instanceof Camera ? rootNode.intersects(node): true
        if (typeof desc.update === "function") {
            desc.update(dt, t)
        }
        const isCamera = desc instanceof Camera
        const cachedChildren = node.descendants
        for (let i = 0, len = cachedChildren.length; i < len; i++) {
            updateRecursively(cachedChildren[i], dt, t, isCamera ? desc: rootNode)
        }
    })
}

const startGameLoop = ({ mainUpdateFn= () => {}, game, step = 100 }: Params) => {
    const STEP = step // max frame duration
    const UPDATE_FPS = 60
    const UPDATE_INTERVAL= 1000 / UPDATE_FPS
    const UPDATE_INTERVAL_SECS = UPDATE_INTERVAL / 1000
    let lastUpdated = 0
    let speed = 1
    let paused = false

    function loop(ts) {
        let dt = speed * Math.min(ts - lastUpdated, STEP)
        const tsInSecs = ts / 1000
        
        if (paused) return requestAnimationFrame(loop)

        while (dt >= UPDATE_INTERVAL) {
            updateRecursively(game.activeScreen, UPDATE_INTERVAL_SECS, tsInSecs, game.activeScreen)
            mainUpdateFn(UPDATE_INTERVAL_SECS, tsInSecs)
            dt -= UPDATE_INTERVAL
        }

        lastUpdated = ts - dt
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return {
        pause() {
            paused = true
        },
        resume() {
            paused = false
        },
        setSpeed(val) { speed = val },
        get meta() {
            return {
                elapsed: lastUpdated / 1000
            }
        }
    }
}

export default startGameLoop