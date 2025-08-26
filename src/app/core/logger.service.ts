import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logs: string[] = [];

  log(str: string) {
    console.log(str);
    this.logs.push(str);
  }
}
