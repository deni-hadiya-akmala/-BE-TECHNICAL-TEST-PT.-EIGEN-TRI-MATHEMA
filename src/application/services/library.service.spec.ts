import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../../domain/entities/member.entity';
import { Book } from '../../domain/entities/book.entity';
import { Repository } from 'typeorm';

describe('LibraryService', () => {
  let service: LibraryService;
  let memberRepository: Repository<Member>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should borrow a book', async () => {
    const member = new Member();
    member.code = 'M001';
    member.borrowedBooks = [];
    const book = new Book();
    book.code = 'JK-45';
    book.stock = 1;

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(book);
    jest.spyOn(memberRepository, 'save').mockResolvedValue(member);

    expect(await service.borrowBook('M001', 'JK-45')).toBe('Buku berhasil dipinjam');
  });
});
