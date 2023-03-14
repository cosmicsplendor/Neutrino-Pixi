import TexRegion from "@lib/entities/TexRegion"
import { Sprite } from "pixi.js"

class Crane extends TexRegion {
    constructor() {
        super("crane")
        console.log(this.width)
    }
    update = dt => {
        this.x += 20 * dt
        this.y += 20 * dt
    }
}

export default Crane