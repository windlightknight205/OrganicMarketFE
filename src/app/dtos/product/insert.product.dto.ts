import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class InsertProductDTO {
    @IsPhoneNumber()
    name: string;

    price: number;
    thumbnail: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    weight: string;
    category_id: number;
    images: File[] = [];
    
    constructor(data: any) {
        this.weight= data.weight;
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
        this.thumbnail = data.thumbnail;
    }
}