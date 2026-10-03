import {Body, Controller, Post, Req} from '@nestjs/common';
import type {Request} from 'express';
import {ContactService} from './contact.service';
import {buildSuccessResponse} from '../common/buildSuccessResponse';
import {ContactDto} from './contact.dto';
import {ContactRateLimitService} from './contact-rate-limit.service';

@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
        private readonly contactRateLimit: ContactRateLimitService,
    ) {
    }

    @Post()
    async handleContact(@Body() body: ContactDto, @Req() request: Request) {
        this.contactRateLimit.check(request.ip ?? request.socket.remoteAddress ?? 'unknown');
        const {name, email, message} = body;

        await this.contactService.sendToOwner(name, email, message);
        //await this.contactService.sendConfirmationToUser(email, name);

        return buildSuccessResponse(null);
    }
}
