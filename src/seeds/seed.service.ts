import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperPermission } from 'src/helper-permission/entities/helper-permission.entity';
import { Role } from 'src/role/entities/role.entity'; 
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EventVisibility } from '../event-visibility/entities/event-visibility.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(TicketStatus)
    private readonly ticketStatusRepository: Repository<TicketStatus>,
    @InjectRepository(HelperPermission)
    private readonly helperPermissionRepository: Repository<HelperPermission>,
    @InjectRepository(EventVisibility)
    private readonly eventVisibilityRepository: Repository<EventVisibility>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const roles = ['ADMIN', 'USER', 'CREATOR'];

    for (const roleName of roles) {
      const roleExists = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!roleExists) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
    }

    const statuses = ['CREATED', 'REDEEMED', 'BLOCKED'];

    for (const statusName of statuses) {
      const statusExists = await this.ticketStatusRepository.findOne({ where: { name: statusName } });
      if (!statusExists) {
        const status = this.ticketStatusRepository.create({ name: statusName });
        await this.ticketStatusRepository.save(status);
      }
    }

    const permissions = ['READ', 'WRITE'];

    for (const permissionName of permissions) {
      const permissionExists = await this.helperPermissionRepository.findOne({ where: { name: permissionName } });
      if (!permissionExists) {
        const permission = this.helperPermissionRepository.create({ name: permissionName });
        await this.helperPermissionRepository.save(permission);
      }
    }


    const eventVisibilities = ['PUBLIC', 'PRIVATE'];

    for (const visibilityName of eventVisibilities) {
      const visibilityExists = await this.eventVisibilityRepository.findOne({ where: { name: visibilityName } });
      if (!visibilityExists) {
        const visibility = this.eventVisibilityRepository.create({ name: visibilityName });
        await this.eventVisibilityRepository.save(visibility);
        console.log(`Visibilidad de evento ${visibilityName} creada`);
      }
    }


    const adminEmail = 'admin@xoevent.com';
    const userExists = await this.usersService.findOneByEmail(adminEmail);

    if (!userExists) {
      const adminRole = await this.roleRepository.findOne({ where: { name: 'ADMIN' } });

      const createUserDto = {
        name: 'xo-admin',
        username: 'xo',
        email: adminEmail,
        password: '12345', 
        profilePicture: null,
        roleId: adminRole.id,
        verificationCode: null,
        isVerified: true,
      };

      await this.usersService.create(createUserDto);
      console.log('Usuario administrador creado');
    } else {
      console.log('El usuario administrador ya existe');
    }
  }
}
