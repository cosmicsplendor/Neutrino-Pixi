import Observable from "./Observable"

class Viewport extends Observable {
    private _width: number
    private _height: number
    constructor(computeViewport: (width: number, height: number ) => { width: number, height: number }) {
        super(["change"])
        const resize = () => {
            const dims = computeViewport(window.innerWidth, window.innerHeight)
            this._width = dims.width
            this._height = dims.height
        }
        const onResize = () => {
            resize()
            this.emit("change", this)
        }
        resize()
        window.addEventListener("resize", onResize)
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
}

export default Viewport