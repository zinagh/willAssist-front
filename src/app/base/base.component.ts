import { Component } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})

export class BaseComponent {

  userconnect = JSON.parse(localStorage.getItem("userconnect")!);


  logout(){
    localStorage.clear()
  }

}
