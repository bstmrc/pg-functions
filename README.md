# pg-functions

Abstracción para ejecución de funciones PL/pgSQL desde Node.js con [`pg`](https://www.npmjs.com/package/pg).

## Características

- Ejecución de funciones PL/pgSQL de forma tipada.
- Transacciones automáticas (`PgFunction`) o manuales (`PgFunctionTransactional`).
- Tipado con genéricos para resultados (`<T>`).
- Inyección de opcional de logger (compatible con `pino`, `console`, etc.).
- Basado en el `Pool` del proyecto consumidor.


## Instalación

```bash
pnpm add pg-functions
```

## Configuración

``` ts
import { Pool } from 'pg';
import { registerPool } from 'pg-functions';

registerPool(new Pool({/* ... */}))
```

## Uso

### 1. Crear una función PL/pgSQL en base de datos
```sql
CREATE OR REPLACE FUNCTION fn_obtener_roles_usuario()
RETURNS TABLE (id INTEGER, nombre VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT "ID_ROL_USUARIO" AS id, "N_ROL_USUARIO" AS nombre
  FROM "T_ROLES_USUARIO"
  ORDER BY "ID_ROL_USUARIO";
END;
$$;
```

### 2. Consumir la función desde Node.js
```ts
import { PgFunction } from 'pg-functions';

type RolRecord = {
  id: number;
  nombre: string;
};

export const obtenerRoles = async (): Promise<RolRecord[] | null> => {
  const func = new PgFunction<RolRecord>('fn_obtener_roles_usuario', []);
  return await func.execute();
};
```

# Opcional: Logger personalizado

```ts
import { setLogger } from 'pg-functions';
import pino from 'pino';

setLogger(pino({ level: 'info' }));
```

# API

| Clase                        | Descripción                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `PgFunction<T>`              | Ejecuta funciones PL/pgSQL con control transaccional automático (`BEGIN`, `COMMIT`, `ROLLBACK`, `RELEASE`). Ideal para operaciones simples que deben ser atómicas  |
| `PgFunctionTransactional<T>` | Ejecuta funciones dentro de una transacción controlada manualmente. El desarrollador debe encargarse de realizar `commit()`, `rollback()` y `release()` usando la conexión provista. Útil cuando se deben encadenar múltiples funciones en una misma transacción           |
| `PgConnection`               | Wrapper de `PoolClient` con manejo de transacciones y logs |
| `registerPool()`             | Registra el `Pool` global del proyecto                     |
| `setLogger()`                | Define un logger personalizado                             |
