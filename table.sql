CREATE TABLE "user" (
                        id VARCHAR PRIMARY KEY,
                        email VARCHAR NOT NULL,
                        password VARCHAR NOT NULL,
                        role VARCHAR NOT NULL
);

CREATE TABLE event (
                       id VARCHAR PRIMARY KEY,
                       title VARCHAR NOT NULL,
                       description TEXT,
                       start_date TIMESTAMP,
                       end_date TIMESTAMP,
                       place VARCHAR
);

CREATE TABLE room (
                      id VARCHAR PRIMARY KEY,
                      name VARCHAR NOT NULL
);

CREATE TABLE speaker (
                         id VARCHAR PRIMARY KEY,
                         full_name VARCHAR NOT NULL,
                         profile_picture_url VARCHAR,
                         biography TEXT
);

CREATE TABLE session (
                         id VARCHAR PRIMARY KEY,
                         title VARCHAR NOT NULL,
                         description TEXT,
                         start_date TIMESTAMP,
                         end_date TIMESTAMP,
                         capacity INTEGER,
                         id_event VARCHAR NOT NULL,
                         id_room VARCHAR NOT NULL,
                         FOREIGN KEY (id_event) REFERENCES event(id),
                         FOREIGN KEY (id_room) REFERENCES room(id)
);

CREATE TABLE session_speaker (
                                 id_session VARCHAR,
                                 id_speaker VARCHAR,
                                 PRIMARY KEY (id_session, id_speaker),
                                 FOREIGN KEY (id_session) REFERENCES session(id),
                                 FOREIGN KEY (id_speaker) REFERENCES speaker(id)
);

CREATE TABLE question (
                          id VARCHAR PRIMARY KEY,
                          content TEXT NOT NULL,
                          name VARCHAR,
                          upvotes INTEGER DEFAULT 0,
                          creation_datetime TIMESTAMP,
                          id_session VARCHAR NOT NULL,
                          FOREIGN KEY (id_session) REFERENCES session(id)
);

CREATE TABLE link (
                      id VARCHAR PRIMARY KEY,
                      url TEXT NOT NULL,
                      type VARCHAR,
                      id_speaker VARCHAR NOT NULL,
                      FOREIGN KEY (id_speaker) REFERENCES speaker(id)
);