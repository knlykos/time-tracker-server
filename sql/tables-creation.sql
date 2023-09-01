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

CREATE TABLE access_tokens
(
    token_id    UUID PRIMARY KEY,
    user_id     UUID,
    "token"     TEXT,
    created_at  TIMESTAMP,
    created_by  UUID,
    modified_at TIMESTAMP,
    modified_by UUID,
    expires_at  TIMESTAMP
);

CREATE TABLE refresh_tokens
(
    refresh_token_id UUID PRIMARY KEY,
    user_id          UUID,
    refresh_token    TEXT,
    created_at       TIMESTAMP,
    created_by       UUID,
    modified_at      TIMESTAMP,
    modified_by      UUID,
    expires_at       TIMESTAMP
);

CREATE TABLE revoked_tokens
(
    token_id    UUID PRIMARY KEY,
    revoked_at  TIMESTAMP,
    created_at  TIMESTAMP,
    created_by  UUID,
    modified_at TIMESTAMP,
    modified_by UUID
);


SELECT * FROM users WHERE user_id = c9171851-1585-4499-b7aa-654dfcb1bbc1;