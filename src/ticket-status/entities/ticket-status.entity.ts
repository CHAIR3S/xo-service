import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ticket-status')
export class TicketStatus {

    @PrimaryGeneratedColumn({name: 'status_id'})
    id: number;

    @Column({name: 'status_name'})
    name: string;

}
