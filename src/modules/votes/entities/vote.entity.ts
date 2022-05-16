import { Candidate as CandidateEntity} from "../../candidates/entities/candidate.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Voter as VoterEntity } from "./voter.entity";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @Column({type: 'integer', default: 0})
    votedCount: number

    @OneToOne(() => CandidateEntity)
    @JoinColumn()
    candidate: CandidateEntity

}
