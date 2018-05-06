import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ArticleService, apiUrlStubInService } from '../article.service';

// Take 1: NAH. Not for us: Just FormControl, on one <input> (for headline) This is really for SEARCH.
// https://blog.thoughtram.io/angular/2016/06/22/model-driven-forms-in-angular-2.html#forms-with-a-single-control
// import { FormControl } from '@angular/forms';

// Take 2: Template-Driven
// NO NEED for additional imports viz. Form. Just in app.module.ts where we get { FormsModule }
// https://www.tektutorialshub.com/angular-passing-parameters-to-route/
// https://stackblitz.com/github/Harvard-DCE-CSCIE3/angular-routing-and-CRUD?file=src%2Fapp%2Fphotodetail%2Fphotodetail.component.ts

// Take 3: Adding in REACTIVE-MODEL-DRIVEN Form
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.css'],
    providers: [ArticleService]
})
export class ArticleDetailComponent {

    theArticleIdHereInDetailPage;
    theArticleHereInDetailPage;

    articleTitleCachedBeforeEdit;

    editing: boolean = false;

    // Passed in, essentially, ("imported from") ArticleService
    apiUrlStubInThisComponent;

    // Will be filled out (with ID) inside getArticle()
    articleApiUrlWithId;


    subscriptionForId; // reference to the Subscription we create, so that we can also Destroy it

    // FORM STUFF
    // "Take 1" << We are NOT doing
//    articleTitleInputFormControl = new FormControl();

    // Take 3
    myArticleEditFormGroup: FormGroup;

    constructor(
        private _myActivatedRoute: ActivatedRoute,
        private _myArticleService: ArticleService
    ) {  }

    ngOnInit() {
//        console.log('ngOnInit this._myArticleService.apiUrlStubInService ', this._myArticleService.apiUrlStubInService); // undefined. hmm.

/* WORKED when apiUrl etc. was INSIDE already-getting-exported class
        this.apiUrlStubInThisComponent = this._myArticleService.apiUrlStubInService;
*/
// Now as its own export const:
        this.apiUrlStubInThisComponent = apiUrlStubInService;

        this.getArticle();

/* Form "Take 1" We are NOT doing/
        this.articleTitleInputFormControl.valueChanges
            .subscribe(
                (valueSeen) => {
                    // Value seen in <input> for headline
                    console.log('wow. OnInit. headline valueChanges: ', valueSeen);
                }
            )
*/
        // TAKE 3 w. Forms
        this.myArticleEditFormGroup = new FormGroup({
            'articleTitle_formControlName': new FormControl(null, [Validators.required, Validators.minLength(4)])
        });
        // Q. ?? this.theArticleHereInDetailPage.articleTitle ?? instead of null?
        // A. No. null appears correct. Here in OnInit it's undefined, to try to get the title etc.
    }

