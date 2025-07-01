import { PgConnection } from "PgConnection";

export interface Transactional<T> {
  executeScalar(connection: PgConnection): Promise<T | null>;
  execute(connection: PgConnection): Promise<T[] | null>;
}