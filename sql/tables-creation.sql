CREATE TABLE users
(
    user_id        UUID,
    email          TEXT,
    password       TEXT,
    username       TEXT,
    status         TEXT,
    firstname      TEXT,
    lastname       TEXT,
    is_system_user BOOLEAN,
    created_at     TIMESTAMP,
    created_by     TEXT,
    modified_by    TEXT,
    modified_at    TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE users_by_email
(
    email          TEXT,
    user_id        UUID,
    password       TEXT,
    username       TEXT,
    status         TEXT,
    firstname      TEXT,
    lastname       TEXT,
    is_system_user BOOLEAN,
    created_at     TIMESTAMP,
    created_by     TEXT,
    modified_by    TEXT,
    modified_at    TIMESTAMP,
    PRIMARY KEY (email)
);

create table plant43.tokens
(
    "token"     text,
    user_id     uuid,
    type        text,
    created_at  timestamp,
    created_by  uuid,
    expires_at  timestamp,
    modified_at timestamp,
    modified_by uuid,
    revoked_at  timestamp,
    primary key ("token", user_id, type)
);




SELECT * FROM users WHERE user_id = c9171851-1585-4499-b7aa-654dfcb1bbc1;