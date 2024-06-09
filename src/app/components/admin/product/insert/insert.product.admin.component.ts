import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertProductDTO } from '../../../../dtos/product/insert.product.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ProductService } from '../../../../services/product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss']
})

export class InsertProductAdminComponent implements OnInit {
  productId :number = 0;
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    description: '',
    weight: '',
    thumbnail:'',
    category_id: 1,
    images: []
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private productService: ProductService, 
    private messageService: MessageService   
  ) {
    
  } 
  ngOnInit() {
    this.getCategories(1, 100)
  }
  
  executeToast(severity: string, message: string) {
    this.messageService.add({ severity: severity, summary: '', detail: message });
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 4) {
      alert('Please select a maximum of 4 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.insertProductDTO.images = files;
    this.insertProductDTO.thumbnail= files[0].name;
  }

  insertProduct() {   
    debugger
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (response) => {
        debugger
        if (this.insertProductDTO.images.length > 0) {
          this.productId = response.id; // Assuming the response contains the newly created product's ID
          this.productService.uploadImages(this.productId, this.insertProductDTO.images).subscribe({
            next: (imageResponse) => {
              debugger
              // Handle the uploaded images response if needed              
              console.log('Images uploaded successfully:', imageResponse);
              setTimeout(() => {
                this.productService.updateProduct(this.productId, this.insertProductDTO).subscribe({
                  next:()=>{
                    console.log("success")
                  }
                });
                this.router.navigate(['../'], { relativeTo: this.route });
              }, 500);   
              // Navigate back to the previous page
            },
            error: (error) => {
              // Handle the error while uploading images
              alert(error.error)
              console.error('Error uploading images:', error);
            }
          })          
        }
      },
      complete: ()=>{
       
      },
      error: (error) => {
        debugger
        // Handle error while inserting the product
        this.executeToast('error','Xảy ra lỗi '+ error)
        console.error('Error inserting product:', error);
      }
    });    
  }
}
