import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { HelperPermission } from "src/helper-permission/entities/helper-permission.entity";

@Entity('helper')
export class Helper {

    @PrimaryGeneratedColumn({ name: 'helper_id' })
    id: number;

    @ManyToOne(() => Event, event => event.id)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => HelperPermission, permission => permission.id)
    @JoinColumn({ name: 'permission_id' })
    permission: HelperPermission;
}