    getArticle(): void {

        this.subscriptionForId = this._myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                // data... In the case of an ActivatedRoute, what it sends back when you subscribe is the Params (apparently). Bueno.
                // Note: This param name ('article_id') is set in the app.module.ts appRoutes
                this.theArticleIdHereInDetailPage = paramsIGot['article_id']

                this.articleApiUrlWithId = this.apiUrlStubInThisComponent + this.theArticleIdHereInDetailPage;

                // Now, here, right inside the SUBSCRIBE (Observable) to get the ID,
                // let us directly proceed, with that freshly gotten ID, to
                // go ahead right here and use the articleIdParam to now
                // go get the Article from the Service.
                // (That is, by contrast, I had first thought these lines of code would
                //   go *down below* the whole tri-part "subscribe" thing.
                //   That first intuition was NOT RIGHT.)
                this._myArticleService.getArticle(this.theArticleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot) => {
                            // data...
                            this.theArticleHereInDetailPage = articleIGot;
                            console.log('subscribe : this.theArticleHereInDetailPage ', this.theArticleHereInDetailPage) // Yes: the object {} from MongoDB
                        },
                        (error) => {
                            // error
                            console.log('subscribe get Article Error: ', error)
                        },
                        () => {
                            // done
                        }
                    )
            },
            (errorIThink) => {
                // error
                console.log('subscribe get Param Id Error: ', errorIThink)
            },
            () => {
                // done
            }
        );
    } // /getArticle()



    letUsEdit() {
        // Grab title (headline) before edit
        // Q. Why?
        // A. If they hit Cancel, not Save, we want to restore it.
        // Further A.: Recall, with 2-way data binding, we are letting them
        // (for fun) be able to SEE their edit live on the page.
        // But since that is changing the value in the actual property,
        // if they do hit Cancel we need to be able to restore.
        this.articleTitleCachedBeforeEdit = this.theArticleHereInDetailPage.articleTitle
        this.toggleEdit()
    }

    letUsCancel() {
        // Restore any edit they may have done in the 2-way binding!
        if (this.theArticleHereInDetailPage.articleTitle !== this.articleTitleCachedBeforeEdit) {
            if (confirm('Are you sure you wish to cancel your editing?')) {
                this.theArticleHereInDetailPage.articleTitle = this.articleTitleCachedBeforeEdit // Put cached value back on
                this.toggleEdit()
            } else {
                // User did do some editing, clicked Cancel, then said "No" to leaving, abandoning edits. Wants to KEEP edits, and keep on editing. hmm.
                // just return to where it was ? hmm
                console.log('else nuttin ');
            }
        } else {
          // No editing changes detected. They clicked Cancel. Just proceed to cancel out. Leave editing mode.
           this.articleTitleCachedBeforeEdit = ''; // empty out y not
           this.toggleEdit()
        }
    }

    toggleEdit() {
        console.log('letUsEdit ', this.editing)
        this.editing = this.editing ? false : true; // toggle. if true, make false. And vice versa
    }


    letUsSave(whatIsPassedIn: any): void {
/* This only references the property here on the component.
         console.log('we are saving ... theArticleHereInDetailPage._id ', this.theArticleHereInDetailPage._id)
*/
// We want the object passed from the form, to save the edits
        console.log('edit/update time - whatIsPassedIn ', whatIsPassedIn) // YES gets edit. OK

        // 1. Just whamma-jamma newly edited value onto the component itself:
        this.theArticleHereInDetailPage.articleTitle = whatIsPassedIn.articleTitle_name
        console.log('this.theArticleHereInDetailPage.articleTitle ', this.theArticleHereInDetailPage.articleTitle ); // Yes. Edited title.

        // 2. Time to go to the database to update it
        console.log('About to use service. this.theArticleIdHereInDetailPage is ', this.theArticleIdHereInDetailPage) // Yes. Correct ID.
         this._myArticleService.updateArticle(this.theArticleIdHereInDetailPage, whatIsPassedIn)
            .subscribe(
                (fromDatabaseEditedArticle) => {
                    // data
                    console.log('whoa. fromDatabaseEditedArticle ', fromDatabaseEditedArticle);
                    /*
                    Remember, after PUT or POST, good
                    practice to move the user OFF
                    the form page. Prevents submitting
                    twice & Etc.
                    Though whole page/app reload is kinda brutal.
                     */

                    // location.replace('/') // works, but also a reload, and takes you to Home, not so good
                    location.reload() // okay we'll go with it.
                }
            )
    }

    letUsSaveReactive() {
        /* 20180505_1552 TODO
        Wow. This is NOT easy, simple, straightforward.
        Jesus Christ.
        Better see:
        - https://toddmotto.com/angular-2-form-controls-patch-value-set-value
        - https://stackoverflow.com/questions/45366955/same-form-for-creating-and-editing-data-angular4
        - https://github.com/PeterKassenaar/ng2-form-edit/blob/master/app/edit/city.edit.component.ts
         */
        // Does not need param passed in
        console.log('this.myArticleEditFormGroup.value is ', this.myArticleEditFormGroup.value)

    }

    letUsDelete() {
        if (confirm('All right, you sure you wish to delete this article?')) {
            console.log('we are deleting ...theArticleHereInDetailPage._id ', this.theArticleHereInDetailPage._id)
            this._myArticleService.deleteArticle(this.theArticleIdHereInDetailPage)
                .subscribe(
                    (articleJustDeleted) => {
                        // data back
                        console.log('whoa. articleJustDeleted ', articleJustDeleted);
/*
                        location.reload(); // << No. Tries to bring up page for article you just deleted! D'oh!
*/
                        location.replace('/articles') // Better
                    }
                )

        } else {
            // do nuttin'
        }
    }

    ngOnDestroy() {
        this.subscriptionForId.unsubscribe();
    }
}