import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LibraryService } from '../../application/services/library.service';
import { BorrowBookDto } from '../../application/dto/borrow-book.dto';
import { ReturnBookDto } from '../../application/dto/return-book.dto';

@ApiTags('Perpustakaan')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Meminjam buku' })
  async borrowBook(@Body() borrowBookDto: BorrowBookDto): Promise<string> {
    return this.libraryService.borrowBook(borrowBookDto.memberCode, borrowBookDto.bookCode);
  }

  @Post('return')
  @ApiOperation({ summary: 'Mengembalikan buku' })
  async returnBook(@Body() returnBookDto: ReturnBookDto): Promise<string> {
    return this.libraryService.returnBook(returnBookDto.memberCode, returnBookDto.bookCode);
  }
}
