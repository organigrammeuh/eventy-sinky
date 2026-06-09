import { pool } from "@/lib/db";
import { Speaker } from "@/types/speakers";

export const findSessionSpeaker = async (
    sessionId : string
) : Promise<Speaker[]> => {

    const findSpeakerQuery = `
        SELECT
            id, full_name, profile_picture_url, biography
        FROM speaker s
        JOIN session_speaker ss
            ON ss.id_speaker = s.id
        WHERE ss.id_session = $1
    `;

        const findSpeakerLinksQuery = `
        SELECT 
            url
        FROM link
        WHERE id_speaker = $1
    `;


    const findSpeakerResult = await pool.query(
        findSpeakerQuery , [sessionId]
    );
    
    const speakers : Speaker[] = [];

    for(const speaker of findSpeakerResult.rows){
        
        let thisSpeaker : Speaker = {
            id: speaker.id,
            bio: speaker.biography,
            fullName: speaker.full_name,
            profilePicture: speaker.profile_picture_url
        };

        let links : string[] = [];

        const getSpeakerLinkResult = await pool.query(
            findSpeakerLinksQuery , [speaker.id]
        );

        for(const linkRow of getSpeakerLinkResult.rows){
            links.push(linkRow.url);
        }

        thisSpeaker.socialLinks = links;
        
        speakers.push(thisSpeaker);

    }

    return speakers;

}