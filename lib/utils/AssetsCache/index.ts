import { Assets } from "pixi.js"
import Observable from "../Observable"
import loadResource, { loadConcurrently, Asset, inferType } from "./loadResource"

class AssetLoader extends Observable { // static class
    private resources: Record<string, unknown> = {}
    constructor() {
        super(["prog", "prog-end", "load", "error"]) // defining a set of supported events
    }
    async load(assets: Asset[], concurrency = 5) {
        const len = assets.length
        let loaded = 0
        const load = async (asset: Asset) => {
            try {
                const url = typeof asset === "string" ? asset : asset.url
                const resource = await loadResource(url)
                this.resources[url] = resource
                loaded += 1
                this.emit("prog", loaded / len, typeof asset !== "string" && asset.msg)
            } catch (e) {
                this.emit("error", e.message ?? e)
            }
        }
        await loadConcurrently(assets, load, concurrency)
        this.emit("load")
        this.emit("prog-end")
    }
    unload(url: string) {
        if (inferType(url) === "image") {
            Assets.unload(url)
        }
        delete this.resources[url]
    }
    get(assetUrl: string) {
        return this.resources[assetUrl]
    }
}

export default AssetLoader