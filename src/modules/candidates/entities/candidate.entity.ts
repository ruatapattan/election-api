import { Voter as VoterEntity } from "../../votes/entities/voter.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255})
  name: string;

  @Column()
  dob: string;

  @Column()
  bioLink: string;
  
  @Column()
  imageLink: string;
  
  @Column()
  policy: string;

  @CreateDateColumn()
  createdAt: Timestamp

  @UpdateDateColumn()
  updatedAt: Timestamp

  @DeleteDateColumn()
  deletedAt: Timestamp

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => VoterEntity, (voter) => voter.candidate)
  voters: VoterEntity[]

}
