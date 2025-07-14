import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Summary } from "../summary/summary";

@Component({
  selector: 'app-dashboard',
  imports: [Summary],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
