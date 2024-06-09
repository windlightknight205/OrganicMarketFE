import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: [
    './category.admin.component.scss',
  ]
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getCategories(0, 100);
  }

  executeToast(severity: string, message: string) {
    this.messageService.add({ severity: severity, summary: '', detail: message });
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger;
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
  insertCategory() {
    debugger
    // Điều hướng đến trang detail-category với categoryId là tham số
    this.router.navigate(['/admin/categories/insert']);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateCategory(categoryId: number) {
    debugger
    this.router.navigate(['/admin/categories/update', categoryId]);
  }
  deleteCategory(category: Category) {
    const confirmation = window
      .confirm('Bạn có muốn xóa danh mục này không ?');
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: string) => {
          debugger
          this.executeToast('success', 'Xóa thành công');
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          this.executeToast('error','Sản phẩm vẫn còn trong danh mục')
          console.error('Error fetching categories:', error);
        }
      });
    }
  }
}