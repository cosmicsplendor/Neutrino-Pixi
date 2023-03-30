import { Texture, BaseTexture, Sprite, Rectangle, Spritesheet } from "pixi.js";
import TextureAtlasLocator from "@lib/service locators/TexAtlas"
import { NodeMixin } from "./Node";
import { RectBounds } from "@lib/utils/math";

export type SpriteFrameData = {
    x: number,
    y: number,
    w: number,
    h: number
}
export type AtlasData = Readonly<
    Record<string, Readonly<RectBounds>>
>
export class TexAtlas {
    private sheet: Spritesheet
    constructor(baseTex: BaseTexture, data: AtlasData) {
        const spritesheetData = {
            frames: Object.entries(data)
                .reduce((frames, entry) => {
                    const [name, d] = entry
                    const { x, y, width, height } = d
                    frames[`${name}`] = {
                        frame: { x, y, w: width, h: height }
                    }
                    return frames
                }, {} as Record<string, { frame: SpriteFrameData }>),
            meta: {
                scale: "1"
            }
        }
        this.sheet = new Spritesheet(baseTex, spritesheetData)
    }
    async init() {
        await this.sheet.parse()
    }
    get(frame: string) {
        if (frame in this.sheet.textures) {
            return this.sheet.textures[frame]
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