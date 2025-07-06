import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async handleContact(
    @Body() body: { name: string; email: string; message: string },
  ) {
    const { name, email, message } = body;

    await this.contactService.sendToOwner(name, email, message);

    await this.contactService.sendConfirmationToUser(email, name);

    return { success: true, message: 'Message sent successfully' };
  }
}
