import { Injectable } from '@nestjs/common';

@Injectable()
export class BlocksService {
    getStartPage():string {
        return "Start Page";
    }
}
