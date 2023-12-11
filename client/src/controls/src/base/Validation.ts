export class Validation<T> {
    property: keyof T;
    message: string;

    constructor(property: keyof T, message: string) {
        this.property = property;
        this.message = message;
    }
}
