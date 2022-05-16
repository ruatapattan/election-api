import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { CandidatesService } from '../candidates/candidates.service';
import { mockCandidateRepoSaveValue, mockUpdated } from '../candidates/__mocks__/mockValues';
import { VotesService } from '../votes/votes.service';
import { ElectionService } from './election.service';
import { Election } from './entities/election.entity';

describe('ElectionService', () => {
  let electionService: ElectionService;
  let candidatesService: CandidatesService
  let votesService: VotesService
  let connection

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

const mockElectionRepository = {
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockImplementation(item => ({}))
  })) 
}
const mockCandidatesService = {
  findOne: jest.fn().mockImplementation(newCandidate => ({
    id: "2750763b-e46c-43b2-9ddd-7fcb604eb067",
    name: "LINE BrownRE",
    dob: "August 8, 2011",
    bioLink: "<https://line.fandom.com/wiki/Brown>",
    imageLink: "<https://static.wikia.nocookie.net/line/images/b/bb/2015-brown.png/revision/latest/scale-to-width-down/700?cb=20150808131630>",
    policy: "Lorem Ipsum is simply dummy text of the printing and typesetting indust ry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown",
    votedCount: 3
  })),
  update: jest.fn().mockImplementation(newCandidate => ({
    affected: 1,
    generatedMaps: [],
    raw: undefined
  })),
  softDelete: jest.fn().mockImplementation(newCandidate => ({
    affected: 1,
    generatedMaps: [],
    raw: undefined
  })),
}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectionService,
        {
          provide: getRepositoryToken(Election),
          useValue: mockElectionRepository,
        },
        {
          provide: Connection,
          useClass: mockConnection
        },
        {
          provide: VotesService,
          useValue: mockCandidatesService
        },
        {
          provide: CandidatesService,
          useValue: mockCandidatesService
        },
      ],
    }).compile();

    electionService = module.get<ElectionService>(ElectionService);
    candidatesService = module.get<CandidatesService>(CandidatesService)
    votesService = module.get<VotesService>(VotesService)

  });

  it('should be defined', () => {
    expect(electionService).toBeDefined();
  });
});
