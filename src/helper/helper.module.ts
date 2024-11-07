import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { Helper } from './entities/helper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperPermission } from 'src/helper-permission/entities/helper-permission.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Helper, User, Event, HelperPermission])],
  controllers: [HelperController],
  providers: [HelperService],
})
export class HelperModule {}
