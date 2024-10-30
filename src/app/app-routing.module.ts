import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './containers/user/user.component';
import { CalendarComponent } from './containers/calendar/calendar.component';
import { PackListComponent } from './containers/pack-list/pack-list.component';
import { LessonsListComponent } from './containers/lessons-list/lessons-list.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pack/:clientId',
    component: PackListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reservation/:clientId',
    component: LessonsListComponent,
    canActivate: [AuthGuard]
  },
  // { path: 'login', component: LoginComponent },
  // { path: '**', pathMatch: 'full', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
