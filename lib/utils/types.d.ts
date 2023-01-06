export type DeepFrozenObject<Obj=object> = {
    readonly [Key in keyof Obj]: DeepFrozenObject<Obj[Key]>
}