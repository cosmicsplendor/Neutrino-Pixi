import TexRegion from "@lib/entities/TexRegion"

class Crane extends TexRegion {
    constructor() {
        super("crane")
    }
    update = dt => {
        this.x += 20 * dt
        this.y += 20 * dt
    }
}

export default Crane