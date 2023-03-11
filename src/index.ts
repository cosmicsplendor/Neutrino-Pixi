import { Application, BackgroundSystem, BaseTexture } from 'pixi.js'
import { TexAtlas } from '@lib/entities/TexRegion'
import Node from '@lib/entities/Node'
import atlasData from "@assets/texAtlas/data"
import atlasImg from "@assets/texAtlas/image.png"
import TexAtlasLocator from '@lib/service locators/TexAtlas'
import TexRegion from '@lib/entities/TexRegion'
import AssetLoader from "@lib/utils/AssetsCache"
import Viewport from '@lib/utils/Viewport'

const app = new Application({
    view: document.getElementById("arena") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    width: window.innerWidth,
    height: window.innerHeight,
})
const viewport = new Viewport((width, height) => {
    return { width, height }
})
viewport.on("change", () => {
    app.renderer.resize(viewport.width, viewport.height)
})
class Crane extends TexRegion {
    constructor() {
        super("crane")
    }
    update = dt => {
        this.x += 20 * dt
        this.y += 20 * dt
    }
}
const startGameLoop = (scene) => {
    let lastT = 0
    const updateRecursively = (node, dt: number, t: number, rootNode=node) => {
        node.descendants.forEach(desc => {
            node.visible = typeof rootNode.intersects === "function" ? rootNode.intersects(node): true
            if (typeof desc.update === "function") {
                desc.update(dt, t)
            }
            const cachedChildren = node.descendants
            for (let i = 0, len = cachedChildren.length; i < len; i++) {
                updateRecursively(cachedChildren[i], dt, t, rootNode)
            }
        })
    }
    const loop = t => {
        const ms = t / 1000
        const dt = ms - lastT
        lastT = ms
        updateRecursively(scene, dt, t)
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}
const assetLoader = new AssetLoader()
assetLoader.load([ atlasImg ])
assetLoader.on("prog-end", () => {
    TexAtlasLocator.register(new TexAtlas(assetLoader.get(atlasImg) as BaseTexture, atlasData))
    const scene = new Node()
    // app.stage.addChild(scene)
    app.stage = scene
    const crane = new Crane()
    scene.add(crane)
    const loopControls = startGameLoop(scene)
})
assetLoader.on("error", console.log)