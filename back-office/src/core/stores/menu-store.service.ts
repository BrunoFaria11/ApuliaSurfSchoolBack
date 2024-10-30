import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

// declare function do_(): any;

@Injectable({ providedIn: 'root' })
export class MenuStoreService {
  constructor() { }

  _menu = new BehaviorSubject<string>("");
  menu$ = this._menu.asObservable();

  get Menu(): any {
    return this._menu.getValue();
  }

  set Menu(val: any) {
    this._menu.next(val);
  }

  change(menu: string) {
    this.Menu = menu;
    localStorage.setItem('menu',menu);
  }
}
