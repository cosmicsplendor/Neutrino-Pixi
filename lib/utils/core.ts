type Null = null | undefined
export const isNull = (v: any): v is Null => {
    return v === undefined || v === null
}
export const isObject = (v: any): v is object => {
    return typeof v === "object" && !isNull(v)
}