import Node from "@lib/entities/Node"
export { default as detectShape, shapes } from "./detectShape" 

import { RectBounds, CircBounds } from "../math"
type Entity = Node & { hitbox?: RectBounds, hitCirc?: CircBounds}

export const  getReusableBounds = (() => {
    const bounds = [0, 0].map(() => ({ x: 0, y: 0, width: 0, height: 0 }))
    let lastAccessedIdx = 0
    return (x: number, y: number, width: number, height: number) => {
        lastAccessedIdx = lastAccessedIdx === 0 ? 1: 0
        bounds[lastAccessedIdx].x = x
        bounds[lastAccessedIdx].y = y
        bounds[lastAccessedIdx].width = width
        bounds[lastAccessedIdx].height = height
        return bounds[lastAccessedIdx]
    }
})()

export const  getReusableCoords = (() => {
    const coords = { x: 0, y: 0 }
    return (x: number, y: number) => {
        coords.x = x
        coords.y = y
        return coords
    }
})()

export const getReusableCirc =(() => {
    const bounds = [0, 0].map(() => ({ x: 0, y: 0, radius: 0 }))
    let lastAccessedIdx = 0
    return (x: number, y: number, radius: number) => {
        lastAccessedIdx = lastAccessedIdx === 0 ? 1: 0
        bounds[lastAccessedIdx].x = x
        bounds[lastAccessedIdx].y = y
        bounds[lastAccessedIdx].radius = radius
        return bounds[lastAccessedIdx]
    }
})()

export function  calcCenter(entity) {
    const { hitbox, hitcirc } = entity

    if (entity.hitbox) {
        return { x: hitbox.x + hitbox.width / 2, y: hitbox.y + hitbox.height / 2 }
    }

    if (entity.hitcirc) {
        return { x: hitcirc.x, y: hitcirc.y }
    }

    return { x: entity.width / 2, y: entity.height / 2 }
}

type AlignDir = "il" | "ol" | "ir" | "or" | "hc" | "it" | "ot" | "ib" | "ob" | "vc"
const sc: Record<AlignDir, (c: RectBounds, e?: RectBounds) => number> = { // stack calcs
    // c -> container bounds; e -> entity bounds
    il: c => { // inside-left
        return c.x
    },
    ol: (c, e) => { // outside-left
        return c.x - e.width
    },
    ir: (c, e) => { // inside-right
        return c.x + (c.width - e.width)
    },
    or: c => { // outiside-right
        return c.x + c.width
    },
    hc: (c, e) => { // horizontal center
        return c.x + (c.width - e.width) / 2
    },
    it: c => { // inside-top
        return c.y
    },
    ot: (c, e) => { // outside-top
        return c.y - e.height
    },
    ib: (c, e )=> { // inside-bottom
        return c.y + (c.height - e.height)
    },
    ob: c => { // outiside-bottom
        return c.y + c.height
    },
    vc: (c, e) => { // vertical center
        return c.y + (c.height - e.height) / 2
    }
}

export function calcAligned(c: RectBounds, e: RectBounds, x: "left" | "center" | "right", y: "top" | "center" | "bottom", mX=0, mY=0) {
    const pos = getReusableCoords(mX, mY)
    switch (x) {
        case "left":
            pos.x += sc.il(c)
        break
        case "center":
            pos.x += sc.hc(c, e)
        break
        case "right":
            pos.x += sc.ir(c, e)
        break
        default:
            throw new Error(`Invalid x-alignment parameter: ${x}`)
    }
    switch(y) {
        case "top":
            pos.y += sc.it(c)
        break
        case "center":
            pos.y += sc.vc(c, e)
        break
        case "bottom":
            pos.y += sc.ib(c, e)
        break
        default:
            throw new Error(`Invalid y-alignment parameter: ${y}`)
    }
    return pos
}

export function calcCentered(c: RectBounds, e: RectBounds) {
    return {
        x: sc.hc(c, e),
        y: sc.vc(c, e)
    }
}

