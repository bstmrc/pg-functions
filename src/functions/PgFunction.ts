import { Common } from "../interfaces/Common";
import { PgFunctionBase } from "./PgFunctionBase";
import { getPool } from "../context"
import { PgConnection } from "../PgConnection";
import { SqlMode } from "../enum/SqlMode.enum";

export class PgFunction<T> extends PgFunctionBase implements Common<T> {
  constructor(funtionName: string, functionArgs: any[]) {
      super(funtionName, functionArgs);
  }

  async execute(): Promise<T[] | null> {
    const connection = new PgConnection(await getPool().connect())
    try {
      await connection.begin()      
      const result = await connection.query(this.sql(), super.getfunctionArgs())
      if (!result) {
        return null
      }

      await connection.commit()
      return result.rows as T[];
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  async executeScalar(): Promise<T | null> {
    const connection = new PgConnection(await getPool().connect())
    try {
      await connection.begin()
      const result = await connection.query(this.sql(SqlMode.SCALAR), super.getfunctionArgs())
      if (!result) {
          return null;
      }

      const row = result.rows[0];
      const value = Object.values(row)[0];
      
      await connection.commit()
      return value as T
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

    
}