import { forwardRef, ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Response } from 'express';
import { Connection, QueryRunner } from 'typeorm';
import { ElectionModule } from '../election/election.module';
import { ElectionService } from '../election/election.service';
import { VotesModule } from '../votes/votes.module';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.entity';
import { mockBody, mockCandidateRepoSaveValue, mockCreated, mockRemoved, mockUpdated } from './__mocks__/mockValues';

describe('CandidatesService', () => {
  let candidatesService: CandidatesService;
  let connection;

  

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

  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation(item => item),
  }

  const mockCandidateRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockImplementation(item => ({
        ...mockUpdated
      }))
    })) ,
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

  const mockElectionService = {
    create: jest.fn().mockImplementation(newCandidate => Promise.resolve({
      status: 'ok',
      enable: true
    })),
    getElectionStatus: jest.fn().mockImplementation(() => Promise.resolve({
      id: '5b7ce988-6280-4c0b-834c-d74c97bec34f',
      enable: false
    })),
    getResults: jest.fn().mockImplementation(() => Promise.resolve({}))

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockCandidateRepository,
        },
        {
          provide: ElectionService,
          useValue: mockElectionService
        },
        {
          provide: Connection,
          useClass: mockConnection
        }
      ],
    }).compile();

    candidatesService = module.get<CandidatesService>(CandidatesService)
    connection = await module.get<Connection>(Connection);
  });


  it('should be defined', () => {
    expect(candidatesService).toBeDefined();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let candidate
      let createCandidateDto: CreateCandidateDto = mockBody

      test('then it should return created candidate', async () => {
        candidate = await candidatesService.create(createCandidateDto, response as Response)
        expect(candidate).toEqual(mockCreated)
      })
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let candidate
      let updateCandidateDto: UpdateCandidateDto = mockBody
      let id = '2750763b-e46c-43b2-9ddd-7fcb604eb067'

      test('then it should return updated candidate', async () => {
        candidate = await candidatesService.update(id, updateCandidateDto, response as Response)
        expect(candidate).toEqual(mockUpdated)
      })
    })
  })

  describe('delete', () => {
    describe('when delete is called', () => {
      let candidate
      let id = '2750763b-e46c-43b2-9ddd-7fcb604eb067'

      test('then it should return updated candidate', async () => {
        candidate = await candidatesService.remove(id, response as Response)
        expect(candidate).toEqual(mockRemoved)
      })
    })
  })
});
