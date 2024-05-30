import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environment } from '../../../environments/environment';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  isPressedAddToCart: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,    
    private router: Router,
    private cartService: CartService
    ) {}

    ngOnInit() {
      this.currentPage = Number(localStorage.getItem('currentProductPage')) || 0; 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getCategories(0, 100);
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
    
    searchProducts() {
      console.log(this.selectedCategoryId+"----"+this.keyword);
      this.currentPage = 0;
      this.itemsPerPage = 12;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    searchProductsWithCat(categoryId: any){
      this.currentPage = 0;
      this.itemsPerPage = 12;
      this.getProducts("", categoryId, this.currentPage, this.itemsPerPage);
    }
    
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      // debugger;
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (response: any) => {
          debugger;
          response.products.forEach((product: Product) => {          
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
      });    
    }
    
    onPageChange(page: number) {
      // debugger;
      this.currentPage = page < 0 ? 0 : page;
      localStorage.setItem('currentProductPage', String(this.currentPage)); 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }
    
    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    onProductClick(productId: number) {
      debugger;
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/products', productId]);
    }
    addToCart(productId:number): void {
      debugger
      this.isPressedAddToCart = true;
      this.cartService.addToCart(productId, 1);
    }
  
    buyNow(productId:number): void {
      this.cartService.addToCart(productId, 1);
      this.router.navigate(['/orders']);
    }
}
