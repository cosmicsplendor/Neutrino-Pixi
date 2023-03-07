import type { TexAtlas } from "@lib/entities/TexRegion"

class TexAtlasLocator {
    private static texAtlas: TexAtlas
    private static registered = false
    static register(texAtlas: TexAtlas) {
        this.texAtlas = texAtlas
        this.registered = true
    }
    static locate() {
        if (!this.registered) {
            throw new Error("Texture Atlas must be registered before it can be located")
        }
        return this.texAtlas
    }
}

export default TexAtlasLocator