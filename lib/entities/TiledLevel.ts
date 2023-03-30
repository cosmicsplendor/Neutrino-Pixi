import Node from "./Node"
import TexRegion from "@lib/entities/TexRegion"
import Camera from "./Camera"
import { Callback } from "@lib/utils/types"
import { isNull } from "@lib/utils/core"
import Viewport from "@lib/utils/Viewport"

import { RectBounds, Coords } from "@lib/utils/math"
type ResettableNode = Node & { reset?: () => void }
export type LevelData = {
    width: number,
    height: number,
    collisionRects: Array<RectBounds>,
    checkpoints: Coords[],
    layers: Array<{
        name: string,
        zIndex: number,
        offsetX: number, offsetY: number,
        pFx: number, pFy: number,
        tiles: Array<Coords & {name: string} & Record<string, number | string>>
    }>,
}
type Params = {
    player: any,
    data: LevelData,
    factories: any,
    viewport: Viewport
}
class TiledLevel extends  Node {
    descendants: Camera[]
    postSetupTasks: Callback[] = []
    resetRecursively(node: ResettableNode = this) {
        if (typeof node.reset === "function") node.reset()
        if (isNull(node.descendants)) return
        for (let child of node.descendants) {
            this.resetRecursively(child)
        }
    }
    setSubject(entity: Node) {
        this.descendants.forEach(child => {
            child instanceof Camera && child.setSubject(entity)
        })
        return this
    }
    focusInst() {
        this.children.forEach(child => {
            if (child instanceof Camera) {
                child.focusInst()
            }
        })
    }
    registerPostSetupTask(fn) {
        this.postSetupTasks.push(fn)
    }
    constructor({ player, data, factories={}, viewport }: Params) {
        super()
        const world = { width: data.width, height: data.height }
        data.layers.slice(0).forEach(layer => {
            const { pFx=1, pFy=1, zIndex, name } = layer
            const camera = new Camera({ viewport, world, pFx, pFy })
            camera.name = name
            console.log(layer.tiles.length)
            layer.tiles.forEach(tile => {
                const { name, x, y, ...props } = tile
                const factory = factories[name]
                const entity = !!factory ?
                               factory(x, y, props, player, this):
                               new TexRegion(name)
                Object.assign(entity.position, { x, y })
                camera.add(entity)
            })
            this.add(camera)
        })
        this.setSubject(player)
        // adding collision rects to a separate layer
        // const collisionLayer = new Camera({ viewport: config.viewport, pFx: 1, pFy: 1, offsetX: 0, offsetY: 0, zIndex: 0, name: "collision", id: colRectsId }) // collision rects are invisible, so wherever in the scene graph they go doesn't matter
        // data.collisionRects.forEach(({ x, y, width, height, ...props }) => {
        //     const colRect = new Node({ pos: { x, y } })
        //     colRect.width = width
        //     colRect.height = height
        //     Object.assign(colRect, props)
        //     collisionLayer.add(colRect)
        // })
        // this.add(collisionLayer)

        while (this.postSetupTasks.length > 0) {
            const execTask = this.postSetupTasks.pop()
            execTask()
        }
    }
}

export default TiledLevel