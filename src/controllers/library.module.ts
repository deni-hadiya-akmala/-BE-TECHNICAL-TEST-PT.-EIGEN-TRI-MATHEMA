import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryController } from './library.controller';
import { LibraryService } from '../../application/services/library.service';
import { Member } from '../../domain/entities/member.entity';
import { Book } from '../../domain/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Book])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
