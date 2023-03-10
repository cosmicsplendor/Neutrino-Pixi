export type DeepFrozenObject<Obj=object> = {
    readonly [Key in keyof Obj]: DeepFrozenObject<Obj[Key]>
}
export type Constructor<T={}> = new (...args: any[]) => T
export type ReturnType<Fn> = Fn extends (...args: any[]) => infer R ? R: never