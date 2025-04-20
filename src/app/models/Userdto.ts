import { Role } from './Role';

export interface Userdto {
    userName: string;
    password?: string;
    nom?: string;
    prenom?: string;
    cin?: number;
    email?: string;
    dateNaissance?: Date;
    numTel?: number;
    role?: Role  ;
}

