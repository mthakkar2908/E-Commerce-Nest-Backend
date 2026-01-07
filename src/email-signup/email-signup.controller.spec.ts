import { Test, TestingModule } from '@nestjs/testing';
import { EmailSignupController } from './email-signup.controller';
import { EmailSignupService } from './email-signup.service';

describe('EmailSignupController', () => {
  let controller: EmailSignupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailSignupController],
      providers: [EmailSignupService],
    }).compile();

    controller = module.get<EmailSignupController>(EmailSignupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
