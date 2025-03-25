import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],


})
export class ProfileComponent implements OnInit  {
  userForm!: FormGroup;
  ispassw :boolean = false ;
  username!: string;
  isprofile : boolean = true ;
  updateAllowed: boolean = false;
  constructor(private route: ActivatedRoute , private router: Router, ) {}
  topassw(){
   this.ispassw  = true ;
    this.isprofile  = false ;
  }
  toprofile(){
    this.ispassw = false ;
    this.isprofile= true ;
  }
  ngOnInit(): void {

  }




  navigateToUpdate(){
    if (this.username) {
      this.router.navigate(['/updateProfile', { id: this.username }]);
    }
  }

  retrieveUser(username: string) {

  }

  confirmPassword!: string;

  noMatch: boolean = false;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.confirmPassword = inputElement.value;
  }
  confirmUpdate(): void {
    if (confirm('Are you sure you want to update this User?')) {

        console.log();
        this.updateAllowed = true;
        this.updatePassword();

    } else {
      this.updateAllowed = false;
    }
  }


  updatePassword(): void {

  }

  profile() {
    if (this.username) {
      this.router.navigate(['/profile', { id: this.username }]);
    }}





}
