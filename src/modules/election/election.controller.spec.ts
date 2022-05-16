import { Test, TestingModule } from '@nestjs/testing';
import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';

jest.mock('./election.service')

describe('ElectionController', () => {
  let controller: ElectionController;
  let service: ElectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectionController],
      providers: [ElectionService],
    }).compile();

    controller = module.get<ElectionController>(ElectionController);
    service = module.get<ElectionService>(ElectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
