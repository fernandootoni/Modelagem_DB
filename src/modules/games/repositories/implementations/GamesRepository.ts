import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where('lower(games.title) like :title ', { title: `%${param.toLowerCase()}%` })
      .getMany()

    return games
  }// Complete usando query builder

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `SELECT count(*) FROM games;`
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .relation(Game, 'users')
      .of(id)
      .loadMany()
      

    if(!users){
      throw new Error("No game found")
    }

    return users
  }
}
