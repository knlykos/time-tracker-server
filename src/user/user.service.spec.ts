import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { commonModuleImportConf } from '../tests-utils/common-module.test';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...commonModuleImportConf],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should test if activateUser', () => {
    service.activateUser('')
  });
});
