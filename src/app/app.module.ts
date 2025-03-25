import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
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
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "./guards/security.guard";
import { APP_INITIALIZER, NgModule } from "@angular/core";

// Définition des routes
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ["SENIOR", "MANAGER"] }},
  { path: 'Users', component: UsersComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER", "MANAGER"] }},
  { path: 'Faq', component: FaqComponent, canActivate: [AuthGuard], data: { roles: ["SENIOR", "MANAGER"] }},
  { path: '**', redirectTo: 'dashboard' }
];

// Fonction d'initialisation de Keycloak
export function kcFactory(kcService: KeycloakService, securityService: SecurityService, router: Router) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      kcService.init({
        config: {
          realm: 'test',
          clientId: 'test',
          url: 'http://localhost:8080',

        },
        initOptions: {
          onLoad: 'login-required', // Force login si l'utilisateur n'est pas connecté
          redirectUri: 'http://localhost:4200/dashboard',
          checkLoginIframe: false,
          scope: 'openid profile email',
        }
      }).then(async (authenticated) => {
        console.log('✅ Authenticated:', authenticated);

        if (!authenticated) {
          console.warn('⚠️ User not authenticated');
          reject('User not authenticated');
          return;
        }

        console.log("➡️ Auth OK, récupération du token");

        try {
          await kcService.updateToken(30); // Met à jour le token si nécessaire
          console.log("🔄 Token updated");

          // Charge le profil utilisateur
          const profile = await kcService.loadUserProfile();
          if (!profile) {
            console.error('❌ Profil non récupéré ou invalide');
            reject('Profil non récupéré ou invalide');
            return;
          }

          console.log('Profil récupéré:', profile);
          securityService.profile = profile; // Sauvegarde du profil dans le service de sécurité

          // Redirection vers le dashboard après authentification réussie
          router.navigate(['/dashboard']);
          resolve();

        } catch (profileError) {
          console.error('❌ Error lors du chargement du profil:', profileError);
          reject(profileError);
        }

      }).catch((initError) => {
        console.error('❌ Erreur d\'initialisation de Keycloak:', initError);
        reject(initError);
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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
  ],
  exports: [RouterModule],
  providers: [
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
