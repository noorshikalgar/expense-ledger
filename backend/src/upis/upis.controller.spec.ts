import { Test, TestingModule } from '@nestjs/testing';
import { UpisController } from './upis.controller';
import { UpisService } from './upis.service';

describe('UpisController', () => {
  let controller: UpisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpisController],
      providers: [UpisService],
    }).compile();

    controller = module.get<UpisController>(UpisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
