import { DictObject } from "./DictObject";

export class ItnSelectOption {
    id: string;
    label: string;
    blocked?: boolean;
    inputValue?: string;
    otherAttributes?: DictObject = {};

    constructor(id: string, label: string, blocked: boolean = false) {
        this.id = id;
        this.label = label;
        this.blocked = blocked;
    }
}