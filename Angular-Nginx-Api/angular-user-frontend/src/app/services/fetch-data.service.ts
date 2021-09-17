import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  constructor() { }

  async fetchUser() {
    const resp = await fetch('http://localhost:8000/api/users-service/allUser', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await resp.json();
    return data;
  }
}
