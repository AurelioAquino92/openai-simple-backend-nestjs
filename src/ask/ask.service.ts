import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAskDto } from './dto/create-ask.dto';
import OpenAI from 'openai';

@Injectable()
export class AskService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async create(createAskDto: CreateAskDto) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: createAskDto.messages,
      });

      const assistantMessage = response.choices[0].message.content;

      return {
        role: 'assistant',
        content: assistantMessage,
      };
    } catch (error: unknown) {
      if (error instanceof OpenAI.APIError) {
        console.error(`OpenAI API Error: ${error.message}`);
        throw new HttpException(
          {
            role: 'assistant',
            content: "I'm having trouble connecting to the AI service right now. Please try again in a few moments.",
            error: 'openai_error',
            details: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Unexpected Error: ${errorMessage}`);
      throw new HttpException(
        {
          role: 'assistant',
          content: 'An unexpected error occurred. Our team has been notified.',
          error: 'internal_error',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
