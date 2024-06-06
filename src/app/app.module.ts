import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {TokenInterceptor} from './interceptors/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AdminModule } from './components/admin/admin.module';
import { 
  HttpClientModule, 
  HTTP_INTERCEPTORS 
} from '@angular/common/http';
import { ShopGridComponent } from './components/shop-grid/shop-grid.component';
import { HistoryComponent } from './components/history/history.component';
import { BlogComponent } from './components/blog/blog.component';
import { FavouriteComponent } from './components/favourite/favourite..component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaymentComponent } from './components/payment/payment.component';


@NgModule({
  declarations: [    
    HomeComponent, 
    HeaderComponent,
    FooterComponent, 
    DetailProductComponent, 
    OrderComponent, 
    OrderDetailComponent, 
    LoginComponent, 
    RegisterComponent, 
    UserProfileComponent,
    AppComponent,
    ShopGridComponent,
    HistoryComponent,
    BlogComponent,
    FavouriteComponent,
    PaymentComponent
    //admin    
    //AdminComponent,
    //OrderAdminComponent,
    //ProductAdminComponent,
    //CategoryAdminComponent,
    //DetailOrderAdminComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,    
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,        
    AdminModule,
    ToastModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },MessageService,
  ],
  bootstrap: [
    AppComponent
    // HomeComponent,
    //DetailProductComponent,
    // OrderComponent,
    //OrderDetailComponent,
    //LoginComponent,
    // RegisterComponent
  ]
})
export class AppModule { }
