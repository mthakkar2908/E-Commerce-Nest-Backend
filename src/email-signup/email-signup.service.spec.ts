import { Test, TestingModule } from '@nestjs/testing';
import { EmailSignupService } from './email-signup.service';

describe('EmailSignupService', () => {
  let service: EmailSignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSignupService],
    }).compile();

    service = module.get<EmailSignupService>(EmailSignupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
