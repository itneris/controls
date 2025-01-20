export class ItnSelectOption {
    id: string;
    label: string;
    blocked?: boolean;
    otherAttributes?: Map<string, any> = new Map<string, any>();

    constructor(id: string, label: string, blocked: boolean = false) {
        this.id = id;
        this.label = label;
        this.blocked = blocked;
    }
}