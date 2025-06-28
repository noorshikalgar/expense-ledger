import { Test, TestingModule } from '@nestjs/testing';
import { RecurringsController } from './recurrings.controller';
import { RecurringsService } from './recurrings.service';

describe('RecurringsController', () => {
  let controller: RecurringsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringsController],
      providers: [RecurringsService],
    }).compile();

    controller = module.get<RecurringsController>(RecurringsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
