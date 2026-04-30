import { Pool } from "pg";

const poolConfig = {
    connectionString : process.env.DB_URL,
    max: 20,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,
}

export const pool : Pool = new Pool(poolConfig);