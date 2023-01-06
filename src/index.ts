import { Application } from 'pixi.js'

const app = new Application({
    view: document.getElementById("arena") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window
})