CREATE TABLE "user" (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL
);

-- delete not null for password
ALTER TABLE "user"
ALTER COLUMN password
DROP NOT NULL;

-- new column for user
ALTER TABLE "user"
ADD COLUMN full_name VARCHAR,
ADD COLUMN avatar_url VARCHAR,
ADD COLUMN auth_provider VARCHAR NOT NULL DEFAULT 'local' CHECK (auth_provider IN ('local', 'google', 'github')),
ADD COLUMN created_at TIMESTAMP DEFAULT now ();

ALTER TABLE "user" ADD CONSTRAINT user_role_check CHECK (role IN ('admin', 'attendee'));

-- make email unique
ALTER TABLE "user" ADD CONSTRAINT user_email_unique UNIQUE (email);

CREATE TABLE event (
    id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    place VARCHAR
);

CREATE TABLE room (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE speaker (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    profile_picture_url VARCHAR,
    biography TEXT
);

CREATE TABLE session (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    capacity INTEGER,
    id_event UUID NOT NULL,
    id_room UUID NOT NULL,
    FOREIGN KEY (id_event) REFERENCES event (id),
    FOREIGN KEY (id_room) REFERENCES room (id)
);

CREATE TABLE session_speaker (
    id_session UUID,
    id_speaker UUID,
    PRIMARY KEY (id_session, id_speaker),
    FOREIGN KEY (id_session) REFERENCES session (id),
    FOREIGN KEY (id_speaker) REFERENCES speaker (id)
);

CREATE TABLE question (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    content TEXT NOT NULL,
    name VARCHAR,
    upvotes INTEGER DEFAULT 0,
    creation_datetime TIMESTAMP,
    id_session UUID NOT NULL,
    FOREIGN KEY (id_session) REFERENCES session (id)
);

CREATE TABLE link (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    url TEXT NOT NULL,
    type VARCHAR,
    id_speaker UUID NOT NULL,
    FOREIGN KEY (id_speaker) REFERENCES speaker (id)
);

--Location migration guys!!

CREATE TABLE location (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name VARCHAR,
    country VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now ()
);
--A default value for the events already existing
INSERT INTO location (name, country, city) VALUES ('Default', 'Unknown', 'Unknown');

--Create the column, set the default value and then force the column to not null on the event table:)
ALTER TABLE event ADD COLUMN id_location UUID REFERENCES location (id);
UPDATE event SET id_location = (SELECT id FROM location WHERE name = 'Default') WHERE id_location IS NULL;
ALTER TABLE event ALTER COLUMN id_location SET NOT NULL;
ALTER TABLE event DROP COLUMN place;

--The same but with room table
ALTER TABLE room ADD COLUMN id_location UUID REFERENCES location (id);
UPDATE room SET id_location = (SELECT id FROM location WHERE name = 'Default') WHERE id_location IS NULL;
ALTER TABLE room ALTER COLUMN id_location SET NOT NULL;

CREATE TABLE speaker_request (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    biography TEXT,
    profile_picture_url VARCHAR,
    status VARCHAR NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE speaker_request_link (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    type VARCHAR,
    id_speaker_request UUID NOT NULL,
    FOREIGN KEY (id_speaker_request) REFERENCES speaker_request(id) ON DELETE CASCADE
);