import { PoolClient, QueryResult } from "pg";
import { getLogger } from "./utils";

export class PgConnection {
  constructor(private readonly connection: PoolClient) {
    getLogger().info(`Acquired DB connection for function execution.`)
  }

  get raw(): PoolClient {
      return this.connection
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult<any> | null> {
    getLogger().info(`Executing ${sql} with args: ${JSON.stringify(params)}`);
    const result = await this.connection.query(sql, params);
    if (result.rowCount === 0) {
      getLogger().info(`Function returned no rows.`);
      return null;
    }
    return result;
  }

  async begin(): Promise<void> {
    await this.connection.query("BEGIN")
  }

  async commit(): Promise<void> {
    await this.connection.query("COMMIT")
    getLogger().info(`Function executed successfully.`)
  }

  async rollback(): Promise<void> {
    await this.connection.query("ROLLBACK")
      getLogger().error('Error during function execution. Rolled back transaction.')
  }

  release(): void {
    this.connection.release()
    getLogger().info(`Connection released.`)
  }
}
