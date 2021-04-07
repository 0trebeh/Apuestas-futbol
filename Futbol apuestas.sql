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

CREATE TABLE user_roles (
  role_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid,
  role_name varchar(30)
);

CREATE TABLE country (
  country_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(30),
  code varchar(30)
);

CREATE TABLE tournament_locations (
  location_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  country_id uuid,
  tournament_id uuid
);

CREATE TABLE tournament (
  tournament_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(30),
  start_date timestamp,
  end_date timestamp
);

CREATE TABLE match (
  match_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  tournament_id uuid,
  work_day_id uuid,
  date timestamp,
  playing boolean,
  duration float,
  extension boolean
);

CREATE TABLE match_teams (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  team_id uuid,
  match_id uuid,
  goals integer,
  winner boolean,
  loser boolean,
  draw boolean
);

CREATE TABLE teams (
  team_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(30),
  country_id uuid,
  foundation timestamp,
  colors varchar(30),
  address varchar(30),
  phone varchar(30),
  website varchar(30),
  email varchar(100)
);

CREATE TABLE players (
  player_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name varchar(50),
  birth_date timestamp,
  positopm varchar(30),
  number integer,
  birth_country_id uuid,
  nacionality uuid
);

CREATE TABLE team_players (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  team_id uuid,
  player_id uuid
);

CREATE TABLE bet (
  bet_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid,
  match_id uuid,
  team_id uuid,
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

ALTER TABLE payment ADD FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bill ADD FOREIGN KEY (payment_id) REFERENCES payment (payment_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE bill ADD FOREIGN KEY (bet_id) REFERENCES bet (bet_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE user_roles ADD FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE tournament_locations ADD FOREIGN KEY (country_id) REFERENCES country (country_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE tournament_locations ADD FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE match ADD FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON UPDATE CASCADE ON DELETE CASCADE;

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

CREATE OR REPLACE FUNCTION role_upgrade()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE actual_role user_roles.role_name%type
BEGIN
SELECT role_name INTO actual_role FROM user_roles WHERE user_id = NEW.user_id;
IF actual_role = 'CASUAL' THEN
UPDATE TABLE user_roles SET role_name = 'BETTOR' WHERE user_id = NEW.user_id;
END IF;
RETURN NEW;
END;
$$;

CREATE TRIGGER user_balance_changed
AFTER UPDATE
ON user_balance
FOR EACH ROW
EXECUTE PROCEDURE role_upgrade();
