import { Component } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})

export class BaseComponent {
  constructor (public securityService: SecurityService , private router :Router)  {}

  userconnect = JSON.parse(localStorage.getItem("userconnect")!);
  username: string = "";
  public ngOnInit() {
    if (this.securityService.profile && this.securityService.profile.username) {
      console.log(this.securityService.profile);
      this.username = this.securityService.profile.username;
    }
  }
  profile() {
    if (this.username) {
      this.router.navigate(['/profil', { id: this.username }]);
    }}

  onLogout() {
    this.securityService.kcService.logout(window.location.origin);
  }

}
