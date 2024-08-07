import { Routes } from '@angular/router';
import { HomeNoConnectedComponent } from './components/home-no-connected/home-no-connected.component';
import { HomeConnectedComponent } from './components/home-connected/home-connected.component';
import { ConnectWithExistingAccountComponent } from './components/connect-with-existing-account/connect-with-existing-account.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { TalksPageComponent } from './components/talks-page/talks-page.component';
import { WalletPageComponent } from './components/wallet-page/wallet-page.component';
import { TalkingPageComponent } from './components/talking-page/talking-page.component';
import { ContactAddComponent } from './components/contact-add/contact-add.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { HomeNewUserComponent } from './components/home-new-user/home-new-user.component';
import { ProfilInfoComponent } from './components/profil-info/profil-info.component';
import { UnlockScreenComponent } from './components/unlockscreen/unlockscreen.component';
import { ConfidentialityComponent } from './components/confidentiality/confidentiality.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home-no-connected', pathMatch: 'full' },

    { path: 'home-no-connected', component: HomeNoConnectedComponent },

    { path: 'unlock-screen', component: UnlockScreenComponent},

    {path: 'confidentiality', component: ConfidentialityComponent, canActivate: [AuthGuard]},

    { path: 'home-connected', component: HomeConnectedComponent, canActivate: [AuthGuard]},

    {path: 'connect-with-existing-account', component: ConnectWithExistingAccountComponent},

    {path: 'contacts-page', component: ContactsPageComponent, canActivate: [AuthGuard]},

    {path: 'settings-page', component: SettingsPageComponent, canActivate: [AuthGuard]},

    {path: 'talks-page', component: TalksPageComponent, canActivate: [AuthGuard]},

    {path:'wallet-page', component: WalletPageComponent, canActivate: [AuthGuard]},

    {path:'talking-page', component: TalkingPageComponent, canActivate: [AuthGuard]},

    {path: 'add-contact', component: ContactAddComponent  , canActivate: [AuthGuard]},

    {path: 'home-new-user', component: HomeNewUserComponent, canActivate: [AuthGuard]},

    {path: 'contact-details', component: ContactDetailsComponent, canActivate: [AuthGuard]},

    {path: 'profil-info', component: ProfilInfoComponent, canActivate: [AuthGuard]},

    { path: '**', redirectTo: '/home-no-connected'},
    // Ajoutez d'autres routes ici
];
