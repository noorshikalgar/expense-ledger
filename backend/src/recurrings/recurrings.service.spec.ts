import { Test, TestingModule } from '@nestjs/testing';
import { RecurringsService } from './recurrings.service';

describe('RecurringsService', () => {
  let service: RecurringsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringsService],
    }).compile();

    service = module.get<RecurringsService>(RecurringsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
