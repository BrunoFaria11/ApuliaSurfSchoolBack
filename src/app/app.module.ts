import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { UserTableComponent } from "./components/user-table/user-table.component";
import { UserComponent } from "./containers/user/user.component";
import { AppRoutingModule } from "./app-routing.module";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { PackListComponent } from "./containers/pack-list/pack-list.component";
import { LessonsListComponent } from "./containers/lessons-list/lessons-list.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { AgendaComponent } from "./components/agenda/agenda.component";
import { AuthModule } from "@auth0/auth0-angular";
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent, UserTableComponent, AgendaComponent, UserComponent, UserTableComponent, CalendarComponent, PackListComponent, LessonsListComponent, DashboardComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        AuthModule.forRoot({
            domain:  environment.domain,
            clientId: environment.clientId,
            authorizationParams: {
              redirect_uri:  environment.redirect_uri,
              audience: environment.audience,
              scope:  'openid profile email offline_access', 
            },
            useRefreshTokens: true
          }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

