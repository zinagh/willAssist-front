import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { environment } from "./environment/environment";
import { SecurityService } from "./services/security.service";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { BaseComponent } from "./base/base.component";
import { ProfileComponent } from "./profile/profile.component";
import { UsersComponent } from "./users/users.component";
import { FaqComponent } from "./faq/faq.component";
import { BrowserModule } from "@angular/platform-browser";
import { Router, RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "./guards/security.guard";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { KeycloakInterceptor } from "./keycloak.interceptor";
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AddResponseComponent } from './add-response/add-response.component';
import { ResponseViewComponent } from './response-view/response-view.component';
import { UpdateQuestionComponent } from './update-question/update-question.component';
import { UpdateResponseComponent } from './update-response/update-response.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'addQuestion', component: AddQuestionComponent },
  { path: 'updateQuestion/:id', component: UpdateQuestionComponent },
  { path: 'updateResponse/:id', component: UpdateResponseComponent },
  { path: 'response/:id', component: ResponseViewComponent },
  { path: 'addReponse/:questionId', component: AddResponseComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: 'update-profile', component: UpdateProfileComponent },
  { path: 'dashboard', component: DashboardComponent , },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard] , data: { roles: ["SENIOR" , "MANAGER" ] }},
  { path: 'Users', component: UsersComponent, canActivate: [AuthGuard] , data: { roles: ["IMANAGER" , "MANAGER" ] }},
  { path: 'Faq', component: FaqComponent, canActivate: [AuthGuard] , data: { roles: ["SENIOR" , "MANAGER" ] }},
  { path: '**', redirectTo: 'dashboard' }
];




export function kcFactory(kcService: KeycloakService, securityService: SecurityService, router: Router) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      kcService.init({
        config: {
          realm: 'teamw',
          clientId: 'teamw',
          url: 'http://localhost:8080' // Assurez-vous que votre Keycloak est sur cette adresse
        },
        initOptions: {
          onLoad: 'login-required',
          redirectUri: 'http://localhost:4200/dashboard',
          checkLoginIframe: true
        }
      }).then((authenticated) => {
        console.log('Authenticated:', authenticated);
        if (authenticated) {
          kcService.loadUserProfile().then(profile => {
            console.log('Profile:', profile);
            securityService.profile = profile;
            const userRoles = kcService.getUserRoles();
            console.log('User Roles:', userRoles);
            // Vous pouvez rediriger l'utilisateur vers le tableau de bord ou une autre page selon le rôle
            if (userRoles.includes('MANAGER')) {
              router.navigate(['/dashboard']);
            }
            resolve();
          }).catch((profileError) => {
            console.error('Profile Load Error:', profileError);
            reject(profileError);
          });
        } else {
          console.log('User not authenticated');
          resolve(); // Vous pouvez aussi utiliser reject() si nécessaire
        }
      }).catch((error) => {
        console.error('Init Error:', error);
        reject(error);
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BaseComponent,
    FooterComponent,
    ProfileComponent,
    UsersComponent,
    FaqComponent,
    AddUserComponent,
    UpdateProfileComponent,
    AddQuestionComponent,
    AddResponseComponent,
    ResponseViewComponent,
    UpdateQuestionComponent,
    UpdateResponseComponent,
  ],
  imports: [
    MatIconModule,
    MatMenuModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: KeycloakInterceptor, multi: true },

    AuthGuard,
    SecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService, SecurityService, Router],
      multi: true,


    },
  ],
bootstrap: [AppComponent],
})
export class AppModule {}
