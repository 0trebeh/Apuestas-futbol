import axios, {AxiosResponse} from 'axios';
import {dbController as db, logger, query as queries} from '../../helpers';
import type {Country, Match, PlayersRequest, Season, Team} from './types';

axios.defaults.baseURL = 'https://api.football-data.org';
axios.defaults.headers = {'X-Auth-Token': process.env.SOCCER_API_TOKEN};

export default class ApiConnection {
  private tournamentParams(id: number, data: Season[]): any[] {
    let params = [];
    for (let i = 0; i < data.length; i++) {
      params.push(
        data[i].id,
        id,
        data[i].startDate,
        data[i].endDate,
        data[i].winner?.id
      );
    }
    return params;
  }

  async fetchSeasonData() {
    const champions = axios.get('/v2/competitions/CL');
    const worldCup = axios.get('/v2/competitions/WC');
    const laLiga = axios.get('/v2/competitions/PD');
    const client = await db.getClient();
    try {
      const results = await Promise.all([champions, worldCup, laLiga]);
      await client.query('BEGIN');
      await client.query(queries.deleteSeasons);
      let query = `${queries.insertSeason}VALUES${db.generateValues(
        results[0].data.seasons.length,
        5
      )}`;
      let params = this.tournamentParams(
        results[0].data.id,
        results[0].data.seasons
      );
      await client.query(query, params);
      query = `${queries.insertSeason}VALUES${db.generateValues(
        results[1].data.seasons.length,
        5
      )}`;
      params = this.tournamentParams(
        results[1].data.id,
        results[1].data.seasons
      );
      await client.query(query, params);
      query = `${queries.insertSeason}VALUES${db.generateValues(
        results[2].data.seasons.length,
        5
      )}`;
      params = this.tournamentParams(
        results[2].data.id,
        results[2].data.seasons
      );
      await client.query(query, params);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  private matchParams(data: Match[]): any[] {
    let params = [];
    for (let i = 0; i < data.length; i++) {
      params.push(
        data[i].id,
        data[i].season.id,
        data[i].utcDate,
        data[i].status
      );
    }
    return params;
  }

  async fetchMatchData() {
    const client = await db.getClient();
    try {
      const responses = await Promise.all([
        axios.get('/v2/competitions/CL/matches'),
        axios.get('/v2/competitions/WC/matches'),
        axios.get('/v2/competitions/PD/matches'),
      ]);
      const matches = [
        ...responses[0].data.matches,
        ...responses[1].data.matches,
        ...responses[2].data.matches,
      ];
      let query = `${queries.insertMatch}${db.generateValues(
        matches.length,
        4
      )}`;
      let params = this.matchParams(matches);
      await client.query('BEGIN');
      await client.query(query, params);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  private playerParams(data: PlayersRequest): any[] {
    let params: any[] = [];
    for (let i = 0; i < data.squad.length; i++) {
      params.push(
        data.squad[i].id,
        data.squad[i].name,
        data.squad[i].dateOfBirth,
        data.squad[i].position,
        data.squad[i].shirtNumber,
        data.squad[i].countryOfBirth,
        data.squad[i].nacionality
      );
    }
    return params;
  }

  private playerTeamParams(team_id: number, data: {player_id: number}[]) {
    let params = [];
    for (let i = 0; i < data.length; i++) {
      params.push(team_id, data[i].player_id);
    }
    return params;
  }

  async insertPlayers(data: AxiosResponse<PlayersRequest>, team_id: number) {
    if (data.data.squad.length === 0) {
      return;
    }
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      let params = this.playerParams(data.data);
      let query = `${queries.insertPlayers}${db.generateValues(
        data.data.squad.length,
        7
      )} RETURNING player_id`;
      const player_id = await client.query(query, params);
      query = `${queries.insertTeamPlayer}${db.generateValues(
        player_id.rowCount,
        2
      )}`;
      params = this.playerTeamParams(team_id, player_id.rows);
      await client.query(query, params);
      await client.query('COMMIT');
    } catch (err) {
      logger.logger.error(err);
      await client.query('ROLLBACK');
    } finally {
      client.release(true);
    }
  }

  async fetchPlayersData() {
    const client = await db.getClient();
    try {
      const requests = await Promise.all([
        axios.get('/v2/competitions/CL/teams'),
        axios.get('/v2/competitions/WC/teams'),
        axios.get('/v2/competitions/PD/teams'),
      ]);
      const teams: Team[] = [
        ...requests[0].data.teams,
        ...requests[1].data.teams,
        ...requests[2].data.teams,
      ];
      for (let i = 0; i < teams.length; i++) {
        setTimeout(
          async (id: number) => {
            const response = await axios.get(`/v2/teams/${id}`);
            this.insertPlayers(response, id);
          },
          30000 * (i + 1),
          teams[i].id
        );
      }
    } catch (err) {
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  private teamsParams(data: Team[]): any[] {
    let params = [];
    for (let i = 0; i < data.length; i++) {
      params.push(
        data[i].id,
        data[i].name,
        data[i].area.id,
        data[i].clubColors,
        data[i].address,
        data[i].phone,
        data[i].website,
        data[i].email
      );
    }
    return params;
  }

  async fetchTeamsData() {
    const client = await db.getClient();
    let areas = [];
    try {
      const countries = await client.query(queries.getCountries);
      for (let i = 0; i < countries.rowCount; i++) {
        areas.push(countries.rows[i].id);
      }
      const response = await axios(`/v2/teams?areas=${areas.toString()}`);
      const params = this.teamsParams(response.data.teams);
      const query = `${queries.inserTeams}VALUES${db.generateValues(
        response.data.teams.length,
        8
      )}`;
      await client.query('BEGIN');
      await client.query(query, params);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  private countryParams(data: Country[]): any[] {
    let params = [];
    for (let i = 0; i < data.length; i++) {
      params.push(data[i].id, data[i].name, data[i].countryCode);
    }
    return params;
  }

  async fetchCountryData() {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(queries.deleteCountries);
      const response = await axios.get('/v2/areas');
      const params = this.countryParams(response.data.areas);
      const query = `${queries.inserCountries}${db.generateValues(
        response.data.areas.length,
        3
      )}`;
      await client.query(query, params);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  private async updateMatches() {
    const client = await db.getClient();
    try {
      const responses = await Promise.all([
        axios.get('/v2/competitions/CL/matches'),
        axios.get('/v2/competitions/WC/matches'),
        axios.get('/v2/competitions/PD/matches'),
      ]);
      const matches: Match[] = [
        ...responses[0].data.matches,
        ...responses[1].data.matches,
        ...responses[2].data.matches,
      ];
      await client.query('BEGIN');
      const savedMatches = await client.query(queries.filterMatchByStatus, [
        'FINISHED',
      ]);
      let match: Match;
      for (let i = 0; i < savedMatches.rowCount; i++) {
        match = matches.filter(
          value => value.id === savedMatches.rows[i].match_id
        )[0];
        if (match.status === savedMatches.rows[i].playing) {
          continue;
        }
        await client.query(queries.updateMatchStatus, [match.status, match.id]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      logger.logger.error(err);
    } finally {
      client.release(true);
    }
  }

  async fetchCycle() {
    setInterval(() => {
      this.updateMatches();
    }, 900000);
  }
}
