import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../boards.default_type";

export class BoardStatusValidationPipe implements PipeTransform {

    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ];
    transform(value: any) { //* , metadata: ArgumentMetadata
        value = typeof value === 'string' ? value.toUpperCase() : value;

        if ( !this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't in the status options`);
        }
        return value;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
}