CREATE TABLE "user" (
                        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                        email VARCHAR NOT NULL,
                        password VARCHAR NOT NULL,
                        role VARCHAR NOT NULL
);

CREATE TABLE event (
                       id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                       title VARCHAR NOT NULL,
                       description TEXT,
                       start_date TIMESTAMP,
                       end_date TIMESTAMP,
                       place VARCHAR
);

CREATE TABLE room (
                      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                      name VARCHAR NOT NULL
);

CREATE TABLE speaker (
                         id UUID DEFAULT gen_random_uuid()PRIMARY KEY,
                         full_name VARCHAR NOT NULL,
                         profile_picture_url VARCHAR,
                         biography TEXT
);

CREATE TABLE session (
                         id UUID DEFAULT gen_random_uuid()PRIMARY KEY,
                         title VARCHAR NOT NULL,
                         description TEXT,
                         start_date TIMESTAMP,
                         end_date TIMESTAMP,
                         capacity INTEGER,
                         id_event UUID NOT NULL,
                         id_room UUID NOT NULL,
                         FOREIGN KEY (id_event) REFERENCES event(id),
                         FOREIGN KEY (id_room) REFERENCES room(id)
);

CREATE TABLE session_speaker (
                                 id_session UUID,
                                 id_speaker UUID,
                                 PRIMARY KEY (id_session, id_speaker),
                                 FOREIGN KEY (id_session) REFERENCES session(id),
                                 FOREIGN KEY (id_speaker) REFERENCES speaker(id)
);

CREATE TABLE question (
                          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                          content TEXT NOT NULL,
                          name VARCHAR,
                          upvotes INTEGER DEFAULT 0,
                          creation_datetime TIMESTAMP,
                          id_session UUID NOT NULL,
                          FOREIGN KEY (id_session) REFERENCES session(id)
);

CREATE TABLE link (
                      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                      url TEXT NOT NULL,
                      type VARCHAR,
                      id_speaker UUID NOT NULL,
                      FOREIGN KEY (id_speaker) REFERENCES speaker(id)
);
