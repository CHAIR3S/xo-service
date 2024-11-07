import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('event-visibility')
export class EventVisibility {
    
    @PrimaryGeneratedColumn({name: 'visibility_id'})
    id: number;

    @Column({name: 'visibility_name'})
    name: string;

}
