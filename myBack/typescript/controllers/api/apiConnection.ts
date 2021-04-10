import axios from 'axios';
import {dbController as db, logger, query as queries} from '../../helpers';

axios.defaults.baseURL = 'https://api.football-data.org';
axios.defaults.headers = {'X-Auth-Token': process.env.SOCCER_API_TOKEN};

type Season = {
  id: number;
  startDate: string;
  endDate: string;
  winner:
    | {
        id: number;
      }
    | undefined;
};

type Country = {
  id: number;
  name: string;
  countryCode: string;
};

type Team = {
  id: number;
  area: {
    id: number;
  };
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  clubColors: string;
};
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

  async fetchMatchData() {}

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

  async fetchCycle() {
    await this.fetchCountryData();
    await this.fetchSeasonData();
    await this.fetchTeamsData();
    await this.fetchMatchData();
    setInterval(() => {
      this.fetchTeamsData();
    }, 86400000);
    setInterval(() => {
      this.fetchMatchData();
    }, 3600000);
  }
}
