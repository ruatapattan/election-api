import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({unique: true})
    @Length(13,13)
    nationalId: string

    @Column()
    password: string
    

}
