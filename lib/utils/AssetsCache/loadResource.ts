import Sound from "@utils/Sound"
import { offlineErrMsg } from "@lib/constants"

type Type = "sound" | "image" | "data"

const loadSoundResource = Sound.loadResource
const loadImgResource = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = () => reject({ message: offlineErrMsg })
    })
}
const loadDataResource = <ResolvesTo extends object>(url: string): Promise<ResolvesTo> => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(e => reject({ message: offlineErrMsg }))
    })
}

const loadFns = {
    "sound": loadSoundResource,
    "image": loadImgResource,
    "data": loadDataResource
}

const inferType = (url: string): Type => {
    if (url.match(/.(jpe?g)|(png)$/)) {
        return "image"
    } else if (url.match(/.(mp3)|(wav)|(ogg)$/)) {
        return "sound"
    } else if (url.match(/.(cson|bson|json)$/)) {
        return "data"
    }
}

const loadResource = (url: string) => {
    const type = inferType(url)
    const load = loadFns[type]
    return load(url)
}
export default loadResource