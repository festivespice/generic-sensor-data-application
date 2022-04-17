import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import { PageInvalidComponent } from './components/page-invalid/page-invalid.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: 'register', component:RegisterComponent},
  {path: 'login', component:LoginComponent},
  {path: 'home', component:HomeComponent},
  {path: 'invalid', component: PageInvalidComponent},
  {path: '**', redirectTo:'invalid'} //this one redirects anything else to home. Must be last!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