export type StackDir = "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end"
export function calcStacked(e1: RectBounds, e2: RectBounds, dir: StackDir, mX=0, mY=0) {
    const pos = getReusableCoords(mX, mY)
    switch(dir) {
        case "top-start":
            pos.x += sc.il(e1)
            pos.y += sc.ot(e1, e2)
        break
        case "top":
            pos.x += sc.hc(e1, e2)
            pos.y += sc.ot(e1, e2)
        break
        case "top-end":
            pos.x += sc.ir(e1, e2)
            pos.y += sc.ot(e1, e2)
        break
        case "right-start":
            pos.x += sc.or(e1)
            pos.y += sc.it(e1)
        break
        case "right":
            pos.x += sc.or(e1)
            pos.y += sc.vc(e1, e2)
        break
        case "right-end":
            pos.x += sc.or(e1)
            pos.y += sc.ib(e1, e2)
        break
        case "bottom-start":
            pos.x += sc.il(e1)
            pos.y += sc.ob(e1)
        break
        case "bottom":
            pos.x += sc.hc(e1, e2)
            pos.y += sc.ob(e1)
        break
        case "bottom-end":
            pos.x += sc.ir(e1, e2)
            pos.y += sc.ob(e1)
        break
        case "left-start":
            pos.x += sc.ol(e1, e2)
            pos.y += sc.it(e1)
        break
        case "left":
            pos.x += sc.ol(e1, e2)
            pos.y += sc.vc(e1, e2)
        break
        case "left-end":
            pos.x += sc.ol(e1, e2)
            pos.y += sc.ib(e1, e2)
        break
        default:
            throw new Error(`Invalid stacking direction: ${dir}`)
    }
    return pos
}

export const calcComposite = (entities: RectBounds[]) => {
    const { x, y, width, height } = entities[0]
    const bounds = getReusableBounds(x, y, width, height )
    for (let i = 1; i < entities.length; i++) {
        const ent = entities[i]
        const rEdgX = Math.max(bounds.x + bounds.width, ent.x + ent.width)
        const bEdgY = Math.max(bounds.y + bounds.height, ent.y + ent.height)

        bounds.x = Math.min(bounds.x, ent.x)
        bounds.y = Math.min(bounds.y, ent.y)
        bounds.width = rEdgX - bounds.x
        bounds.height = bEdgY - bounds.y
    }
    return bounds
}

export const combine = (a: RectBounds, b: RectBounds, dir: "x" | "y") => {
    switch (dir) {
        case "x":
            return {
                width: a.width + b.width,
                height: Math.max(a.height, b.height)
            }
        case "y":
            return {
                width: Math.max(a.width, b.width),
                height: a.height + b.height
            }
        default:
            throw new Error(`Invalid combine direction: ${dir}`)
    }
}

export function rectBounds(ent: Entity) {
    const globalPos = getGlobalPos(ent)
    if (ent.hitbox) {
        return getReusableBounds(globalPos.x + ent.hitbox.x, globalPos.y + ent.hitbox.y, ent.hitbox.width, ent.hitbox.height)
    }
    return getReusableBounds(globalPos.x, globalPos.y, ent.width, ent.height)
}

export function getHitbox(ent: Entity) {
    if (ent.hitbox) {
        return ent.hitbox
    }
    return getReusableBounds(0, 0, ent.width, ent.height)
}

export function circBounds(ent: Entity) {
    const globalPos = getGlobalPos(ent)
    return getReusableCirc(globalPos.x + ent.hitCirc.x, globalPos.y + ent.hitCirc.y, ent.hitCirc.radius)
}

export function setLocalPosX(node: Node, globalPosX: number) {
    let parent = node.parent
    let localPosX
    while (parent) {
        localPosX = globalPosX - parent.x
        parent = parent.parent
    }
    node.x = localPosX
}
export function setLocalPosY(node: Node, globalPosY: number) {
    let parent = node.ancestor
    let localPosY
    while (parent) {
        localPosY = globalPosY - parent.y
        parent = parent.ancestor
    }
    node.y = localPosY
}
export function getGlobalPos(node: Node) {
    let x = node.x
    let y = node.y
    while (!!node.ancestor) {
        node = node.ancestor
        x += node.x
        y += node.y
    }
    return getReusableCoords(x, y)
}

export function compositeDims(node: Node) {
    if (!node.descendants) {
        return { width: 0, height: 0 }
    }
    const fChild = node.descendants[0]
    const initialBounds = {
        minX: fChild.x,
        minY: fChild.y,
        maxX: fChild.x + fChild.width,
        maxY: fChild.y + fChild.height
    }
    const bounds = node.descendants.reduce((acc, child) => {
        return {
            minX: Math.min(acc.minX, child.x),
            minY: Math.min(acc.minY, child.y),
            maxX: Math.max(acc.maxX, child.x + child.width),
            maxY: Math.max(acc.maxY, child.y + child.height)
        }
    }, initialBounds)
    return ({
        width: bounds.maxX - bounds.minX,
        height: bounds.maxY - bounds.minY
    })
}