import Observable from "./Observable"

class Viewport extends Observable {
    private _width: number
    private _height: number
    constructor(computeViewport: (width: number, height: number) => { width: number, height: number }) {
        super(["change"])
        const resize = () => {
            const dims = computeViewport(window.innerWidth, window.innerHeight)
            this.width = dims.width
            this.height = dims.height
        }
        const sync = () => {
            resize()
            this.emit("change", this)
        }
        window.addEventListener("resize", sync)
        resize()
    }
    get width() {
        return this._width
    }
    private set width(val: number) {
        this._width = val
    }
    get height() {
        return this._height
    }
    private set height(val: number) {
        this._height = val
    }
}

export default Viewport