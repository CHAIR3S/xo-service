import { Role } from "src/role/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({name: 'user_id'})
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;
  
    @Column({ type: 'varchar', length: 400 })
    password: string;
  
    @Column({ type: 'varchar', nullable: true, name: 'profile_picture' })
    profilePicture: string;
  
    @ManyToOne(() => Role, role => role.id)
    @JoinColumn({name: 'role_id'})
    role: Role;
  
    @Column({ type: 'varchar', length: 6, nullable: true , name: 'verification_code'})
    verificationCode: string;
  
    @Column({ type: 'boolean', default: false , name: 'is_verified'})
    isVerified: boolean;

    @Column({type: 'varchar', length: 30, nullable: true, name: 'image_format'})
    imageFormat: string;

    @CreateDateColumn({ type: 'timestamp' , name: 'created_at'})
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

}