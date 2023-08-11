import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { BatchDetailComponent } from './_components/batch-detail/batch-detail.component';
import { LoginComponent } from './_components/login/login.component';

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent},
  {path: "batch/:batchNum", component: BatchDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
