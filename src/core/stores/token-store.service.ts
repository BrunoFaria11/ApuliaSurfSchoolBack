import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

// declare function do_(): any;

@Injectable({ providedIn: 'root' })
export class TokenStoreService {
  constructor() { }

  _token = new BehaviorSubject<string>("");
  token$ = this._token.asObservable();

  get Token(): any {
    return this._token.getValue();
  }

  set Token(val: any) {
    this._token.next(val);
  }

  change(token: string) {
    this.Token = token;
    localStorage.setItem('token',token);
  }
}
