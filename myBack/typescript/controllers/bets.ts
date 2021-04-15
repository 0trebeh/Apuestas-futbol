import {Request, Response, NextFunction} from 'express';
import {query, tokenController as jwt, dbController} from '../helpers';

export default class Bet {
  async create(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return next('Request with auth token missing received');
    }
    const client = await dbController.getClient();
    try {
      const {prediction, bet_type, ammount, match, team} = req.body;
      let results = await client.query(query.getBetTypeID, [bet_type]);
      await client.query('BEGIN');
      results = await client.query(query.insertBet, [
        payload.id,
        match,
        team,
        results.rows[0].id,
        prediction,
      ]);
      await client.query(query.insertBill, [results.rows[0].bet_id, ammount]);
      results = await client.query(query.currentBalance, [payload.id]);
      results = await client.query(query.updateBalance, [
        results.rows[0].balance - Number.parseFloat(ammount),
        payload.id,
      ]);
      await client.query('COMMIT');
      res.status(201).json({
        balance: results.rows[0].balance,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release(true);
    }
  }
  async Delete(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return next('Request with auth token missing received');
    }
    const client = await dbController.getClient();
    try {
      await client.query('BEGIN');
      const currBalance = await client.query(query.currentBalance, [
        payload.id,
      ]);
      const betAmmount = await client.query(query.getBetAmmount, [
        req.params.id,
      ]);
      const balance = await client.query(query.updateBalance, [
        currBalance.rows[0].balance + betAmmount.rows[0].ammount,
        payload.id,
      ]);
      await client.query(query.deleteBet, [req.params.id]);
      await client.query('COMMIT');
      res.status(200).json({
        balance: balance.rows[0].balance,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release(true);
    }
  }
}
