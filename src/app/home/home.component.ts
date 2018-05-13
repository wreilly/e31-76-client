import { Component } from '@angular/core'

import { apiUrlStubInService, imgUrlStubInService } from '../article.service'
/*
Interesting. (I think.)
Because from the "ArticleService" all I am importing for this Component
is a mere exported cont (an API URL stub),
I do *not* need to put "ArticleService" into the providers:[] array  on
the Component decorator. I think. << Correct-a-mundo
 */

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {
    title = 'Some Times';
    subTitle = 'Newspaper Articles Reference Site - Angular CRUD - with REST API';
    apiUrlStubInHome = apiUrlStubInService;
    imgUrlStubInHome = imgUrlStubInService;
    gitRepo = 'Non-Combo: e31-76-client and e31-75-server';
    mongodbCollection = 'articles';
}