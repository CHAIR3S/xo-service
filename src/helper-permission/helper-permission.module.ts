import { Module } from '@nestjs/common';
import { HelperPermissionService } from './helper-permission.service';
import { HelperPermissionController } from './helper-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperPermission } from './entities/helper-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HelperPermission])],
  controllers: [HelperPermissionController],
  providers: [HelperPermissionService],
})
export class HelperPermissionModule {}
