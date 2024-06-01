// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './domain/entities/member.entity';
import { Book } from './domain/entities/book.entity';
import { LibraryModule } from './infrastructure/controllers/library.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',  // Ganti dengan username PostgreSQL Anda
      password: '',  // Ganti dengan password PostgreSQL Anda
      database: 'library_ts_db',        // Ganti dengan nama database PostgreSQL Anda
      entities: [Member, Book],
      synchronize: true,
    }),
    LibraryModule,
  ],
})
export class AppModule {}

