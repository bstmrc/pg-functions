import { PgFunctionBase } from "./PgFunctionBase";
import { Transactional } from "../interfaces/Transactional";
import { SqlMode } from "../enum/SqlMode.enum";
import { PgConnection } from "PgConnection";

export class PgFunctionTransactional<T = any> extends PgFunctionBase implements Transactional<T> {
  constructor(functionName: string, functionArgs: any[]) {
      super(functionName, functionArgs)
  }

  async execute(connection: PgConnection): Promise<T[] | null> {
    const result = await connection.query(this.sql(), this.getfunctionArgs());
    if (!result) {
      return null;
    }

    return result.rows as T[];
  }

  async executeScalar(connection: PgConnection): Promise<T | null> {
    const result = await connection.query(this.sql(SqlMode.SCALAR), this.getfunctionArgs());
    if (!result) {
      return null;
  }

    const row = result.rows[0];

    const value = Object.values(row)[0]
    return value as T
  }
}

