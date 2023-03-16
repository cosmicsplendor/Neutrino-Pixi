import TexRegion from "@lib/entities/TexRegion"
import KeyControls from "@lib/Controls/KeyControls"

class Ball extends TexRegion {
    ctrls: KeyControls
    constructor() {
        super("ball")
        this.ctrls = new KeyControls({
            left: ["a", "arrowleft"],
            right: ["d", "arrowright"],
            up: ["w", "arrowtop"],
            down: ["s", "arrowdown"]
        })
    }
    update = dt => {
        if (this.ctrls.get("left")) {
            this.x -= 100 * dt
        } else if(this.ctrls.get("right")) {
            this.x += 100 * dt
        }
        
        if (this.ctrls.get("up")) {
            this.y -= 100 * dt
        } else if(this.ctrls.get("down")) {
            this.y += 100 * dt
        }

        this.ctrls.resetPressed()
    }
}

export default Ball