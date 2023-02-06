import Sound from "@utils/Sound"
import { Assets, BaseTexture, Texture } from "pixi.js"
import { offlineErrMsg } from "@lib/constants"

type Type = "sound" | "image" | "data"
export type Asset = string | { url: string, msg: string }

const loadSoundResource = Sound.loadResource
const loadImgResource = async (url: string): Promise<BaseTexture> => {
    try {
        const texture = (await Assets.load(url)) as Texture
        return texture.baseTexture
    } catch {
        throw new Error(offlineErrMsg)
    }
}
const loadDataResource = (url: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(() => reject({ message: offlineErrMsg }))
    })
}

const loadFns = {
    "sound": loadSoundResource,
    "image": loadImgResource,
    "data": loadDataResource
}

export const inferType = (url: string): Type => {
    if (url.match(/.(jpe?g)|(png)$/)) {
        return "image"
    } else if (url.match(/.(mp3)|(wav)|(ogg)$/)) {
        return "sound"
    } else if (url.match(/.(cson|bson|json)$/)) {
        return "data"
    } else {
        throw new Error(`Resource type for ${url} couldn't be identified`)
    }
}

const loadResource = (url: string) => {
    const type = inferType(url)
    const load = loadFns[type]
    return load(url)
}

export const loadConcurrently = async (urls: Asset[], load: (url: Asset) => Promise<void>, conccurrency = 3) => {
    for (let i = 0; i < urls.length + conccurrency; i += conccurrency) {
        await Promise.all(
            urls.slice(i, i + conccurrency).map(load)
        )
    }
}

export default loadResource