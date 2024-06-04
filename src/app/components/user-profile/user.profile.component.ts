import { Component, ViewChild, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  ValidationErrors, 
  ValidatorFn, 
  AbstractControl
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';
import { MessageService } from 'primeng/api';
import { timeout } from 'rxjs';
@Component({
  selector: 'user-profile',
  templateUrl: './user.profile.component.html',
  styleUrls: ['./user.profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  token:string = '';
  showPassword: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private messageService: MessageService
  ){        
    this.userProfileForm = this.formBuilder.group({
      fullname: ['',[Validators.required]],     
      address: ['', [Validators.required]],
      email: ['',[Validators.email]],       
      password: ['',[Validators.minLength(8)]], 
      retype_password: [''], 
      date_of_birth: [Date.now()]     
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const retypePassword = form.get('retype_password')?.value;
    if (password && retypePassword && password !== retypePassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  ngOnInit(): void {  
    debugger
    this.token = this.tokenService.getToken();
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };    
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          email: this.userResponse?.email ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
        });        
        this.userService.saveUserResponseToLocalStorage(this.userResponse);         
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error.message);
      }
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  save(): void {
    debugger
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        email: this.userProfileForm.get('email')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
  
      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.executeToast('Lưu thành công');
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);  
          },
          error: (error: any) => {
            alert(error.error.message);
          }
        });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {        
        alert('Mật khẩu và mật khẩu gõ lại chưa chính xác')
      }
    }
  } 
  
  executeToast(message:string) {
    this.messageService.add({severity:'success', summary: '', detail: message});
  }
}

