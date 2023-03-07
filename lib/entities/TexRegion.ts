import { Texture, BaseTexture, Sprite, Rectangle } from "pixi.js";
import TextureAtlasLocator from "@lib/service locators/TexAtlas"
import { NodeMixin } from "./Node";

export type AtlasFrameData = {
    x: number,
    y: number,
    rotation?: number,
    width: number,
    height: number
}
export type AtlasData = Readonly<
    Record<string, Readonly<AtlasFrameData>>
>

export class TexAtlas {
    private dict: Record<string, Texture> = { }
    constructor(private baseTex: BaseTexture, private data: AtlasData) {
        Object.entries(this.data).forEach(([ frameName, frameData ]) => {
            const { x, y, width, height, rotation } = frameData
            const dims = rotation === 90 ? [height, width]: [width, height]
            const texture = new Texture(this.baseTex)
            texture.frame = new Rectangle(x, y, dims[0], dims[1])
            this.dict[frameName] = texture
        })
    }
    get(frame: string) {
        if (frame in this.dict) {
            return this.dict[frame]
        }
        throw new Error(`frame with name '${frame}' doesn't exist`)
    }
}

class TexRegion extends NodeMixin(Sprite) {
    constructor(frame: string) {
        const texture = TextureAtlasLocator
            .locate()
            .get(frame)
        super(texture)
    }
}

export default TexRegion