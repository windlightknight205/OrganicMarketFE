import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class UpdateProductDTO {
    @IsPhoneNumber()
    name: string;
    weight: string;
    price: number;
    thumbnail :string;
    @IsString()
    @IsNotEmpty()
    description: string;

    category_id: number;

    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
        this.thumbnail = data.thumbnail;
        this.weight =data.weight;
    }
}