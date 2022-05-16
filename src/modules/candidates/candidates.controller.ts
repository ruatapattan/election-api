import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { VotesGateway } from '../votes/votes.gateway';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCandidateDto: CreateCandidateDto, @Res() res: Response) {
    return await this.candidatesService.create(createCandidateDto, res);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.candidatesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.candidatesService.findOne(id) || {status: 'User not found'};
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto, @Res() res: Response) {
    return await this.candidatesService.update(id, updateCandidateDto, res);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {
    return await this.candidatesService.remove(id, res);
  }
}
