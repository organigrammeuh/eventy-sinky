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
