CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users
(
    user_id        uuid PRIMARY KEY            NOT NULL DEFAULT uuid_generate_v4(),
    created_at     timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     text,
    email          text                        NOT NULL UNIQUE,
    firstname      text,
    is_system_user boolean,
    lastname       text,
    modified_at    timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by    text,
    password       text,
    phone_number   text,
    status         text CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'NOT_VERIFIED', 'DELETED')),
    username       text UNIQUE
);

CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_username ON public.users (username);



create table public.tokens
(
    token_id    uuid default uuid_generate_v4() not null
        primary key,
    token       text,
    user_id     uuid,
    type        text
        constraint token_type_check
            check (type = ANY (ARRAY ['ACCESS'::text, 'ACTIVATION'::text, 'REFRESH'::text])),
    created_at  timestamp,
    created_by  uuid,
    expires_at  timestamp,
    modified_at timestamp,
    modified_by uuid,
    revoked_at  timestamp
);

