user table users_projects{
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    constraint pk_users_projects primary key (user_id, project_id),
    constraint fk_up_user foreign key (user_id) references users(id) on delete cascade,
    constraint fk_up_project foreign key (project_id) references projects(id) on delete cascade
}
