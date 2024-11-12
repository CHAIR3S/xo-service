import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/users/entities/user.entity";

@Entity('event_photo')
export class EventPhoto {

    @PrimaryGeneratedColumn({ name: 'photo_id' })
    id: number;

    @ManyToOne(() => Event, event => event.id)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'uploaded_by' })
    uploadedBy: User;

    @Column({ type: 'bytea' })
    photo: Buffer;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
}
