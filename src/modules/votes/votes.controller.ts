import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoterDto } from './dto/voter.dto';
import { VotesService } from './votes.service';

@Controller('vote')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async vote(@Body() createVoteDto: CreateVoteDto, @Res() res: Response) {
    return await this.votesService.voteForCandidate(createVoteDto, res);
  }

  @Post('status')
  @UseGuards(JwtAuthGuard)
  async checkVoterStatus(@Body() voterDto: VoterDto, @Res() res: Response) {
      return await this.votesService.checkIfVoted(voterDto, res);
  }

}
