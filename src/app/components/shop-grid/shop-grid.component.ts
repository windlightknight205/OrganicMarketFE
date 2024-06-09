import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environment } from '../../../environments/environment';
import { CartService } from 'src/app/services/cart.service';
import { MessageService } from 'primeng/api';
import { TokenService } from 'src/app/services/token.service';
import { RemoveCommaPipe } from 'src/app/remove-comma.pipe';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss'],
  providers: [RemoveCommaPipe] 
})
export class ShopGridComponent {
  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  sortItems: { value: string, label: string }[] = [
    { value: "name", label: "Tên" },
    { value: "price", label: "Giá" },
    { value: "updatedAt", label: "Ngày" }
  ];
  selectedSortItem: string = 'name';
  minPrice: string = '';
  maxPrice: string = '';
  isPressedAddToCart: boolean = false;
  activeCategory: number =0;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cartService: CartService,
    private messageService: MessageService,
    private tokenService: TokenService,
    private removeCommaPipe: RemoveCommaPipe
  ) { }

  ngOnInit() {
    this.currentPage = Number(localStorage.getItem('currentProductPage')) || 0;
    this.getProducts(this.selectedSortItem, this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.selectedSortItem, this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  searchSortedProducts(sortBy: string) {
    console.log("category2:" + this.selectedCategoryId);
    this.selectedSortItem = sortBy;
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.selectedSortItem, this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  searchProductsByPrice() {
    this.currentPage = 0;
    this.itemsPerPage = 60;
    debugger
    const minPriceNumber = this.removeCommaPipe.transform(this.minPrice);
    const maxPriceNumber = this.removeCommaPipe.transform(this.maxPrice);
    this.getProductsByPrice(minPriceNumber, maxPriceNumber, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  searchProductsWithCat(categoryId: any) {
    this.selectedCategoryId = categoryId;
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.selectedSortItem, '', categoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(sortBy: string, keyword: string, selectedCategoryId: number, page: number, limit: number) {
    // debugger;
    this.productService.getProducts(this.selectedSortItem, keyword, selectedCategoryId, page, limit).subscribe({
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

  getProductsByPrice(minPrice: number, maxPrice: number, selectedCategoryId: number, page: number, limit: number) {
    // debugger;
    this.productService.getProductsByPrice(minPrice, maxPrice, selectedCategoryId, page, limit).subscribe({
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
    this.getProducts(this.selectedSortItem, this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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
  addToCart(productId: number): void {
    debugger
    this.isPressedAddToCart = true;
    this.cartService.addToCart(productId, 1);
    this.executeToast('Thêm vào giỏ hàng thành công')
  }

  buyNow(productId: number): void {
    this.cartService.addToCart(productId, 1);
    this.router.navigate(['/orders']);
  }
  addToFavourite(productId: number) {
    const userId = this.tokenService.getUserId();
    this.productService.addFavourite(productId, userId).subscribe({
      next: (response: any) => {
        debugger;
        console.log(response);
      },
      complete: () => {
        this.executeToast('Đã thêm vào yêu thích')
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }

  executeToast(message: string) {
    this.messageService.add({ severity: 'success', summary: '', detail: message });
  }


  setActiveCategory(categoryId: number) {
    this.activeCategory = categoryId;
  }
}
