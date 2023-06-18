import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { BatchDetailComponent } from './_components/batch-detail/batch-detail.component';
import { ItemDetailsComponent } from './_components/item-details/item-details.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: 'full'},
  {path: "home", component: HomeComponent},
  {path: "batch/:batchNum", component: BatchDetailComponent},
  {path: "item-details/:docId/:batch", component: ItemDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
