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
import { EventPhotoModule } from './event-photo/event-photo.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './role/role.guard';
import { SeedModule } from 'src/seeds/seed.module';

@Module({
  imports: [
    RoleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:TSkabUlFpQxBEngQMuMyvgUjAwZsRXbb@junction.proxy.rlwy.net:42144/railway',
      ssl: {
        rejectUnauthorized: false, 
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true, 
    }),
    EventVisibilityModule,
    TicketStatusModule,
    HelperPermissionModule,
    UsersModule,
    EventModule,
    TicketModule,
    HelperModule,
    EventPhotoModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
