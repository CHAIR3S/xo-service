import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventVisibilityModule } from './event-visibility/event-visibility.module';
import { TicketStatusModule } from './ticket-status/ticket-status.module';
import { HelperPermissionModule } from './helper-permission/helper-permission.module';
import { UsersModule } from './users/users.module';
import { EventModule } from './event/event.module';
import { TicketModule } from './ticket/ticket.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    RoleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Luischaip12',
      database: 'postgres',
      schema: 'xo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    EventVisibilityModule,
    TicketStatusModule,
    HelperPermissionModule,
    UsersModule,
    EventModule,
    TicketModule,
    HelperModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
