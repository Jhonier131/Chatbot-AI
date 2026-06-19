import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';

/**
 * Controller to handle incoming HTTP requests for the chat feature.
 */
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Endpoint to receive a user prompt and return the AI text response.
   */
  @Post()
  @ApiOperation({ summary: 'Process a chat enquiry using the LLM' })
  @ApiResponse({ status: 201, description: 'The LLM response.', type: String })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async processChat(@Body() chatRequestDto: ChatRequestDto): Promise<string> {
    return this.chatService.processEnquiry(chatRequestDto.prompt);
  }
}
