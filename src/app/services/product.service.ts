import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getProducts(
    sortBy:string,
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<Product[]> {
    const params = {
      sortBy: sortBy ,
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, { params });
  }

  getProductsByPrice(
    minPrice:number,
    maxPrice: number,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<Product[]> {
    const params = {
      minPrice: minPrice ,
      maxPrice: maxPrice,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/search-by-price`, { params });
  }

  getDetailProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`, { params });
  }
  deleteProduct(productId: number): Observable<string> {
    return this.http.delete(`${this.apiBaseUrl}/products/${productId}`, { responseType: 'text' });
  }
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
    debugger
    return this.http.put<Product>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  }  
  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    debugger
    // Add a new product
    return this.http.post(`${this.apiBaseUrl}/products`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }
  deleteProductImage(id: number): Observable<any> {
    debugger
    return this.http.delete(`${this.apiBaseUrl}/product_images/${id}`)
  }
  addFavourite(
    productId: number,
    userId: number
  ): Observable<any> {
    const params = {
      productId: productId.toString(),
      userId: userId.toString(),
    };
    return this.http.post(`${this.apiBaseUrl}/products/favourite`,null, { params });
  }

  getFavourite(userId:number): Observable<any> {
    const params = {
      userId: userId.toString(),
    };
    return this.http.get(`${this.apiBaseUrl}/products/favourite`,{ params });
  }

  deleteFavourite(
    productId: number,
    userId: number
  ): Observable<any> {
    const params = {
      productId: productId.toString(),
      userId: userId.toString(),
    };
    return this.http.delete(`${this.apiBaseUrl}/products/delete-favourite`, { params ,responseType: 'text'},);
  }

  getComment( userId:string,productId: number):Observable<any> {
    debugger
    const params = {
      product_id: productId.toString(),
      userid: userId
    }    
      return this.http.get(`${environment.apiBaseUrl}/comments`, { params });           
  }   
  deleteComment(id: number): Observable<string> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/categories/${id}`);
  }
  insertComment(comment: Comment): Observable<any> {
    debugger
    // Add a new category
    return this.http.post(`${this.apiBaseUrl}/comments`, comment);
  }
}
//update.category.admin.component.html