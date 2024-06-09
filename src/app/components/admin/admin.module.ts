import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { OrderAdminComponent } from './order/order.admin.component';
import { DetailOrderAdminComponent } from './order/detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './product/product.admin.component';
import { UpdateProductAdminComponent } from './product/update/update.product.admin.component';
import { InsertProductAdminComponent } from './product/insert/insert.product.admin.component';

import { CategoryAdminComponent } from './category/category.admin.component';
import { InsertCategoryAdminComponent } from './category/insert/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './category/update/update.category.admin.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAdminComponent } from './user/user.admin.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CouponAdminComponent } from './coupon/coupon.admin.component';
import { DetailCouponAdminComponent } from './coupon/detail-coupon/detail.coupon.admin.component';
import { InsertCouponAdminComponent } from './coupon/insert/insert.coupon.admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    AdminComponent,
    OrderAdminComponent,
    ProductAdminComponent,
    CategoryAdminComponent,
    UserAdminComponent,
    CouponAdminComponent,
    DashboardComponent,
    //sub-components
    DetailCouponAdminComponent,
    DetailOrderAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,
    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
    InsertCouponAdminComponent
  ],
  imports: [
    AdminRoutingModule, // import routes,
    CommonModule,
    FormsModule,
    ToastModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxPrintModule
  ],
  providers:
    [MessageService],
})
export class AdminModule { }