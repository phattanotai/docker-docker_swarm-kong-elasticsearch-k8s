import { Component, OnInit } from '@angular/core';
import {FetchDataService} from "../../services/fetch-data.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fetchDataService: FetchDataService ) { }

  ngOnInit(): void {
   console.log("dfdf")
  }

  async fetchData(){
    const data = await this.fetchDataService.fetchUser();
    console.log(data)
  }
}
