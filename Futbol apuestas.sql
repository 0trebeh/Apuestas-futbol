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
  draw boolean,
  side varchar
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

CREATE OR REPLACE FUNCTION winner_count(
  p_match_id INT
) RETURN INT
LANGUAGE PLPGSQL
AS
$$
BEGIN
  
END;
$$;

CREATE OR REPLACE PROCEDURE wire_money(
    p_match_id VARCHAR,
    p_user_id VARCHAR,
    p_bet_type VARCHAR,
    p_prediction VARCHAR,
    p_ammout FLOAT
  ) LANGUAGE PLPGSQL AS $$
DECLARE winners user_bet %rowtype;
bet_pool user_bet %rowtype;
curr_balance user_balance %rowtype;
BEGIN
  SELECT balance FROM user_balance INTO curr_balance
  WHERE user_id = p_user_id;
  IF p_bet_type = '1' THEN
    SELECT SUM(ammount) FROM user_bet INTO bet_pool
    WHERE match_id = p_match_id AND bet_type_name = '1' OR bet_type_name = '2'
    OR bet_type_name = 'X';

    SELECT COUNT(*) FROM user_bet INTO winners
    WHERE bet_type_name = '1'
    AND side = 'HOME_TEAM'
    AND match_id = p_match_id;

    UPDATE user_balance SET balance = curr_balance + p_ammout + (bet_pool.sum / winners.count)
    WHERE user_id = p_user_id;
  ELSIF p_bet_type = '2' THEN
    SELECT SUM(ammount) FROM user_bet INTO bet_pool
    WHERE match_id = p_match_id AND bet_type_name = '1' OR bet_type_name = '2'
    OR bet_type_name = 'X';

    SELECT COUNT(*) FROM user_bet INTO winners
    WHERE bet_type_name = '2'
    AND side = 'AWAY_TEAM'
    AND match_id = p_match_id;

    UPDATE user_balance SET balance = curr_balance + p_ammout + (bet_pool.sum / winners.count)
    WHERE user_id = p_user_id;
  ELSIF p_bet_type = 'X' THEN
    SELECT SUM(ammount) FROM user_bet INTO bet_pool
    WHERE match_id = p_match_id AND bet_type_name = '1' OR bet_type_name = '2'
    OR bet_type_name = 'X';

    SELECT COUNT(*) FROM user_bet INTO winners
    WHERE bet_type_name = 'X'
    AND match_id = p_match_id;

    UPDATE user_balance SET balance = curr_balance + p_ammout + (bet_pool.sum / winners.count)
    WHERE user_id = p_match_id;
  ELSIF p_bet_type = 'CORRECT SCORE' THEN
    SELECT SUM(ammount) FROM user_bet INTO bet_pool
    WHERE match_id = p_match_id AND bet_type_name = 'CORRECT SCORE';

    SELECT COUNT(*) FROM user_bet INTO winners
    WHERE 
  END IF;
  COMMIT;
  EXCEPTION
    WHEN OTHERS THEN RAISE NOTICE 'Error wiring money to user %. There was an exception',
      p_user_id;
      RAISE NOTICE '% %', SQLERRM, SQLSTATE;
  ROLLBACK;
END;
$$;

CREATE OR REPLACE FUNCTION update_bet() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
DECLARE 
  bet record;
  away_goals INT;
  prediction_home_goals INT;
  prediction_away_goals INT;
  home_goals bet_match_teams%rowtype;
  away_goals bet_match_teams%rowtype;
BEGIN 
  FOR bet IN SELECT * FROM user_bet
  WHERE match_id = NEW.match_id;

  LOOP 
    IF bet.bet_type_name = '1' THEN 
      IF bet.side = 'HOME_TEAM' AND bet.winner = true THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSIF bet.bet_type_name = 'X' AND bet.draw = true THEN 
      CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
    ELSIF bet.bet_type_name '2' THEN 
      IF bet.side = 'AWAY_TEAM' AND bet.winner = true THEN 
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSIF bet.bet_type_name = '1X' THEN 
      IF bet.side = 'HOME_TEAM' AND bet.winner = true THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      ELSIF bet.draw = true THEN 
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSIF bet.bet_type_name = 'X2' THEN
      IF bet.side = 'AWAY_TEAM' AND bet.winner = true THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      ELSIF bet.draw = true THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSIF bet.bet_type_name = 'CORRECT SCORE' THEN
      SELECT goals FROM bet_match_teams INTO home_goals
      WHERE match_id = NEW.match_id AND side = 'HOME_TEAM';

      SELECT goals FROM bet_match_teams INTO away_goals
      WHERE match_id = NEW.match_id AND side = 'AWAY_TEAM';

      SELECT LEFT(bet.prediction, 1) INTO prediction_home_goals::INT;

      SELECT RIGHT(bet.prediction, 1) INTO prediction_away_goals::INT;

      IF away_goals.goals = prediction_away_goals AND home_goals.goals = prediction_home_goals THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSE IF bet.bet_type_name = 'under' THEN
      SELECT goals FROM bet_match_teams INTO home_goals
      WHERE match_id = NEW.match_id AND side = 'HOME_TEAM';

      SELECT goals FROM bet_match_teams INTO away_goals
      WHERE match_id = NEW.match_id AND side = 'AWAY_TEAM';

      IF home_goals.goals + away_goals.goals > bet.prediction::INT THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    ELSE IF bet.bet_type_name = 'over' THEN
      SELECT goals FROM bet_match_teams INTO home_goals
      WHERE match_id = NEW.match_id AND side = 'HOME_TEAM';

      SELECT goals FROM bet_match_teams INTO away_goals
      WHERE match_id = NEW.match_id AND side = 'AWAY_TEAM';

      IF home_goals.goals + away_goals.goals < bet.prediction::INT THEN
        CALL wire_money(NEW.match_id, bet.user_id, bet.bet_type_name, '', bet.ammount);
      END IF;
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER match_updated
AFTER
UPDATE ON match FOR EACH ROW EXECUTE PROCEDURE update_bet();

CREATE VIEW user_bet AS
SELECT
  m.match_id,
  mt.winner,
  mt.loser,
  mt.draw,
  mt.side,
  b.bet_id,
  b.user_id,
  b.team_id,
  b.prediction,
  bt.name,
  bl.ammount AS bet_type_name,
FROM bet b
  INNER JOIN match m USING(match_id)
  INNER JOIN match_teams mt ON mt.team_id = b.team_id
  INNER JOIN bet_types bt ON b.bet_type_id = bt.bet_type_id
  INNER JOIN bill bl ON bl.bet_id = b.bet_id;

CREATE VIEW bet_match_teams AS
SELECT
  b.bet_id,
  mt.team_id,
  mt.goals,
  b.match_id,
  mt.side
FROM bet b
  INNER JOIN match_teams mt USING(match_id);
