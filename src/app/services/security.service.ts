import { Injectable } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  public profile?: KeycloakProfile;

  constructor(public kcService: KeycloakService) {
    this.init();
  }

  init() {
    this.kcService.keycloakEvents$.subscribe({
      next: (e) => {
        console.log('Keycloak event:', e); // Ajoutez un log ici
        if (e.type === KeycloakEventType.OnAuthSuccess) {
          console.log('Auth Success, loading user profile...');
          this.kcService.loadUserProfile().then(profile => {
            console.log('Profile loaded:', profile);
            this.profile = profile;
          }).catch((profileError) => {
            console.error('Error loading user profile:', profileError);
          });
        }
      },
      error: (err) => {
        console.error('Error in keycloakEvents$: ', err); // Ajouter un log pour l'erreur
      }
    });
  }

  public hasRoleIn(roles: string[]): boolean {
    const userRoles = this.kcService.getUserRoles();
    console.log('User roles:', userRoles); // Ajoutez un log ici pour vérifier les rôles
    for (let role of roles) {
      if (userRoles.includes(role)) return true;
    }
    return false;
  }
}
