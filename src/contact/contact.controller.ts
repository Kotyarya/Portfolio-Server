import {Body, Controller, Post} from '@nestjs/common';
import {ContactService} from './contact.service';
import {buildSuccessResponse} from '../common/buildSuccessResponse';
import {ContactDto} from './contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {
    }

    @Post()
    async handleContact(@Body() body: ContactDto) {
        const {name, email, message} = body;

        await this.contactService.sendToOwner(name, email, message);
        //await this.contactService.sendConfirmationToUser(email, name);

        return buildSuccessResponse(null);
    }
}
