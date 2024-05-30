import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {
  DetailProductComponent
} from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShopGridComponent } from './components/shop-grid/shop-grid.component';
import { HistoryComponent } from './components/history/history.component';
import { BlogComponent } from './components/blog/blog.component';
import { FavouriteComponent } from './components/favourite/favourite..component';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'shop-grid', component: ShopGridComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent },
  { path: 'blog', component: BlogComponent },
  {path:'favourite', component: FavouriteComponent},
  //Admin   
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate:[AdminGuardFn] 
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
