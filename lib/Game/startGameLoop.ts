import Game from "."
type Params = {
    mainUpdateFn: (dt: number, t: number) => void,
    game: Game,
    step?: number
}
const updateRecursively = (node, dt: number, t: number, rootNode=node) => {
    node.descendants.forEach(desc => {
        node.visible = typeof rootNode.intersects === "function" ? rootNode.intersects(node): true
        if (typeof desc.update === "function") {
            desc.update(dt, t)
        }
        const cachedChildren = node.descendants
        for (let i = 0, len = cachedChildren.length; i < len; i++) {
            updateRecursively(cachedChildren[i], dt, t, rootNode)
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
        // const dt = speed * Math.min(ts - lastUpdated, STEP) / 1000
        let dt = speed * Math.min(ts - lastUpdated, STEP)
        const tsInSecs = ts / 1000
        
        if (paused) return requestAnimationFrame(loop)

        // if root scene has update method that's where recursive update should go (it is useful when we have multiple cameras, one for each parallax layer)
        while (dt >= UPDATE_INTERVAL) {
            game.activeScreen.update ? game.activeScreen.update(UPDATE_INTERVAL_SECS, tsInSecs) : updateRecursively(game.activeScreen, UPDATE_INTERVAL_SECS, tsInSecs, game.activeScreen)
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