import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertCategoryDTO } from '../../../../dtos/category/insert.category.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ProductService } from '../../../../services/product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss']
})
export class InsertCategoryAdminComponent implements OnInit {
  insertCategoryDTO: InsertCategoryDTO = {
    name: '',    
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
    
  }   

  executeToast(severity: string, message: string) {
    this.messageService.add({ severity: severity, summary: '', detail: message });
  }

  insertCategory() {    
    this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
      next: (response) => {
        debugger
        this.executeToast('success','Thêm sản phẩm thành công');
        setTimeout(() => {
          this.router.navigate(['/admin/categories']);      
        }, 1000);
  
      },
      error: (error) => {
        debugger
        // Handle error while inserting the category
        this.executeToast('error','Tên danh mục đã tồn tại')
      }
    });    
  }
}
