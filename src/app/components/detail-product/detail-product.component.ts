import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { UserResponse } from 'src/app/responses/user/user.response';
import { UserService } from 'src/app/services/user.service';
import { CommentDTO } from 'src/app/dtos/comment/comment.dto';
import { Comment } from 'src/app/models/comment';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  product?: Product;
  products: Product[] = [];
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  username: string = '';
  userResponse?: UserResponse|null;
  comments: CommentDTO[]=[];
  comment: Comment={
    product_id: 0,
    user_id: 0,
    content: ''
  };
  message: string ='';
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {

  }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    // Lấy productId từ URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      debugger
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
          this.getProducts('', Number(this.product?.category_id), 0, 4);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      });
      debugger
      this.productService.getComment(this.username,this.productId).subscribe({
        next: (response: any) => {
          debugger
          this.comments= response;  
          this.comments.forEach(comment => {
            comment.updateAt= new Date(
              comment.updated_at[0],
              comment.updated_at[1]-1,
              comment.updated_at[2],
            ) 
          });
          debugger              
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      })
    } else {
      console.error('Invalid productId:', idParam);
    }

  }
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger;
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
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
  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    debugger
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      this.executeToast('Thêm vào giỏ hàng thành công');
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }
  onProductClick(productId: number) {
    debugger;
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]).then(() => {
      // Force reload the current page
      window.location.reload()
    })
  }

  addToCartP(productId: number): void {
    debugger
    this.isPressedAddToCart = true;
    this.cartService.addToCart(productId, 1);
  }

  buyNowP(productId: number): void {
    this.cartService.addToCart(productId, 1);
    this.router.navigate(['/orders']);
  }
  postComment(){
    this.comment.content= this.message;
    this.comment.product_id= this.productId;
    this.comment.user_id= Number(this.userResponse?.id);
    this.productService.insertComment(this.comment).subscribe({
      next: (response: any) => {
       
      },
      complete: () => {
        window.location.reload();
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }

  addToFavourite(productId:number){
    const userId = this.tokenService.getUserId();
    this.productService.addFavourite(productId,userId).subscribe({
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

  executeToast(message:string) {
    this.messageService.add({severity:'success', summary: '', detail: message});
  }
}
