import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { mockCandidateRepoSaveValue } from '../candidates/__mocks__/mockValues';
import { ElectionService } from '../election/election.service';
import { Vote } from './entities/vote.entity';
import { Voter } from './entities/voter.entity';
import { VotesGateway } from './votes.gateway';
import { VotesService } from './votes.service';

describe('VotesService', () => {
  let votesService: VotesService;
  let electionService: ElectionService;
  let connection
  const mockVotesRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockImplementation(item => ({}))
    })) ,
  }
  const mockVotersRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockImplementation(item => ({}))
    })) ,
  }

  const mockElectionService = {
    create: jest.fn().mockImplementation(newCandidate => Promise.resolve({
      status: 'ok',
      enable: true
    })),
    getElectionStatus: jest.fn().mockImplementation(() => Promise.resolve({
      id: '5b7ce988-6280-4c0b-834c-d74c97bec34f',
      enable: false
    })),
  }

  class mockConnection {
    createQueryRunner(): QueryRunner {
      const qr = {
        manager: {
          
        },
      } as QueryRunner;
      qr.manager;
      Object.assign(qr.manager, {
        save: jest.fn().mockReturnValue(mockCandidateRepoSaveValue)
      });
      qr.connect = jest.fn();
      qr.release = jest.fn();
      qr.startTransaction = jest.fn();
      qr.commitTransaction = jest.fn();
      qr.rollbackTransaction = jest.fn();
      qr.release = jest.fn();
      return qr;
    }
}

const mockVotesGatewawy = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVotesRepository,
        },
        {
          provide: getRepositoryToken(Voter),
          useValue: mockVotersRepository,
        },
        {
          provide: ElectionService,
          useValue: mockElectionService
        },
        {
          provide: Connection,
          useClass: mockConnection
        },
        {
          provide: VotesGateway,
          useValue: mockVotesGatewawy
        },
        
      ],
    }).compile();

    votesService = module.get<VotesService>(VotesService);
    electionService = module.get<ElectionService>(ElectionService);
  });

  it('should be defined', () => {
    expect(votesService).toBeDefined();
  });
});
