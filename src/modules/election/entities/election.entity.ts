import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Election {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    enable: boolean
}
