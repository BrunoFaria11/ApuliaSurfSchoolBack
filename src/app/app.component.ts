import { Component } from '@angular/core';
import { MenuStoreService } from '../core/stores/menu-store.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  activeMenu!: string ;

  constructor(private router: Router,public menuStore: MenuStoreService,public auth: AuthService) {
    this.activeMenu = localStorage.getItem('menu') ?? 'dashboard';
    this.router.navigate(['/' + this.activeMenu]);
  }

  logOut() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
  }

  setActive(menu: string) {
    this.menuStore.change(menu);
  }
}
