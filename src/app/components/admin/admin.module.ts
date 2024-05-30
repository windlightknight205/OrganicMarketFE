import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { OrderAdminComponent } from './order/order.admin.component';
import { DetailOrderAdminComponent } from './detail-order/detail.order.admin.component';
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

@NgModule({
  declarations: [
    AdminComponent,
    OrderAdminComponent,
    ProductAdminComponent,
    CategoryAdminComponent,
    UserAdminComponent,
    //sub-components
    DetailOrderAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,

    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
  ],
  imports: [
    AdminRoutingModule, // import routes,
    CommonModule,
    FormsModule,
    ToastModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers:
    [MessageService],
})
export class AdminModule { }