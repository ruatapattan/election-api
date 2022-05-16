import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.entity';
import { mockCreated, mockFoundAll, mockFoundOne, mockBody, mockUpdated, mockRemoved } from './__mocks__/mockValues';

jest.mock('./candidates.service')


describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;
  
  const response = {
    json: (body?: any) => {  },
    status: (code: number) => response,
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [CandidatesService],
    })
    .compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let candidate

      beforeEach(async() => {
        candidate = await controller.findOne('9cbce4ab-ae91-4191-85ad-0dfffd728a1d')
      })

      test('then it should call candidatesService', () => {
        expect(service.findOne).toHaveBeenCalledWith('9cbce4ab-ae91-4191-85ad-0dfffd728a1d')
      })

      test('then it should return found candidate', () => {
        expect(candidate).toEqual(mockFoundOne)
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let candidates: any[]

      beforeEach(async() => {
        candidates = await controller.findAll()
      })

      test('then it should call candidatesService', () => {
        expect(service.findAll).toHaveBeenCalledWith()
      })

      test('then it should return found candidates', () => {
        expect(candidates).toEqual(mockFoundAll)
      })
    })
  })

  describe('create', () => {
    describe('when create is called', () => {
      let candidate
      let createCandidateDto: CreateCandidateDto = mockBody
      let uuid = '73ca4916-0512-40eb-8dfb-e120ae784587'
      
      beforeEach(async() => {
        candidate = await controller.create(createCandidateDto, response as Response)
      })

      test('then it should call candidatesService', () => {
        expect(service.create).toHaveBeenCalledWith(createCandidateDto, response)
      })

      test('then it should return created candidate', () => {
        expect({
          // id: uuid,
          ...candidate,
          // votedCount: 0
        }).toEqual(mockCreated)
      })
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let candidate
      let updateCandidateDto: UpdateCandidateDto = mockBody
      let uuid = '73ca4916-0512-40eb-8dfb-e120ae784587'


      beforeEach(async() => {
        candidate = await controller.update(uuid, updateCandidateDto, response as Response)
      })

      test('then it should call candidatesService', () => {
        expect(service.update).toHaveBeenCalledWith(uuid
        , updateCandidateDto, response)
      })

      test('then it should return updated candidate', () => {
        expect({
          ...candidate,
        }).toEqual(mockUpdated)
      })
    })
  })

  describe('delete success', () => {
    describe('when delete is called', () => {
      let deleted
      let uuid = '73ca4916-0512-40eb-8dfb-e120ae784587'


      beforeEach(async() => {
        deleted = await controller.remove(uuid, response as Response)
      })

      test('then it should call candidatesService', () => {
        expect(service.remove).toHaveBeenCalledWith(uuid
        , response)
      })

      test('then it should return success', () => {
        expect({
          ...deleted,
        }).toEqual(mockRemoved)
      })
    })
  })
  
});
