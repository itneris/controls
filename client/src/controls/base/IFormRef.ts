import { LooseObject } from "./LooseObject";

export interface IFormRef {
    getCurrentValues: () => LooseObject,
    validate: () => boolean
}