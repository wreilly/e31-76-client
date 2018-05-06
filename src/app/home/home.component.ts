import { Component } from '@angular/core'

import { apiUrlStubInService } from '../article.service'
/*
Interesting. (I think.)
Because from the "ArticleService" all I am importing for this Component
is a mere exported cont (an API URL stub),
I do *not* need to put "ArticleService" into the providers:[] array  on
the Component decorator. I think.
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
}