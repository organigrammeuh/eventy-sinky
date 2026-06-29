import { Location, LocationCreation, LocationFiltering, LocationPagination } from "@/types/location";
import { pool } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";

export const createLocation = async (toSave: LocationCreation): Promise<Location> => {
    const { rows } = await pool.query(
        `INSERT INTO location (name, country, city)
         VALUES ($1, $2, $3)
         RETURNING id, name, country, city, created_at`,
        [toSave.name ?? null, toSave.country, toSave.city]
    );

    return {
        id: rows[0].id,
        name: rows[0].name,
        country: rows[0].country,
        city: rows[0].city,
        createdAt: rows[0].created_at,
    };
};

export const findLocationById = async (locationId: string): Promise<Location> => {
    const { rows } = await pool.query(
        "SELECT id, name, country, city, created_at FROM location WHERE id = $1",
        [locationId]
    );

    if (rows.length === 0) {
        throw new AppError(`Location with id={${locationId}} not found.`, 404);
    }

    return {
        id: rows[0].id,
        name: rows[0].name,
        country: rows[0].country,
        city: rows[0].city,
        createdAt: rows[0].created_at,
    };
};

export const findAllLocations = async (
    range?: number[],
    filter?: LocationFiltering,
    sort?: string[]
): Promise<LocationPagination> => {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter?.name) {
        conditions.push(`name ilike $${values.length + 1}`);
        values.push(`%${filter.name}%`);
    }
    if (filter?.country) {
        conditions.push(`country ilike $${values.length + 1}`);
        values.push(`%${filter.country}%`);
    }
    if (filter?.city) {
        conditions.push(`city ilike $${values.length + 1}`);
        values.push(`%${filter.city}%`);
    }

    let query = 'SELECT id FROM location';
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const allowedDirections = ['asc', 'desc', 'ASC', 'DESC'];
    if (sort && sort.length > 0 && allowedDirections.includes(sort[1])) {
        query += ` ORDER BY ${sort[0]} ${sort[1]}`;
    }

    const { rows } = await pool.query(query, values);
    const toFind = range?.length ? rows.slice(range[0], range[1] + 1) : rows;

    const locations: Location[] = [];
    for (const row of toFind) {
        const location = await findLocationById(row.id);
        locations.push(location);
    }

    return { locations, total: rows.length };
};

export const updateLocation = async (locationId: string, data: Partial<LocationCreation>): Promise<Location> => {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        setClauses.push(`name = $${values.length + 1}`);
        values.push(data.name);
    }
    if (data.country !== undefined) {
        setClauses.push(`country = $${values.length + 1}`);
        values.push(data.country);
    }
    if (data.city !== undefined) {
        setClauses.push(`city = $${values.length + 1}`);
        values.push(data.city);
    }

    if (setClauses.length === 0) {
        return findLocationById(locationId);
    }

    values.push(locationId);
    const query = `UPDATE location SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id`;

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        throw new AppError(`Location with id={${locationId}} not found.`, 404);
    }

    return findLocationById(locationId);
};

export const deleteLocation = async (locationId: string): Promise<void> => {
    const { rowCount } = await pool.query('DELETE FROM location WHERE id = $1', [locationId]);
    if (rowCount === 0) {
        throw new AppError(`Location with id={${locationId}} not found.`, 404);
    }
};
