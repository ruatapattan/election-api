import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ToggleElectionDto } from './dto/toggle-election.dto'
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  //check voter's status
  @Post()
  @UseGuards(JwtAuthGuard)
  async checkStatus() {
    return await this.electionService.getElectionStatus();
  }

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  async create(@Body() toggleElectionDto: ToggleElectionDto) {
    return await this.electionService.create(toggleElectionDto);
  }

  @Get('result')
  @UseGuards(JwtAuthGuard)
  async getElectionResult(@Res() res: Response) {
    return await this.electionService.getResults(res);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async getExportedCsv(@Res() res: Response) {
    return await this.electionService.exportCsv(res)
  }

}
