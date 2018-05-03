import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {HomeComponent} from "./home/home.component";
import {ArticleListComponent} from "./article-list/article-list.component";
import { ArticleDetailComponent } from "./article-detail/article-detail.component"



const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/:article_id', component: ArticleDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    HeaderComponent,
    FooterComponent,
      HomeComponent,
      ArticleListComponent,
      ArticleDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
