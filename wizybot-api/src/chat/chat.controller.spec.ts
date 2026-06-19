import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const mockChatService = {
      processEnquiry: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call processEnquiry with the prompt', async () => {
    const dto: ChatRequestDto = { prompt: 'Find me an iPhone' };
    chatService.processEnquiry.mockResolvedValue('Here are some iPhones...');

    await controller.processChat(dto);

    expect(chatService.processEnquiry).toHaveBeenCalledWith('Find me an iPhone');
  });

  it('should return the response from the service', async () => {
    const dto: ChatRequestDto = { prompt: 'Hello' };
    chatService.processEnquiry.mockResolvedValue('Hi there!');

    const result = await controller.processChat(dto);

    expect(result).toBe('Hi there!');
  });

  it('should propagate errors thrown by the service', async () => {
    const dto: ChatRequestDto = { prompt: 'fail' };
    chatService.processEnquiry.mockRejectedValue(new Error('Service error'));

    await expect(controller.processChat(dto)).rejects.toThrow('Service error');
  });
});
