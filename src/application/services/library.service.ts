import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { BookRepository } from '../../domain/repositories/book.repository';
import { Member } from '../../domain/entities/member.entity';
import { Book } from '../../domain/entities/book.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(MemberRepository) private memberRepository: MemberRepository,
    @InjectRepository(BookRepository) private bookRepository: BookRepository
  ) {}

  async borrowBook(memberCode: string, bookCode: string): Promise<string> {
    const member = await this.memberRepository.findOne({ where: { code: memberCode }, relations: ['borrowedBooks'] });
    if (!member) throw new NotFoundException('Anggota tidak ditemukan');
    if (member.penaltyEndDate && member.penaltyEndDate > new Date()) throw new BadRequestException('Anggota saat ini sedang dihukum');
    if (member.borrowedBooks.length >= 2) throw new BadRequestException('Anggota tidak boleh meminjam lebih dari 2 buku');

    const book = await this.bookRepository.findOne({ where: { code: bookCode } });
    if (!book) throw new NotFoundException('Buku tidak ditemukan');
    if (book.borrowedBy) throw new BadRequestException('Buku sudah dipinjam');

    member.borrowedBooks.push(book);
    book.borrowedBy = member;
    await this.bookRepository.save(book);
    await this.memberRepository.save(member);
    
    return 'Buku berhasil dipinjam';
  }

  async returnBook(memberCode: string, bookCode: string): Promise<string> {
    const member = await this.memberRepository.findOne({ where: { code: memberCode }, relations: ['borrowedBooks'] });
    if (!member) throw new NotFoundException('Anggota tidak ditemukan');

    const book = await this.bookRepository.findOne({ where: { code: bookCode }, relations: ['borrowedBy'] });
    if (!book) throw new NotFoundException('Buku tidak ditemukan');
    if (book.borrowedBy.code !== memberCode) throw new BadRequestException('Buku ini tidak dipinjam oleh anggota ini');

    const borrowedAt = book.borrowedAt;
    const currentDate = new Date();
    const daysBorrowed = Math.ceil((currentDate.getTime() - borrowedAt.getTime()) / (1000 * 3600 * 24));
    if (daysBorrowed > 7) {
      member.penaltyEndDate = new Date(currentDate.getTime() + 3 * 24 * 3600 * 1000);
    }

    member.borrowedBooks = member.borrowedBooks.filter(b => b.code !== bookCode);
    book.borrowedBy = null;
    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    return 'Buku berhasil dikembalikan';
  }
}
