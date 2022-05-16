import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VoteStreamDto } from './dto/vote-stream.dto';

@WebSocketGateway()
export class VotesGateway {  

  @WebSocketServer()
  server;

  @SubscribeMessage('streamVote')
  voted(
    @MessageBody() voteStreamDto: VoteStreamDto
  ) {
    this.server.emit(`votedCountById=${voteStreamDto.candidateId}`, voteStreamDto)
  }

}
