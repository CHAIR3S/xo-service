import { Event } from "src/event/entities/event.entity";
import { TicketStatus } from "src/ticket-status/entities/ticket-status.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ticket')
export class Ticket {

    @PrimaryGeneratedColumn({ name: 'ticket_id', type: 'int' })
    id: number;

    @ManyToOne(() => Event, event => event.id)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 10 })
    code: string;

    @ManyToOne(() => TicketStatus, status => status.id)
    @JoinColumn({ name: 'status_id' })
    status: TicketStatus;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
}
