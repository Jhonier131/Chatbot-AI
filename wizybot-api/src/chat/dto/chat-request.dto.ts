import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'The user enquiry to process',
    example: 'Find me an iphone',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}