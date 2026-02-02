import { getSchema } from "../context"
import { SqlMode } from "../enum/SqlMode.enum"
import { Base } from "../interfaces/Base"

export abstract class PgFunctionBase implements Base {
    private readonly functionName: string
    private readonly functionArgs: any[]

    constructor(functionName: string, functionArgs: any[]) {
        this.functionName = functionName
        this.functionArgs = functionArgs
    }

    sql(mode: SqlMode = SqlMode.DEFAULT): string {
        const prefix = mode === SqlMode.SCALAR ? 'SELECT' : 'SELECT * FROM'
        const suffix = mode === SqlMode.SCALAR ? ' AS result' : ''
        const schema = getSchema() ? `${getSchema()}.` : ''
        return `${prefix} ${schema}${this.functionName}(${this.getPlaceHolders()})${suffix};`
    }

    getPlaceHolders(): string {
        return this.functionArgs.length ? this.functionArgs.map((_, i) => `$${i + 1}`).join(', ') : ''
    }

    getfunctionArgs(): string[] {
        return this.functionArgs
    }
}