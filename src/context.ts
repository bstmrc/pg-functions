import type { Pool } from 'pg';

let appPool: Pool | undefined;

export function registerPool(pool: Pool): void {
  if (appPool) {
    throw new Error('pg-functions: Ya existe un pool registrado. Solo se permite un pool por aplicación.');
  }
  appPool = pool;
}

export function getPool(): Pool {
  if (!appPool) {
    throw new Error('pg-functions: No se ha registrado un pool. Asegúrate de llamar a registerPool antes de usar getPool.');
  }
  return appPool;
}