export interface Common<T> {
    executeScalar(): Promise<T | null>;
    execute(): Promise<T[] | null>;
}