import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';
import { ApiResponse } from 'src/app/responses/api.response';
import { CouponService } from 'src/app/services/coupon.service';
import { MessageService } from 'primeng/api';
import { UserResponse } from 'src/app/responses/user/user.response';
import { UserService } from 'src/app/services/user.service';
import { VnPayService } from 'src/app/services/vnpay.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [VnPayService]
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền
  subTotalAmount: number = 0;
  cart: Map<number, number> = new Map();
  couponApplied: boolean = false;
  userRespone?: UserResponse;
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form    
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private router: Router,
    private userService: UserService,
    private vnPayService: VnPayService,
    private messageService: MessageService
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod'],
      coupon_code: [''],
    })
      ;
  }

  ngOnInit(): void {
    debugger
    //this.cartService.clearCart();
    // Lấy danh sách sản phẩm từ giỏ hàng
    this.userService.getUserDetail(this.tokenService.getToken()).subscribe({
      next: (rs: any) => {
        this.orderForm.patchValue({
          fullname: rs.fullname,
          email: rs.email,
          phone_number: rs.phone_number,
          address: rs.address
        })
      }
    });
    debugger
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }
  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      debugger
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.user_id = this.tokenService.getUserId();
      this.orderData.total_money = this.totalAmount;
      const orderDataString = JSON.stringify(this.orderData);
      sessionStorage.setItem('orderData', orderDataString);
      if (this.orderData.payment_method === 'other') {
        debugger
        this.vnPayService.payByVnpay(this.orderData.total_money, this.orderData.fullname + ' thanh toán đơn hàng')
          .subscribe({
            next: (rs) => {
              debugger
              window.location.href = rs;
            },
            error: (e) => {
              debugger
              console.log(e);
            }
          })
      }
      else {
        this.orderService.placeOrder(this.orderData).subscribe({
          next: (response: Order) => {
            debugger;
            this.executeToast('success', 'Đặt hàng thành công');
            this.cartService.clearCart();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);

          },
          complete: () => {
            debugger;
            this.calculateTotal();
          },
          error: (error: any) => {
            debugger;
            alert(`Lỗi khi đặt hàng: ${error}`);
          },
        });
      }
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    this.subTotalAmount = this.totalAmount;
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    debugger
    const couponCode = this.orderForm.get('coupon_code')!.value;
    console.log("code" + couponCode)
    if (!this.couponApplied && couponCode) {
      debugger
      this.couponCode = couponCode;
      this.calculateTotal();
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (apiResponse: ApiResponse) => {
            this.totalAmount = apiResponse.data.result;
            this.couponApplied = true;
          },
          complete: () => {
            this.executeToast('success', 'Áp dụng Coupon thành công')
            console.log(this.totalAmount)
            debugger;
          },
          error: (error: any) => {
            this.executeToast('error', 'Mã giảm giá không hợp lệ');
            console.log(error);
          },
        });
    }
    else {
      this.executeToast('error', 'Mã giảm giá không được để trống hoặc đã được áp dụng')
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
  executeToast(severity: string, message: string) {
    this.messageService.add({ severity: severity, summary: '', detail: message });
  }
}
