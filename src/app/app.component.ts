import { Component } from '@angular/core';
import { MenuStoreService } from '../core/stores/menu-store.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { TokenStoreService } from '../core/stores/token-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  activeMenu!: string;

  constructor(private router: Router, public menuStore: MenuStoreService, public tokenStore: TokenStoreService, public auth: AuthService) {
    this.activeMenu = localStorage.getItem('menu') ?? 'dashboard';
    this.router.navigate(['/' + this.activeMenu]);

    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.auth.getAccessTokenSilently().subscribe(
          (token) => {
            tokenStore.Token = token;
          },
        );
      }
    })
  }

  logOut() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
  }

  setActive(menu: string) {
    this.menuStore.change(menu);
  }
}
