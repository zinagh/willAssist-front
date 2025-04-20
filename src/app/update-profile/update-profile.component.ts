import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Userdto } from '../models/Userdto';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    console.log('Constructor called');
  }

  showSuccessMessage: boolean = false;
  updateAllowed: boolean = false;
  userForm!: FormGroup;
  user!: Userdto;
  username: string = 'wafa'; // Hardcoded for testing; replace with your logic

  ngOnInit(): void {
    console.log('ngOnInit started');
    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      cin: ['', Validators.pattern('[0-9]{8}')],
      email: ['', [Validators.required, Validators.email]],
      numTel: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    });
    console.log('Form initialized:', this.userForm);

    // Attempt to retrieve user data
    console.log('Retrieving user with username:', this.username);
    if (this.username) {
      this.retrieveUser(this.username);
    } else {
      console.error('Username is undefined or empty');
    }
    console.log('ngOnInit completed');
  }

  retrieveUser(username: string): void {
    console.log('retrieveUser called with username:', username);
    this.userService.retrieveUser(username).subscribe(
      (data) => {
        console.log('User data retrieved:', data);
        this.user = data;
        this.populateForm();
      },
      (error) => {
        console.error('Error retrieving user:', error);
      }
    );
  }

  populateForm(): void {
    console.log('populateForm called with user:', this.user);
    if (this.user) {
      const dateNaissance = this.user.dateNaissance
        ? new Date(this.user.dateNaissance).toISOString().split('T')[0]
        : null;
      this.userForm.patchValue({
        nom: this.user.nom,
        prenom: this.user.prenom,
        cin: this.user.cin,
        email: this.user.email,
        numTel: this.user.numTel,
      });
      console.log('Form populated with values:', this.userForm.value);
    } else {
      console.error('No user data to populate form');
    }
  }

  profile(): void {
    console.log('profile method called with username:', this.username);
    if (this.username) {
      this.router.navigate(['/profil', { id: this.username }]);
    } else {
      console.error('Cannot navigate to profile: username is undefined');
    }
  }

  confirmUpdate(): void {
    console.log('confirmUpdate called');
    if (confirm('Are you sure you want to update this User?')) {
      console.log('Update confirmed');
      this.updateAllowed = true;
      this.onSubmit();
    } else {
      console.log('Update canceled');
      this.updateAllowed = false;
    }
  }

  onSubmit(): void {
    console.log('onSubmit called, updateAllowed:', this.updateAllowed);
    if (this.updateAllowed && this.userForm.valid) {
      const updatedUser: Userdto = {
        ...this.user, // Preserve existing fields (e.g., userName, role)
        ...this.userForm.value // Update with form values
      };
      console.log('Submitting updated user:', updatedUser);

      this.userService.modifierUser(updatedUser).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.userForm.reset();
          this.profile();
        },
        (error) => {
          console.error('Failed to update user:', error);
        }
      );
    } else {
      console.log('Form invalid or update not allowed:', {
        updateAllowed: this.updateAllowed,
        formValid: this.userForm.valid,
        formErrors: this.userForm.errors
      });
    }
  }
}
