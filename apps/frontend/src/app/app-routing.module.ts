import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

const redirectLoggedInToChat = () => redirectLoggedInTo(['/chat']);


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginComponentModule),
    ...canActivate(redirectLoggedInToChat)
  },
  {
    path: 'chat',
    loadChildren: () => import('./components/chat/chat.module').then( m => m.ChatComponentModule),
    ...canActivate(redirectUnauthorizedToLogin)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
