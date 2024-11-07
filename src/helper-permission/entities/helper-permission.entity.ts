import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('helper-permission')
export class HelperPermission {    

    @PrimaryGeneratedColumn({name: 'permission_id'})
    id: number;

    @Column({name: 'permission_name'})
    name: string;
}
