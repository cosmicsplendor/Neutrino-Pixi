import { Application, BaseTexture } from 'pixi.js'
import { TexAtlas } from '@lib/entities/TexRegion'
import Node from '@lib/entities/Node'
import atlasData from "@assets/texAtlas/data"
import atlasImg from "@assets/texAtlas/image.png"
import TexAtlasLocator from '@lib/service locators/TexAtlas'
import TexRegion from '@lib/entities/TexRegion'
import AssetLoader from "@lib/utils/AssetsCache"

const app = new Application({
    view: document.getElementById("arena") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window
})

class Crane extends TexRegion {
    constructor() {
        super("crane")
    }
    update = dt => {
        this.x += 20 * dt
        this.y += 30 * dt
    }
}
const executeLoop = (scene) => {
    let lastT = 0
    const updateRecursively = (scene, dt: number, t: number) => {
        scene.descendants.forEach(desc => {
            if (typeof desc.update === "function") {
                desc.update(dt, t)
            }
            updateRecursively(desc, dt, t)
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
    app.stage.addChild(scene)
    const crane = new Crane()
    scene.add(crane)
    executeLoop(scene)
})
assetLoader.on("error", console.log)