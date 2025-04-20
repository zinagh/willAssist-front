import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Userdto } from '../models/Userdto';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  constructor( private userService: UserService , private router: Router) {}
  username: string = '' ;
  debounceTimer: any;
  isSpecificUser: boolean=false;
  user!: Userdto;
  users!: Userdto[];
  onInputChange(event: Event ): void {
    const value = (event.target as HTMLInputElement).value;
    this.username = value;
    if(this.username != ""){
      this.isSpecificUser = true;
    } else {
      this.isSpecificUser = false;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
      this.debounceTimer = setTimeout(() => {
      this.retrieveUser(this.username);
    }, 1000);
  }


  navigateToUpdate(){

      this.router.navigate(['/updateUser' , { id: this.username }]);

  }
  ngOnInit(): void {
    this.retrieveAllUsers();

  }

  retrieveAllUsers(): void {
    this.userService.retrieveAllUsers().subscribe({
      next: (data: Userdto[]) => {
        this.users = data;
        console.log(this.users);
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
        // Handle error
      }
    });
  }

  retrieveUser(username: string) {
    this.userService.retrieveUser(username).subscribe(
      (data) => {
    this.user = data ;
    console.log(this.user);

      }
    );

}
confirmDelete(username: string | undefined): void {
  if (confirm('Are you sure you want to delete this User?')) {
      if(username){
        console.log(username)
      this.removeUser(username);
      }
  }
}

removeUser(userName: string): void {
  this.userService.removeUser(userName).subscribe(
    () => {
      console.log('User removed successfully');
      this.retrieveAllUsers();
    },
    (error) => {
      console.error('Failed to remove user:', error);
    }
  );
}


}
