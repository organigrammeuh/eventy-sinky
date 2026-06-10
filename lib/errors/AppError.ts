export class AppError extends Error {
    constructor(
        message: string,
        statusCode: number,
    ) {
        super(message);
        this.name = this.constructor.name;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}