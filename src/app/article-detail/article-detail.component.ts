import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ArticleService, apiUrlStubInService, imgUrlStubInService } from '../article.service';

// https://stackoverflow.com/questions/38398877/how-do-i-declare-a-model-class-in-my-angular-2-component-using-typescript
import { Wrarticle } from '../wrarticle'


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

    theArticlePhotosArrayHereInDetailPage;
    /*
    From MongoDB, our input here is an Array, that holds one String, holding a stringified Array:
    O la.
     [ "[\"sometimes__1525986614512_010006-MexAmerican.jpg\",\"sometimes__1525986614515_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg\"]" ]

    What we want is an Array of Strings:  JSON.parse() does this for us.
     articlePhotos: (2) 
     ["sometimes__1525988911510_010006-MexAmerican.jpg", "sometimes__1525988911513_AndToThinkWeAllPlayedASma…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"]


     */

    articleTitleCachedBeforeEdit;

    editing: boolean = false;

    // Passed in, essentially, ("imported from") ArticleService
    apiUrlStubInThisComponent;

    // NEW. For <IMG SRC="" />  E.g. http://0.0.0.0:8089/
    imgUrlStubInThisComponent;

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


        this.imgUrlStubInThisComponent = imgUrlStubInService;

        // TAKE 3 w. REACTIVE-MODEL-DRIVEN Form:
        this.myArticleEditFormGroup = new FormGroup({
            'articleTitle_formControlName': new FormControl(null, [Validators.required, Validators.minLength(4)])
        });
        // Q. ?? this.theArticleHereInDetailPage.articleTitle ?? instead of null?
        // A. No. null appears correct. Here in OnInit you get 'undefined', to try to get the title etc. at this (early) point.

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





    }

    getArticle() {

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
                        (articleIGot: { articleTitle: string, articlePhotos: string }) => {
                            // data...
                            this.theArticleHereInDetailPage = articleIGot;
                            console.log('subscribe : this.theArticleHereInDetailPage ', this.theArticleHereInDetailPage) // Yes: the object {} from MongoDB
                            // Fill in that REACTIVE Form, too!
                            this.myArticleEditFormGroup.patchValue({
                                articleTitle_formControlName: articleIGot.articleTitle
                            });

                            /*
                            Let's transform the Photo File Names
                            In the database they are JSON.stringify()
                            Now time to JSON.parse()
                             */
                            this.theArticlePhotosArrayHereInDetailPage = JSON.parse(articleIGot.articlePhotos)
                            console.log('this.theArticlePhotosArrayHereInDetailPage ', this.theArticlePhotosArrayHereInDetailPage);
                            /*
                            Yes
                             ["sometimes__1525988911510_010006-MexAmerican.jpg", "sometimes__1525988911513_AndToThinkWeAllPlayedASma…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"]
                             0
                             :
                             "sometimes__1525988911510_010006-MexAmerican.jpg"
                             1
                             :
                             "sometimes__1525988911513_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"
                             */



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

        /* From the HTML:
         <form ref-myArticleEditForm_ref="ngForm" on-ngSubmit="letUsSave(myArticleEditForm_ref.value)">
         */
        // Note: ngSubmit takes care of the event.preventDefault() for you.
        //      (Had we used simply 'submit', we'd have had to do the preventDefault() here.)

/* This only references the property here on the component.
         console.log('we are saving ... theArticleHereInDetailPage._id ', this.theArticleHereInDetailPage._id)
*/
// We want the object passed from the form, to save the edits
        console.log('edit/update time - whatIsPassedIn ', whatIsPassedIn) // YES gets edit. OK
        /* E.g.,
         {articleTitle_name: "Scott TEMPLATE EDIT Pruitt REACTIVE EDIT Before th…ncy Homes, a Shell Company and Friends With Money"}
         VM147086 article-detail.component.ts:143
         */

        // 1. Just whamma-jamma newly edited value onto the component itself:
        /*
        Q. Do I really have to do the whamma-jamma, since I am already doing (for fun) 2-way binding out on that HTML page with the Form?
           (That is, this bit of code came from some example somewhere, and they (like
           most people) did not introduce potentially distracting 2-way binding
           on the HTML page with their form.) And so they do proceed to do whamma-jamma.
        A. Let's try without. ... (musical interlude) ...
           Hey! I was correct-a-mundo. Yippee-zippie.
         */
/* Can safely be commented out. Bon.
        this.theArticleHereInDetailPage.articleTitle = whatIsPassedIn.articleTitle_name
*/
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

    letUsSaveReactive(formGroupPassedIn) {

        /* From the HTML:
         <form [formGroup]="myArticleEditFormGroup" on-ngSubmit="letUsSaveReactive(myArticleEditFormGroup)">
         */
        // Note: (As noted above) - ngSubmit takes care of the event.preventDefault() for you.
        //      (Had we used simply 'submit', we'd have had to do the preventDefault() here.)


        /*
            letUsSaveReactive({ value, valid }) { ...
            // Use destructuring to get these two things off the FormGroup: .value, .valid. Very groovy.
         */
        /* 20180505_1552 TODO
        Wow. This is NOT easy, simple, straightforward.
        Jesus Christ.
        Better see:
        - https://toddmotto.com/angular-2-form-controls-patch-value-set-value
        - https://stackoverflow.com/questions/45366955/same-form-for-creating-and-editing-data-angular4
        - https://github.com/PeterKassenaar/ng2-form-edit/blob/master/app/edit/city.edit.component.ts
         */
        // Does not need param passed in << Hmm. Think again.
        console.log('this.myArticleEditFormGroup.value is ', this.myArticleEditFormGroup.value)
        /* Yes:
              { articleTitle_formControlName: "Foosball I typed into empty input box. Cheers." }
         */
        console.log('this.myArticleEditFormGroup is ', this.myArticleEditFormGroup)



        //
        console.log('formGroupPassedIn ', formGroupPassedIn)
        /*
         formGroupPassedIn  FormGroup {validator: null, asyncValidator: null, _onCollectionChange: ƒ, pristine: false, touched:
         */
        console.log('formGroupPassedIn.value', formGroupPassedIn.value)
        // { articleTitle_formControlName: "Foosball I typed into empty input box. Cheers." }
        console.log('formGroupPassedIn.valid  ', formGroupPassedIn.valid)
        // true

        console.log('Is they the same? formGroupPassedIn === this.myArticleEditFormGroup ', formGroupPassedIn === this.myArticleEditFormGroup)
        // true  !!! :o)

        /* All right. Time to now actually DO something.

        UPDATE: Looks like you want/need this up in ngOnInit() !
        UPDATE # 2: Actually, we put it in getArticle() (which is yes called right from ngOnInit()).

        This "PATCH" business is how we "bind" (if I may say?), or "set" (better),
        the value of the Article data we have right now right here in this Component instance.
        We are "setting it" into the FormGroup, which is what makes the data available
        out there on the HTML view, in the HTML Form Input field.
         */


/* Not Done Here. See above (in getArticle(), called by ngOnInit())
        formGroupPassedIn.patchValue({
            articleTitle_formControlName: this.theArticleHereInDetailPage.articleTitle
        });
*/

        /* "Non-D.R.Y." I suppose:
        We are going to do same database call as we do in letUsSave()
         */
        // 1. NOT NEEDED! The data value is ALREADY here on the Component, via REACTIVE FORM. I think.
        // Just whamma-jamma newly edited value onto the component itself:
 ////       this.theArticleHereInDetailPage.articleTitle = whatIsPassedIn.articleTitle_name
 ////       console.log('this.theArticleHereInDetailPage.articleTitle ', this.theArticleHereInDetailPage.articleTitle ); // Yes. Edited title.

        // 2. Time to go to the database to update it
        console.log('REACTIVE EDIT FORM. About to use service. this.theArticleIdHereInDetailPage is ', this.theArticleIdHereInDetailPage) // Yes. Correct ID.

        /* One Further Little Cleanup!
        1. articleTitle_formControlName: "Scott Pruitt..."
        2. articleTitle_name: "Scott Pruitt..."
        3. articleTitle: "Scott Pruitt..."

        # 1 is how I name it on the REACTIVE Form
        # 2 is how I name it on the TEMPLATE Form (and in most all of the app)
        # 3 is how it is named in the database c/o MongoDB

        Need to, right here, move this from # 1 to # 2.
         (The change from # 2 to # 3 happens in the REST API.)
         */
        // HARD-CODED WAY:
        // Works, but NO we are not using this.
        const updateToMakeHardCoded = {
            articleTitle_name: formGroupPassedIn.value.articleTitle_formControlName
        }

        // HARD-CODED-ISH, Configurable (Using a class new constructor! nice.)
        /*
        I.
        Let's say we had this (plus maybe more fields)  in our database. Wondeful.
        article: {
          articleTitle: "asf",
          articleUrl: "http",
          articleCategory: "Opinion"
        }

        II.
        And let's say William had naming conventions God Knows Why, in the code in the  app:
         article: {
         articleTitle_name: "asf",
         articleUrl_name: "http",
         articleCategory_name: "Opinion"
         }
         Something about getting the data values off HTML Form Input Fields "name" attributes.
         Okay.

         III.
         And let's say William again ("that William") had naming conventions God Knows Why, in the code in the REACTIVE-MODEL-DRIVEN FORMS part of the app:
         article: {
         articleTitle_formControlName: "asf",
         articleUrl_formControlName: "http",
         articleCategory_formControlName: "Opinion"
         }
         Something about learning about "how all this works, really." (Ye Gods.)


         IV.
         Now, All We Gotta Do is...
         Get from type III. to type II.
         (If you are wondering how we get from type II. to type I., the answer to that is in the REST API. All done, all set honey, no need think about it further.)

         Hmm. Seems almost you'd want to simply "new up" an Article!
         (What a concept.)
         Except we don't have any Article class here, do we ?? ??
         // https://stackoverflow.com/questions/38398877/how-do-i-declare-a-model-class-in-my-angular-2-component-using-typescript

         Wrarticle (ta-da!) = now we do.
         For testing etc., this Class has 3 fields, but really I right now need only 1.

         constructor(title, url, category) {
           this.articleTitle_name = title;
           this.articleUrl_name = url;
           this.articleCategory_name = category;
         }
         */

        // YES. We are using this:
        const updateToMakeHardCodedIshConfigurable = new Wrarticle(formGroupPassedIn.value.articleTitle_formControlName, 'myhttp', 'mycategory') // We omit url, category. should be ok. << HAH! WRONG-O. (thilly) We now instead SUPPLY a dummy-value for each.



        /* NO.
        DANG! This RegEx way we are ABANDONING!
        Seems JavaScript doesn't really want you messing with trying to write variable values into the Key string names for Objects. At least, for me.
        See above for more "hard-coded-ish", configurable, less flexible but oughta work solution.
         */
        // REGEX or some such way:
        /* N.B. These are KEY NAMES, not the String Values!
        INPUT field_formControlName
        OUTPUT field_name
         */
        /* Need to first get these key names as strings, onto some variable. Whoa.
 Excellent:        myBunchOfKeyNames ["articleTitle_formControlName"]
         */
        const myBunchOfKeyNames = Object.keys(formGroupPassedIn.value)
        console.log('myBunchOfKeyNames', myBunchOfKeyNames);


        /* From REST API, Assignment 5, /MIDDLEWARE/TRIM-URL-IS-ALL.JS:
         * Typical Input:
         https://www.nytimes.com/2018/03/26/world/europe/trump-russia-diplomats-expulsion.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=first-column-region&region=top-news&WT.nav=top-news
         * Desired Output:
         https://www.nytimes.com/2018/03/26/world/europe/trump-russia-diplomats-expulsion.html
         * RegEx: */
// NAIVELY FIRST THOUGHT:       string.replace(/(.)\?/, $1)
// AFTER MUCH STRUGGLE, SEARCH: string.replace(/(.*?\?(?:(?!\?))).*/, '$1')
// btw,  it is the *2nd* '?' question mark in that crazy string
//        that represents the '?' in the NYTimes URL we are trying to find. Cheers.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
//

        console.log('PRE-REGEX! myBunchOfKeyNames[0] was: ', myBunchOfKeyNames[0])
        myBunchOfKeyNames[0] = myBunchOfKeyNames[0].replace(/(.*?_form(?:(?!\?))).*/, '$1');
        console.log('MIDDLEWARE! POST-REGEX! myBunchOfKeyNames[0] now is: ', myBunchOfKeyNames[0]);


//         articleTitle_formControlName
//         .replace(/(.*?\_form(?:(?!\?))).*/, '$1')
//         .replace(/(.*?_form(?:(?!\?))).*/, '$1')   <<< Note: You can remove that '\' that was escaping when we were looking for a '?' Now that we look for simply '_form', no need for escaping '\'. Cheers.
//         articleTitle_form


        const firstTestKeyName = myBunchOfKeyNames[0];

        /*
// .replace(/(.*?\?(?:(?!\?))).*!/, '$1')
// WE GET:   https://www.nytimes.com/section/politics?  << Note the final ? is still on the string.
// HAD BEEN: https://www.nytimes.com/section/politics?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Politics&WT.nav=page
*/

        // NO. We are NOT using this.
        const updateToMakeRegExed = {
/* NO:
        myBunchOfKeyNames[0]: formGroupPassedIn.value.articleTitle_formControlName
*/
            'firstTestKeyName': formGroupPassedIn.value.articleTitle_formControlName
        }





        /* #################################### */


        /* Nope: formGroupPassedIn.value << Wrong naming convention! articleTitle_formControlName vs. articleTitle_name
         * YEP!: updateToMakeHardCoded
         * Nope: updateToMakeRegExed
         * YEP!!: updateToMakeHardCodedIshConfigurable << USING THIS.
          * */
        this._myArticleService.updateArticle(
            this.theArticleIdHereInDetailPage,
            updateToMakeHardCodedIshConfigurable
        )
            .subscribe(
                (fromDatabaseEditedArticle) => {
                    // data
                    console.log('whoa. REACTIVE EDIT FORM fromDatabaseEditedArticle ', fromDatabaseEditedArticle);
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