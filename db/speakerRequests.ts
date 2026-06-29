import { pool } from "@/lib/db";
import {
    SpeakerRequest,
    SpeakerRequestCreation,
    SpeakerRequestFiltering,
    SpeakerRequestPagination,
    SpeakerRequestStatus,
} from "@/types/speakerRequests";


const withLinks = async (client: any, requestId: string): Promise<SpeakerRequest> => {
    const reqResult = await client.query(
        `SELECT * FROM speaker_request WHERE id = $1`,
        [requestId]
    );
    if (reqResult.rowCount === 0) throw Object.assign(new Error("Speaker request not found"), { status: 404 });

    const linksResult = await client.query(
        `SELECT * FROM speaker_request_link WHERE id_speaker_request = $1`,
        [requestId]
    );

    return { ...reqResult.rows[0], links: linksResult.rows };
};


export const findAllSpeakerRequests = async (
    range: number[],
    filters: SpeakerRequestFiltering,
    sort: string[]
): Promise<SpeakerRequestPagination> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filters.status) {
        conditions.push(`sr.status = $${idx++}`);
        values.push(filters.status);
    }
    if (filters.full_name) {
        conditions.push(`sr.full_name ILIKE $${idx++}`);
        values.push(`%${filters.full_name}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const allowedSortFields: Record<string, string> = {
        created_at: "sr.created_at",
        full_name: "sr.full_name",
        status: "sr.status",
    };
    const sortField = allowedSortFields[sort[0]] ?? "sr.created_at";
    const sortDir = sort[1]?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const offset = range[0] ?? 0;
    const limit = range.length === 2 ? range[1] - range[0] + 1 : 20;

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM speaker_request sr ${where}`,
        values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
        `SELECT sr.* FROM speaker_request sr ${where}
         ORDER BY ${sortField} ${sortDir}
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
    );

    const speakerRequests: SpeakerRequest[] = await Promise.all(
        result.rows.map(async (row) => {
            const linksResult = await pool.query(
                `SELECT * FROM speaker_request_link WHERE id_speaker_request = $1`,
                [row.id]
            );
            return { ...row, links: linksResult.rows };
        })
    );

    return { speakerRequests, total };
};


export const findSpeakerRequestById = async (id: string): Promise<SpeakerRequest> => {
    return await withLinks(pool, id);
};


export const createSpeakerRequest = async (data: SpeakerRequestCreation): Promise<SpeakerRequest> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO speaker_request (full_name, biography, profile_picture_url)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [data.fullName, data.biography ?? null, data.profilePictureUrl ?? null]
        );
        const request = result.rows[0];

        if (data.links && data.links.length > 0) {
            for (const link of data.links) {
                await client.query(
                    `INSERT INTO speaker_request_link (url, type, id_speaker_request)
                     VALUES ($1, $2, $3)`,
                    [link.url, link.type ?? null, request.id]
                );
            }
        }

        await client.query("COMMIT");
        return await withLinks(client, request.id);
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};


export const updateSpeakerRequestStatus = async (
    id: string,
    status: SpeakerRequestStatus
): Promise<SpeakerRequest> => {
    await pool.query(
        `UPDATE speaker_request SET status = $1 WHERE id = $2`,
        [status, id]
    );
    return await findSpeakerRequestById(id);
};


export const approveSpeakerRequest = async (id: string): Promise<{ speakerId: string }> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const request = await withLinks(client, id);

        const speakerResult = await client.query(
            `INSERT INTO speaker (full_name, biography, profile_picture_url)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [request.full_name, request.biography, request.profile_picture_url]
        );
        const speakerId: string = speakerResult.rows[0].id;

        for (const link of request.links) {
            await client.query(
                `INSERT INTO link (url, type, id_speaker)
                 VALUES ($1, $2, $3)`,
                [link.url, link.type, speakerId]
            );
        }

        await client.query(
            `UPDATE speaker_request SET status = 'approved' WHERE id = $1`,
            [id]
        );

        await client.query("COMMIT");
        return { speakerId };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};