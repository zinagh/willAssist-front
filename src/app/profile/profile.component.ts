import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SecurityService } from '../services/security.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  ispassw: boolean = false;
  username: string = '';
  isprofile: boolean = true;
  updateAllowed: boolean = false;
  user: any; // Replace 'any' with your user model type if available

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UserService,
    public securityService: SecurityService
  ) {
    this.userForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }




  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'] || this.securityService.profile?.username;
    this.retrieveUser();
  }

  passwordValidator() {
    return (control: any) => {
      const value = control.value || '';
      const hasUpperCase = /[A-Z]/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasNumber = /\d/.test(value);
      return hasUpperCase && hasSymbol && hasNumber ? null : { invalidPassword: true };
    };
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  retrieveUser(): void {
    this.usersService.retrieveUser(this.username).subscribe(
      (data) => this.user = data,
      (error) => console.error('Error fetching user:', error)
    );
  }

  toprofile(): void {
    this.isprofile = true;
    this.ispassw = false;
  }

  topassw(): void {
    this.isprofile = false;
    this.ispassw = true;
  }

  navigateToUpdate(): void {
    console.log('Navigating to update-profile');
    this.router.navigate(['/update-profile']);
  }

  profile(): void {
    this.router.navigate(['/profil']);
  }

  confirmUpdate(): void {
    if (confirm('Are you sure you want to update your password?')) {
      this.updateAllowed = true;
      this.updatePassword();
    }
  }

  updatePassword(): void {
    if (this.updateAllowed && this.userForm.valid) {
      const username = this.username;
      const newPassword = this.userForm.get('password')?.value;
      const verifyPassword = this.userForm.get('confirmPassword')?.value;
      this.usersService.updatePassword(username, newPassword, verifyPassword).subscribe(
        (response) => {
          console.log('Password updated successfully:', response);
          this.userForm.reset();
          this.toprofile();
        },
        (error) => console.error('Failed to update password:', error)
      );
    }
  }
}
