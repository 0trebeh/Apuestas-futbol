CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(30),
  last_name varchar(30),
  id_document varchar(20),
  email varchar(50),
  phone varchar(20),
  address varchar(100)
);

CREATE TABLE payment (
  payment_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid,
  account_number varchar(30),
  bank varchar(30),
  ref_number varchar(30),
  ammount float,
  state varchar(30),
  payment_date timestamptz
);

CREATE TABLE bill (
  bill_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  payment_id uuid,
  bet_id uuid,
  ammount float,
  created timestamptz
);

CREATE TABLE country (
  country_id INT PRIMARY KEY,
  name varchar(30),
  code varchar(30)
);

CREATE TABLE tournament (
  tournament_id INT PRIMARY KEY,
  name varchar(30),
  type varchar(30),
  location INT
);

CREATE TABLE tournament_season (
  season_id INT PRIMARY KEY,
  tournament_id INT,
  start_date TIMESTAMP,
  end_date TIMESTAMP
);

CREATE TABLE match (
  match_id INT PRIMARY KEY,
  season_id INT,
  date timestamp,
  playing boolean,
  duration float,
  extension boolean
);

CREATE TABLE match_teams (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  team_id INT,
  match_id INT,
  goals integer,
  winner boolean,
  loser boolean,
  draw boolean
);

CREATE TABLE teams (
  team_id INT PRIMARY KEY,
  name varchar(30),
  country_id INT,
  foundation timestamp,
  colors varchar(30),
  address varchar(30),
  phone varchar(30),
  website varchar(30),
  email varchar(100)
);

CREATE TABLE players (
  player_id INT PRIMARY KEY,
  name varchar(50),
  birth_date timestamp,
  positopm varchar(30),
  number integer,
  birth_country_id INT,
  nacionality INT
);

CREATE TABLE team_players (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  team_id INT,
  player_id INT
);

CREATE TABLE bet (
  bet_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid,
  match_id INT,
  team_id INT,
  bet_type_id uuid
);

CREATE TABLE bet_types (
  bet_type_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(30),
  description varchar(100)
);

CREATE TABLE user_balance (
  balance_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid,
  balance float
);

ALTER TABLE tournament_season ADD FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tournament_season ADD FOREIGN KEY (winner) REFERENCES teams(team_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE payment ADD FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bill ADD FOREIGN KEY (payment_id) REFERENCES payment (payment_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bill ADD FOREIGN KEY (bet_id) REFERENCES bet (bet_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE match ADD FOREIGN KEY (season_id) REFERENCES tournament_season (season_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE match_teams ADD FOREIGN KEY (team_id) REFERENCES teams (team_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE match_teams ADD FOREIGN KEY (match_id) REFERENCES match (match_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE team_players ADD FOREIGN KEY (team_id) REFERENCES teams (team_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE team_players ADD FOREIGN KEY (player_id) REFERENCES players (player_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bet ADD FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bet ADD FOREIGN KEY (match_id) REFERENCES match (match_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bet ADD FOREIGN KEY (bet_type_id) REFERENCES bet_types (bet_type_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE user_balance ADD FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
BEGIN
INSERT INTO user_roles(user_id, role_name) VALUES(NEW.user_id, 'CASUAL');
INSERT INTO user_balance(user_id, balance) VALUES(NEW.user_id, 0);
RETURN NEW;
END;
$$;

CREATE TRIGGER user_registered
AFTER INSERT
ON users
FOR EACH ROW
EXECUTE PROCEDURE new_user();
