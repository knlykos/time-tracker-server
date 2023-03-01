import { Test, TestingModule } from '@nestjs/testing';
import { NkodexDbService } from './nkodex-db.service';

describe('NkodexDbService', () => {
  let service: NkodexDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NkodexDbService],
    }).compile();

    service = module.get<NkodexDbService>(NkodexDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
