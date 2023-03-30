import Node from "./Node"
import Viewport from "@lib/utils/Viewport"
import { aabb, clamp } from "@lib/utils/math"
import { calcCenter, rectBounds } from "@lib/utils/entity"
import { isNull, isObject } from "@lib/utils/core"

type Dims = { width: number, height: number }
type Coords = { x: number, y: number }
type Bounds = Coords & Dims
type Params = { subject?: Node, world: Dims, viewport: Viewport, pFx?: number, pFy?: number }
class Camera extends Node {
    name?: string
    private subject?: Node
    private world: Dims
    private viewport: Viewport
    private pFx: number // pF for parallax factor
    private pFy: number
    private bounds: Bounds 
    private offset: Coords = { x: 0, y: 0 }
    constructor({ subject, world, viewport, pFx=1, pFy=1 }: Params) {
        super()
        this.world = world
        this.viewport = viewport
        this.bounds = { x: 0, y: 0, width: viewport.width -200, height: viewport.height }
        this.pFx = pFx
        this.pFy = pFy
        this.setSubject(subject)

        this.viewport.on("change", ({ width, height }) => {
            this.bounds.width = width
            this.bounds.height = height
        })
    }
    setSubject(subject: Node, offset?: Coords) {
        if (isNull(subject)) return
        this.subject = subject
        this.offset = isObject(offset) ? offset: calcCenter(subject)
        this.focus()
    }
    focus() {
        const { subject, bounds, world, offset, pFx, pFy } = this
        const { x, y } = subject
        this.x = Math.round(-pFx * clamp(0, world.width - bounds.width, x + offset.x - bounds.width * .5))
        this.y = Math.round(-pFy * clamp(0, world.height - bounds.height, y - offset.y - bounds.height * 0.5))
    }
    focusInst() { }
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