import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { MessageService } from 'primeng/api';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './test.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  showPassword: boolean = false;
  Accepted: boolean = true;
  isFocused = false;
  registerDTO: RegisterDTO = {
    fullname: '',
    phone_number: '',
    address: '',
    password: '',
    retype_password: '',
    date_of_birth: new Date(),
    email: '',
    facebook_account_id: 0,
    google_account_id: 0,
    role_id: 1
  }
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
        phone_number: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[0-9]+$/)]], // phone_number bắt buộc và ít nhất 6 ký tự
        address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
        password: ['', [Validators.required, Validators.minLength(8)]],
        retype_password: ['', [Validators.required],],
        fullname: ['', [Validators.required, Validators.minLength(3)]],
        date_of_birth: ['', [Validators.required]]
      }, { validators: this.matchPasswords });

  }
  matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const retypePassword = control.get('retype_password')?.value;
    if (password !== retypePassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  get email() { return this.registerForm.get('email'); }
  get phoneNumber() { return this.registerForm.get('phone_number'); }
  get address() { return this.registerForm.get('address'); }
  get password() { return this.registerForm.get('password'); }
  get retypePassword() { return this.registerForm.get('retype_password'); }
  get fullname() { return this.registerForm.get('fullname'); }
  get dateOfBirth() { return this.registerForm.get('dateOfBirth'); }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
  register() {
    //alert(message);
    debugger
    if (this.registerForm.errors == null) {
      this.registerDTO = {
        ...this.registerDTO,
        ...this.registerForm.value
      }
      this.userService.register(this.registerDTO).subscribe({
        next: (response: any) => {
          debugger
          // const confirmation = window
          //   .confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.');
          // if (confirmation) {
          //   this.router.navigate(['/login']);
          // }
          this.executeToast('Đăng ký thành công, hệ thống sẽ chuyển hướng đến trang đăng nhập','success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          this.executeToast(error?.error?.message ?? '','error')
          // alert(error?.error?.message ?? '')
        }
      })
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  //how to check password match ?
  isAccepted() {
    this.Accepted = !this.Accepted
  }
  checkAge() {
    if (this.registerForm.get('dateOfBirth')?.value) {
      const today = new Date();
      const birthDate = new Date(this.registerForm.get('dateOfBirth')?.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.controls['dateOfBirth'].setErrors({ 'invalidAge': true });
      } else {
        this.registerForm.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

  executeToast(message:string, severity: string) {
    this.messageService.add({severity:severity, summary: '', detail: message});
  }
}

