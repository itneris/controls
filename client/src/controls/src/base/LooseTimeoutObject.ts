export interface LooseTimeoutObject {
    [key: string]: ReturnType<typeof setTimeout>;
}
