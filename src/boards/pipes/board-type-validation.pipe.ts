import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardType } from "../boards.default_type";

export class BoardTypeValidationPipe implements PipeTransform {

    readonly TypeOptions = [
        BoardType.NOTICE,
        BoardType.FREE
    ];
    transform(value: any) { //* , metadata: ArgumentMetadata
        //value = typeof value === 'string' ? value.toUpperCase() : value;
        if ( !this.isTypeValid(value)) {
            throw new BadRequestException(`${value} isn't in the type options`);
        }
        return value;
    }

    private isTypeValid(type: any) {
        const index = this.TypeOptions.indexOf(type);
        return index !== -1;
    }
}