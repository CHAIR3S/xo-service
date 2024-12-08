import { EventPhoto } from "src/event-photo/entities/event-photo.entity";
import { EventVisibility } from "src/event-visibility/entities/event-visibility.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('event')
export class Event {

    @PrimaryColumn({ name: 'event_id', type: 'text' })
    id: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'time', name: 'start_time' })
    startTime: string;

    @Column({ type: 'time', name: 'end_time', nullable: true })
    endTime: string;

    @Column({ type: 'varchar', length: 255 })
    location: string;

    @Column({ type: 'int', name: 'max_guests', nullable: true })
    maxGuests: number;

    @ManyToOne(() => EventVisibility, visibility => visibility.id)
    @JoinColumn({ name: 'visibility_id' })
    visibility: EventVisibility;

    @Column({ type: 'varchar', length: 400, nullable: true })
    theme: string;

    @Column({ type: 'bytea', nullable: true })
    cover: Buffer;

    @Column({ type: 'varchar', name: 'image_format', length: 30, nullable: true})
    imageFormat: string

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, name: 'ticket_price' })
    ticketPrice: number;

    @Column({ type: 'boolean', default: false, name: 'allow_photo_upload' })
    allowPhotoUpload: boolean;

    @Column({ type: 'jsonb', nullable: true, name: 'security_options' })
    securityOptions: Record<string, any>;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'contact_info' })
    contactInfo: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Ticket, (ticket) => ticket.event)
    tickets: Ticket[];

    @OneToMany(() => EventPhoto, (eventPhoto) => eventPhoto.event)
    photos: EventPhoto[];
}