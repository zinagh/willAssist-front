import { Component, OnInit } from '@angular/core';
import { Userdto } from '../models/Userdto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Role } from '../models/Role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  confirmPassword!: string;
  noMatch: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', this.validateDateOfBirth],
      cin: ['', [Validators.pattern('[0-9]{8}')]],
      email: ['', [Validators.required, Validators.email]],
      numTel: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      role: ['', Validators.required]     });
      this.loadRoles();
  }
  roles: string[] = []; // Array to hold available roles
  isNext: boolean = false;
  navigateTousers(){
    this.router.navigate(['/Users']);
  }
  switchToNext(){
    this.isNext = !this.isNext;
    console.log(this.confirmPassword);
  }
  loadRoles() {
    this.roles = Object.values(Role) as string[];
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.confirmPassword = inputElement.value;
  }
  onSubmit(): void {
    if (this.userForm.valid) {
        let password: string = this.userForm.get('password')?.value;
        if (this.confirmPassword === password) {
            let user: Userdto;
            user = this.userForm.value;
            console.log(user);
            this.userService.addUser(user).subscribe(
                response => {
                    console.log('User added successfully');
                    this.userForm.reset();
                    this.navigateTousers();
                },
                error => {
                    console.error('An error occurred:', error);
                }
            );
        } else {
            this.noMatch = true;
        }
    } else {
        const userNameControl = this.userForm.get('userName');
        if (userNameControl?.errors?.['required']) {
            userNameControl.markAsTouched();
        }
    }

    const prenomControl = this.userForm.get('prenom');
    if (prenomControl?.errors?.['required']) {
        prenomControl.markAsTouched();
    }

    const nomControl = this.userForm.get('nom');
    if (nomControl?.errors?.['required']) {
        nomControl.markAsTouched();
    }

    const emailControl = this.userForm.get('email');
    if (emailControl?.errors?.['required'] || emailControl?.errors?.['email']) {
        emailControl.markAsTouched();
    }

    const cinControl = this.userForm.get('cin');
    if (cinControl?.errors?.['pattern']) {
        cinControl.markAsTouched();
    }

    const numTelControl = this.userForm.get('numTel');
    if (numTelControl?.errors?.['required'] || numTelControl?.errors?.['pattern']) {
        numTelControl.markAsTouched();
    }

    const passwordControl = this.userForm.get('password');
    if (passwordControl?.errors?.['invalidPassword']) {
        // Affichage d'un message pour un mot de passe invalide
        console.log('Password must contain at least one uppercase letter, one symbol, and one number.');
    }
}

markFormFieldsTouched() {
    Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        if (control?.invalid) {
            control.markAsTouched();
        }
    });
}

passwordValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$/)) {
        return { invalidPassword: true };
    }
    return null;
}

validateDateOfBirth(control: any): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age < 18 ? { underage: true } : null;
}
}
