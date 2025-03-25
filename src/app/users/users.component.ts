import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  constructor( private router: Router) {}
  username: string = '' ;
  debounceTimer: any;
  isSpecificUser: boolean=false;
 


  onInputChange(event: Event ): void {

  }

  navigateToUpdate(){

      this.router.navigate(['/updateUser' , { id: this.username }]);

  }
  ngOnInit(): void {
    this.retrieveAllUsers();

  }

  retrieveAllUsers(): void {

  }

  retrieveUser(username: string) {


}
confirmDelete(username: string | undefined): void {

}

removeUser(userName: string): void {
}



}
