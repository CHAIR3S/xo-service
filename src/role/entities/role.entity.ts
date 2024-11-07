import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('role')
export class Role {

    @PrimaryGeneratedColumn({name: 'role_id'})
    id: number;

    @Column({name: 'role_name'})
    name: string

}
