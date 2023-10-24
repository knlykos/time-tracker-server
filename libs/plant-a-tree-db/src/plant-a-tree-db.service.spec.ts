import { Test, TestingModule } from '@nestjs/testing';
import { PlantATreeDbService } from './plant-a-tree-db.service';

describe('PlantATreeDbService', () => {
  let service: PlantATreeDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantATreeDbService],
    }).compile();

    service = module.get<PlantATreeDbService>(PlantATreeDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
