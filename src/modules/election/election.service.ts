import {
  forwardRef,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import handleErrorUtils from '../../ultilities/handleError.utils';
import { Connection, Repository } from 'typeorm';
import { CandidatesService } from '../candidates/candidates.service';
import { ToggleElectionDto } from './dto/toggle-election.dto';
import { Election } from './entities/election.entity';
import * as fs from 'fs';
import { VotesService } from '../votes/votes.service';
var Json2csvParser = require('json2csv').Parser;

@Injectable()
export class ElectionService {
  constructor(
    private connection: Connection,
    @InjectRepository(Election)
    private electionRepository: Repository<Election>,
    @Inject(forwardRef(() => CandidatesService))
    private readonly candidateService: CandidatesService,
    @Inject(forwardRef(() => VotesService))
    private readonly votesService: VotesService,
  ) {}

  async create(toggleElectionDto: ToggleElectionDto) {
    const status = await this.getElectionStatus();
    let newStatus: Election;

    if (status) {
      newStatus = await this.electionRepository.save({
        id: status.id,
        ...toggleElectionDto,
      });
    } else {
      newStatus = await this.electionRepository.save(toggleElectionDto);
    }
    return {
      status: 'ok',
      enable: !!newStatus.enable,
    };
  }

  async getElectionStatus() {
    return await this.electionRepository.findOne();
  }

  async getResults(res: Response) {
    const dbConnection = await this.connection;
    const manager = dbConnection.manager;

    try {
      const totalVotes = manager
        .createQueryBuilder()
        .select([`SUM(vt.votedCount) AS total_votes`])
        .from('vote', 'vt');

      const result = await manager
        .createQueryBuilder()
        .select([
          'cdd.id AS id',
          'cdd.name AS name',
          'cdd.dob AS dob',
          'cdd.bio_link AS bioLink',
          'cdd.image_link AS imageLink',
          'cdd.policy AS policy',
          'vt.voted_count AS votedCount',
          'CONCAT(ROUND(vt.voted_count / total_vt.total_votes * 100), "%") AS percentage',
        ])
        .from('candidate', 'cdd')
        .leftJoin('vote', 'vt', 'vt.candidate_id = cdd.id')
        .innerJoin(`(${totalVotes.getQuery()})`, 'total_vt')
        .where(`cdd.deleted_at IS NULL`)
        .getRawMany();

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log('err', error);
      return await handleErrorUtils.handleError(error, res);
    }
  }

  async exportCsv(res: Response) {
    try {
      let voterData = await this.votesService.getVoterData()

      if (voterData.length < 1) {
        voterData = [
          {
            "Candidate id": 'no data',
            "National id": 'no data'
          }
        ];
      }

      const fileName = 'election-result.csv';

      const csvFields = ['Candidate id', 'National id'];
      const json2csvParser = new Json2csvParser({ csvFields });
      const csv = json2csvParser.parse(voterData);

      fs.writeFile(`export-csv/${fileName}`, csv, (error) => {
        if (error) {
          console.log('error', error);
          throw {
            name: 'InternalServerError',
            message: 'Error exporting .csv file',
          };
        } else {
          res.download(`./export-csv/${fileName}`, fileName, (error) => {
            //delete csv file after downloading
            fs.unlinkSync(`./export-csv/${fileName}`);
            if (error) {
              throw {
                name: 'InternalServerError',
                message: 'Error downloading .csv file',
              };
            }
          });
        }
      });
    } catch (error) {
      console.log('err', error);
      return await handleErrorUtils.handleError(error, res);
    }
  }
}
