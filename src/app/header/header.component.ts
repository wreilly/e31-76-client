import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  weekNumber = 14;
  assignmentNumber = this.weekNumber / 2; // 7!

  constructor() { }

}
