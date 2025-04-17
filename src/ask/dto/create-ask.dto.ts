export class CreateAskDto {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
}
