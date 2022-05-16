import { Length } from "class-validator";
import { Candidate as CandidateEntity } from "../../candidates/entities/candidate.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voter {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Length(13,13)
    nationalId: string

    @ManyToOne(() => CandidateEntity, candidate => candidate.voters)
    @JoinColumn({ name: 'voted_for_candidate_id', referencedColumnName: 'id' })
    candidate: CandidateEntity

}
