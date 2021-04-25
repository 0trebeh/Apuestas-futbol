import {dbController as db, query as queries} from '../helpers';
import {NextFunction, Request, Response} from 'express';
import {SeasonMatches} from './types/queryReturnTypes';
import {MatchInfo} from './types/operationTypes';

export default class Tournaments {
  private orderMatches(data: SeasonMatches[]): MatchInfo[] {
    let matches: MatchInfo[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i % 2 !== 0) {
        matches.push({
          match_id: data[i].match_id,
          date: data[i].date.toUTCString(),
          match_status: data[i].match_status,
          away_team_id: data[i - 1].team_id,
          away_team_name: data[i - 1].team_name,
          away_goals: data[i - 1].goals,
          home_goals: data[i].goals,
          away_status:
            data[i - 1].winner === undefined
              ? 'Indefinido'
              : data[i - 1].winner
              ? 'Ganador'
              : data[i - 1].draw
              ? 'Empate'
              : 'Perdedor',
          home_team_id: data[i].team_id,
          home_team_name: data[i].team_name,
          home_status:
            data[i].winner === undefined
              ? 'Indefinido'
              : data[i].winner
              ? 'Ganador'
              : data[i].draw
              ? 'Empate'
              : 'Perdedor',
        });
      }
    }
    return matches;
  }

  async getMatches(req: Request, res: Response, next: NextFunction) {
    const {tournament} = req.params;
    const client = await db.getClient();
    try {
      let trnmntName: string;
      switch (tournament) {
        case 'CL': {
          trnmntName = 'UEFA Champions League';
          break;
        }
        case 'WC': {
          trnmntName = 'World cup';
          break;
        }
        case 'PD': {
          trnmntName = 'Primera Division';
          break;
        }
        default: {
          throw new Error('An invalid tournament parameter was passed.');
        }
      }
      const lastestSeason = await client.query<{season_id: number}>(
        queries.lastestSeasonId,
        [trnmntName]
      );
      const seasonMatches = await client.query<SeasonMatches>(
        queries.tournamentMatches,
        [lastestSeason.rows[0].season_id]
      );
      res.status(200).json({
        matches: this.orderMatches(seasonMatches.rows),
      });
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

  async getPrediction(req: Request, res: Response, next: NextFunction) {
    const client = await db.getClient();
    try {
      const id = parseInt(req.params.id);
      const prediction = await client.query(queries.getPrediction, [id]);
      res.status(200).json(prediction.rows);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

  async getPredictionMatches(req: Request, res: Response, next: NextFunction) {
    const client = await db.getClient();
    try {
      const id = parseInt(req.params.id);
      const prediction = await client.query(queries.getPredictionMatches, [id]);

      let matches = [];
      for (let i = 0; i < prediction.rows.length; i++) {
        var result: string = "";
        if(prediction.rows[i].t1_winner){
          result = 'Ganador 1'
        }
        if(prediction.rows[i].t1_winner === null){
          result = 'Indefinido'
        }
        if(prediction.rows[i].draw){
          result = 'Empate'
        }
        if(prediction.rows[i].t2_winner){
          result = 'Ganador 2'
        }
        matches.push({
          name1: prediction.rows[i].name1,
          side1: prediction.rows[i].side1,
          tm1_winner: prediction.rows[i].tm1_winner,
          tm_draw: prediction.rows[i].tm_draw,
          tm2_winner: prediction.rows[i].tm2_winner,
          name2: prediction.rows[i].name2,
          side2: prediction.rows[i].side2,
          resultado: result,
          match_status: prediction.rows[i].match_status,
          date: prediction.rows[i].date.toUTCString(),
        });
      }

      res.status(200).json(matches);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }
}