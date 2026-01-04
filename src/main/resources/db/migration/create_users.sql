
create table users{
    id BIGSERIAL primary key,
    username varchar(50) not null,
    email varchar(100) not null,
    password varchar(100) not null,
    project_id BIGINT,
};