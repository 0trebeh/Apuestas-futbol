create database futbol;

create table app_user (
	user_id serial PRIMARY KEY,
	username VARCHAR (60) NOT NULL,
	email VARCHAR (255) NOT NULL,
	password VARCHAR (120) NOT NULL,
	phone VARCHAR (30),
    address VARCHAR (100),
    bettor boolean DEFAULT false
);

