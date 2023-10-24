create table tokens
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

create table users
(
    user_id        uuid primary key,
    created_at     timestamp,
    created_by     text,
    email          text,
    firstname      text,
    is_system_user boolean,
    lastname       text,
    modified_at    timestamp,
    modified_by    text,
    password       text,
    phone_number   text,
    status         text,
    username       text
);

