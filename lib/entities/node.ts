// import Observable from "@lib/utils/Observable";
import { Constructor } from "@lib/utils/types";
import { Container } from "pixi.js";

export const NodeMixin = function <TBase extends Constructor<Container>>(Base: TBase) {
    return class NodeClass extends Base {
        descendants: NodeClass[] = []
        ancestor?: NodeClass
        update?: (dt: number, t: number) => void
        add(child: NodeClass) {
            this.addChild(child)
            this.descendants.push(child)
            child.ancestor = this
        }
        remove(child?: NodeClass) {
            if (child === undefined) {
                const remove = this.ancestor?.remove || this.parent?.removeChild
                remove ?? remove(child)
                return
            }
            this.removeChild(child)
            this.descendants = this.descendants.filter(dec => child !== dec)
        }
    }
}

class Node extends NodeMixin(Container) {}

// const node = new NodeClass()
// const sprite = new SpriteClass()
// node.add(new Sprite())

// interface Node  {
//     onRemove?: () => void,
//     id?: string,
//     childNodes: Node[]
// }

// class Node extends NodeMixin(Container) {
//     private static entities: {
//        [Key: string]: Container
//     } = { }
//     static addRef(id: string | number, node: Container) {
//         this.entities[String(id)] = node
//     }
//     static removeRef(id: string) {
//         delete this.entities[id]
//     }
//     static get(id: string) {
//         return this.entities[id]
//     }
//     static cleanupRecursively(node: Node) {
//         if (node.onRemove) { node.onRemove() }
//         if (node.id) { this.removeRef(node.id) }
//         if (!node.childNodes) { return }
//         for (let childNode of node.childNodes) {
//             Node.cleanupRecursively(childNode)
//         }
//     }
//     static updateRecursively(node: Node, dt: number, t: number, rootNode = node) {
//         // if (node.movable) {
//         //     node.prevPosX = node.x
//         //     node.prevPosY = node.y
//         //     if (node.unduePosXUpdate) {
//         //         node.x += node.unduePosXUpdate
//         //         node.unduePosXUpdate = 0
//         //     }
//         //     if (node.roll) {
//         //         node.prevRot = node.rotation
//         //     }
//         // }
//         // node._visible = node.alpha === 0 ? false: (rootNode.intersects ? rootNode.intersects(node): true)
//         // ;(node._visible || node.forceUpdate) && node.update && node.update(dt, t)
//         // if (!node.childNodes) { return }
//         const cachedChildren = node.childNodes
//         /**
//          * cached copy of node.childNodes must be kept to ensure the code executes predictable
//          * in case we didn't do so, removal of a childNode (in it's update function) would break this recursion --
//          * when the childNodes iteration reaches the removed childNode's last sibling
//          * that's because the new childNodes array would have lastChildrenLength - 1 length, but the endpoint of the current iteration --
//          * would still be lastChildrenLength. So trying access length index of the new childNodes array would result in an undefined value
//          * Here's an interesting fact: this shrinking of childNodes array results in the removed node's next sibling shifting an index backward,
//          * thus occupying the removed node's current position. The next iteration therefore skips over it.
//          */
//         for (let i = 0, len = cachedChildren.length; i < len; i++) {
//             Node.updateRecursively(cachedChildren[i], dt, t, rootNode)
//         }
//     }
//     static removeChild(parentNode: Node, childNode: Node, cleanup = true) {
//         if (!parentNode) { return }
//         parentNode.childNodes = parentNode.childNodes.filter(n => n !== childNode)
//         childNode.parent = null
//         if (cleanup) this.cleanupRecursively(childNode)
//     }
//     constructor({ pos = { x: 0, y: 0 }, rotation, scale,  anchor, pivot, id, alpha } = {}) {
//         this.pos = pos
//         this._visible = true
//         scale && (this.scale = scale)
//         rotation && (this.rotation = rotation)
//         anchor && (this.anchor = anchor)
//         pivot && (this.pivot = pivot)
//         alpha && (this.alpha = alpha)
//         if (Boolean(id)) {
//             this.id = id
//             Node.addRef(id, this)
//         }
//     }
//     add(childNode: Container) {
//         this.addChild(childNode)
//     }
//     remove(cleanup) {
//         Node.removeChild(this.parent, this, cleanup)
//     }
// }

export default Node