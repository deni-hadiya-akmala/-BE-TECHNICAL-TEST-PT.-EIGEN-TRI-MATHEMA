import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Book, book => book.borrowedBy)
  borrowedBooks: Book[];

  @Column({ type: 'timestamp', nullable: true })
  penaltyEndDate: Date;
}
