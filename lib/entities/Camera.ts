import Node from "./Node"
import { DisplayObject } from "pixi.js"
import Viewport from "@lib/utils/Viewport"
import { aabb, clamp } from "@lib/utils/math"
import { rectBounds } from "@lib/utils/entity"

type Dims = { width: number, height: number }
type Bounds = { x: number, y: number } & Dims
type Params = { subject: DisplayObject, world: Dims, viewport: Viewport, z: number }
class Camera extends Node {
    private subject: DisplayObject
    private world: Dims
    private viewport: Viewport
    private z: number
    private bounds: Bounds 
    constructor({ subject, world, viewport, z }: Params) {
        super()
        this.subject = subject
        this.world = world
        this.viewport = viewport
        this.bounds = { x: 0, y: 0, width: viewport.width, height: viewport.height }
        this.z = z

        viewport.on("change", ({ width, height }) => {
            this.bounds.width = width
            this.bounds.height = height
        })
    }
    focus() {
        const { subject, bounds, world } = this
        const { x, y } = subject
        this.x = -clamp(0, world.width - bounds.width, x - bounds.width * .5)
        this.y = -clamp(0, world.height - bounds.height, y - bounds.height * 0.5)
    }
    intersects(node: Node) {
        const dimensionless = typeof node.width !== "number" && typeof node.height !== "number"
        if (node === this || dimensionless) {
            // if the node is either the root or just a container (meaning it doesn't have explicit bounds) return true
            return true
        }
        const intersects = aabb(rectBounds(node), this.bounds)
        return intersects
    }
    update = () => {
        this.focus()
    }
}

export default Camera