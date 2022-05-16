import { Test, TestingModule } from '@nestjs/testing';
import { VotesGateway } from './votes.gateway';

describe('VotesGateway', () => {
  let gateway: VotesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotesGateway],
    }).compile();

    gateway = module.get<VotesGateway>(VotesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

});
