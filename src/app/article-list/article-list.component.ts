import { Component, OnInit, VERSION } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService, apiUrlStubInService } from '../article.service';

// For file upload stuff we'll first try the HTTP POST from right here in the Component; later to the Service. t.b.d.
import { HttpClient } from '@angular/common/http'


@Component({
    selector: 'app-article-list',
    templateUrl: 'article-list.component.html',
    styleUrls: ['article-list.component.css'],
    providers: [ArticleService, HttpClient]
})
export class ArticleListComponent {
    angularVersion = VERSION

    copyrightYear = '2018';
    articles = [];
    howMany = 0; // # of Articles to get. user input, click
    articlesHowMany = []; // Articles user requested, via button click
    apiUrlStubInApp = ''; // init, create a Property
    titleToDisplay: string;

    /* ====================================== */
    /* === CREATE ARTICLE FORM stuff .... === */
    /* ====================================== */
    articleIJustCreatedBoolean = false;
    articleIJustCreatedDisplay: any; // screw it = { articlePhotos: 'any' };

    photosFilenamesArray = []; // ORIGINAL Filenames.
    // Populated by onPhotosFileChangePostFiles()
    // e.g. AndToThinkWeAl…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg

    photosRenamedFilenamesArray = []; // After Multer on Server
    // Called from onPhotosFileChangePostFiles() which calls myServiceFilesUpload()
    // e.g. sometimes__1525980207472_AndToThinkWeAl…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg

    addArticleForm: FormGroup;
    loadingPhotos = false; //         // https://nehalist.io/uploading-files-in-angular2/
    /* ====================================== */
    /* ====================================== */
    /* ====================================== */

    constructor(
        private _myArticleService: ArticleService,
        private _myHttpService: HttpClient
    ) { }

    ngOnInit() {

/* WORKED. When apiUrlStub etc. was INSIDE the exported class:
        this.apiUrlStubInApp = this._myArticleService.apiUrlStubInService;
*/
// Now (for heck of it and/or learning), trying to import and use as mere const:
        this.apiUrlStubInApp = apiUrlStubInService

        // this.getAllArticles();
        this._myArticleService.listArticles().subscribe(
            (whatIGot: any[]) => {
                this.articles = whatIGot;
            }
        );

        this.addArticleForm = new FormGroup({
            articleUrl_formControlName: new FormControl(null, Validators.required),
            'articleTitle_formControlName': new FormControl(null, [Validators.required, Validators.minLength(4)]),
            articlePhotos_formControlName: new FormControl(null, Validators.required)
        });

    }
    runDisplayTitle(event) {
        this.titleToDisplay = event;
    }

    getAllArticlesOnClick(): void {
        this._myArticleService.listArticles()
            .subscribe((whatIGot: any[]) => {
                    this.articlesHowMany = whatIGot;
                }
            );
    }

    clearAllArticlesOnClick(): void {
        this.articlesHowMany = []; // re-init
    }


    getThisManyArticles(numberArticlesPassedIn) {
        /* VALIDATION (however humble)
         - EMPTY INPUT BOX:
         It is an EMPTY STRING "" - when you click submit on empty input.
         - USER TYPES IN 0 or -1
         */

        if (numberArticlesPassedIn.value === "" || numberArticlesPassedIn.value < 1) {
            console.log('Invalid number of articles requested.') // TODO Flash msg or similar
        } else {
            this._myArticleService.listFirstNArticles(numberArticlesPassedIn.value)
                .subscribe(
                    (whatIGot: any[]) => {
                        this.articlesHowMany = whatIGot;
                    }
                );
        }
    }

    preventDefaultOnMouseDownButtonHighlightRemains(event) {
        /* In Chrome at least, the highlight around the clicked
         button remains after the click action is done.
         Seems distracting. Better to remove.
         This "preventDefault()" takes care of that.
         */
        event.preventDefault();

        /* UPDATE
        Sheesh bud, just do it IN-LINE over in the template. Sheesh.

        E.g.,
         <button (click)="clearAllArticlesOnClick()" style="font-style: italic;"
         (mousedown)="$event.preventDefault()">(Clear Articles)</button>

         */
    }


    public onPhotosFileChangePostFiles(eventPassedIn) {
        /*
         https://stackblitz.com/edit/angular-file-upload?file=app%2Fapp.component.ts
         upload() { this.basicUpload() }
         */
        var myFiles = eventPassedIn.target.files;
        console.log('onPhotosFileChangePostFiles myFiles ', myFiles)
        /* Yes:
         FileList {0: File(115777), length: 1}
         0
         :
         File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
         length
         :
         1
         */
        // Very nice. 1 file to http://file.io  Works. Image stays there 14 days.
        // Well, more precisely, in 14 days it will be deleted.
        // But, you should know, if you click/view it at any point in those 14 days, it is DELETED right then and there.
        // "Single View" thing. "Snapchat for files" they call it. Bit odd in my view. O well.

/*  WORKED FINE. Don't need it any longer ... ...
        this.basicUpload(myFiles)
*/

        // YES $$$$$$$$$$$$$$$$$$$$$$
        // Now for MY image posting ... ... ?   Just images. First, one. Then, multiple?
        // Through MY Service (god willing) Yep!
        this.myServiceFilesUpload(myFiles)
        /*
        When above line of code has finished:
        - the file(s)(?) have been written by Multer to /public/img
        - the web app page simply awaits the user's next click
        - user's next click should be Submit the Form
        - Submitting the Form writes the fielded metadata to the database
        - We need to ensure we get image file filenames to also put in that database record (so we can img src them for the U/I of course)
        -- Just to note it: If user clicks away without Submit, yeah, no database entry gets made, and those uploaded files are going to sit there in /public/img unused o well
        -- Exercise for the reader: use Node(Express?) file system stuff to delete those abandoned image files ...
         */
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$

        // NOT GOING TO DO. NOT GOING TO WORK.:
        // Then, if possible, both my IMAGE posting + my FORM FIELDS posting, together
        // this.SOMEMETHOD(myFormFieldsAndFiles)
        /*
        FINDING. No. This is NOT going to work.
        See also REST API Server api-articles.js Router
        POST /articleimages
        In sum:
         # 1 :  Off the "Choose Files" click:  BODY = NO, FILES = YES
         # 2 : Off "Submit whole Form" click: BODY = YES, FILES = NO
         */


        // Next: get those photo file names!
        /*
         FOR LOOP TIME:
         https://www.javascripture.com/FileList
         */

        for (var i = 0; i < myFiles.length; i++) {
            console.log(myFiles[i].name);
            this.photosFilenamesArray.push(myFiles[i].name);
        }
        console.log('We are DONE - this.photosFilenamesArray ', this.photosFilenamesArray)
        /* Hmm. These are not the "renamed" photo file names. Hmm. Not what I need.
         this.photosFilenamesArray  (2) 
         ["010006-MexAmerican.jpg", "AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.png", "WREILLY-HelpDesk-OutlookClient-ForceQuit-Unstable-2014-03-20.jpg"]
         */

        /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        Oy. We need the RE-NAMED file names. Back from after Multer.

         */

    } // /onPhotosFileChangePostFiles()


    private myServiceFilesUpload(myFilesHere: File[]) {
        var myFormDataFilesForService = new FormData();

        for (var i = 0; i < myFilesHere.length; i++) {
            console.log(myFilesHere[i].name);
// This MUST BE CALLED 'file':
            myFormDataFilesForService.append('file', myFilesHere[i]);
        }

        /*
        1. Let's use HTTP Service to just whamma onto our REST API URL directly from here.
        2. Let's next use our Article Data Service, to let IT do the HTTP whamma biz.

        For # 1:
         this._myHttpService.post('http://0.0.0.0:8089/api/v1/articles/', myFormDataFilesForService)

         ------WebKitFormBoundary6CEHBFpBZAg8g080
         Content-Disposition: form-data; name="file"; filename="AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"
         Content-Type: image/jpeg


         ------WebKitFormBoundary6CEHBFpBZAg8g080--

         For # 2:
         this._myArticleService.uploadArticleImages(myFormDataFilesForService)
         ------WebKitFormBoundarygyHHLUu614ikUvU3
         Content-Disposition: form-data; name="file"; filename="010006-MexAmerican.jpg"
         Content-Type: image/jpeg


         ------WebKitFormBoundarygyHHLUu614ikUvU3--
         */
// apiUrlstub:  http://0.0.0.0:8089/api/v1/articles/
/*
        this._myArticleService.createArticle(myFormDataFilesForService)
*/
        this._myArticleService.uploadArticleImages(myFormDataFilesForService)
            .subscribe(
                (eventBack: any) => {
                    console.log('whew99 My Service uploadArticleImages eventBack is ', eventBack);

                    /* whew99
                     {crazymessage: "RES.SEND in JSON, Congratulations, your file was u… it was. c/o apiUploadedArticleImagesNowDoNothing", yourpath: "public/img/sometimes__1525980207472_AndToThinkWeAl…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"}
                     */
                    /*
                     whew file.io eventBack is  {success: true, key: "06l3Ql", link: "https://file.io/06l3Ql", expiry: "14 days"}
                     */
                    /* E.g.,
                     ------WebKitFormBoundary0DghgeLU8KM4eNoO
                     Content-Disposition: form-data; name="file"; filename="010006-MexAmerican.jpg"
                     Content-Type: image/jpeg


                     ------WebKitFormBoundary0DghgeLU8KM4eNoO--
                     */


                    // Next: get those photo file names!
                    /*
                     FOR LOOP TIME:
                     https://www.javascripture.com/FileList
                     */

                    for (var i = 0; i < eventBack.allreqfiles.length; i++) {
                        console.log(eventBack.allreqfiles[i].filename);
                        this.photosRenamedFilenamesArray.push(eventBack.allreqfiles[i].filename);
                    }
                    console.log('We are DONE - this.photosRenamedFilenamesArray ', this.photosRenamedFilenamesArray);


                    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                     Oy. We need the RE-NAMED file names. Back from after Multer.

                     */

                },



                (error) => { console.log('ERROR in myService uploadArticleImages() :( ', error)}
                )

    } // /myServiceFilesUpload()


    private basicUpload(myFilesHere: File[]) {
        var myFormData = new FormData();


        // THIS DO *NOT* WORK. JESUS.
/*
        Array.from(myFilesHere).forEach(fileThing => myFormData.append('file', fileThing));
*/

        for (var i = 0; i < myFilesHere.length; i++) {
            console.log('basicUpload myFilesHere[i].name ', myFilesHere[i].name);
/* Hmm, that "mywrfile" appears to be NO GOOD...
            myFormData.append('mywrfile', myFilesHere[i]);
*/
// This MUST BE CALLED 'file' (not 'mywrfile'). okay.
            myFormData.append('file', myFilesHere[i]);
        }
        console.log('basicUpload() We are DONE - myFilesHere is/was/still is: ', myFilesHere)
       // console.log('We are DONE -02- myFormData is ', myFormData) // You can't see FormData via console.log().

        /*
        JESUS H. MOTHERFUCKING CHRISTOBOL.

        The FormData god-damned object is NOT able to be viewed in Dev Console !!! !!!
        It will always show {} EMPTY.
        Fut the wuck.

         https://stackoverflow.com/questions/7752188/formdata-appendkey-value-is-not-working
         */
        /* Huh. Look at NETWORK TAB more than CONSOLE:

         ------WebKitFormBoundaryx1A4qYIGBZHTCJDb
         Content-Disposition: form-data; name="articleUrl_formControlName"

         http://nytimes.com
         ------WebKitFormBoundaryx1A4qYIGBZHTCJDb
         Content-Disposition: form-data; name="articleTitle_formControlName"

         Network Tab
         ------WebKitFormBoundaryx1A4qYIGBZHTCJDb
         Content-Disposition: form-data; name="articlePhotos_formControlName"

         C:\fakepath\010006-MexAmerican.jpg
         ------WebKitFormBoundaryx1A4qYIGBZHTCJDb--

         */
/*
We did this just for debugging to see the FormData in the browser network tab.
        var myxhr = new XMLHttpRequest;
        myxhr.open('POST', '/', true);
*/
        /* (When I tried sending twice in a row
        "ERROR DOMException: Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED."
         */
/*
        myxhr.send(myFormData);
*/
        //      myxhr.send(myFormData[0]); // << No! It is certainly NOT an Array. Solly!

        /*  No no no. Not an Array, not handled like this...
        var myxhr2 = new XMLHttpRequest;
        myxhr2.open('POST', '/', true);
        myxhr2.send(myFormData[1]);
        */
         /*
         ------WebKitFormBoundary0DghgeLU8KM4eNoO
         Content-Disposition: form-data; name="file"; filename="010006-MexAmerican.jpg"
         Content-Type: image/jpeg


         ------WebKitFormBoundary0DghgeLU8KM4eNoO--
         */
        /*
         ------WebKitFormBoundaryTmLgSbMmlArSB8K7
         Content-Disposition: form-data; name="mywrfile"; filename="AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"
         Content-Type: image/jpeg


         ------WebKitFormBoundaryTmLgSbMmlArSB8K7--
         */

// https://stackoverflow.com/questions/7752188/formdata-appendkey-value-is-not-working
      //  console.log('999999 basicUpload myFormData.entries() ', myFormData.entries()) // Iterator
        /* "ERROR in src/app/article-list/article-list.component.ts(249,76): error TS2339: Property 'entries' does not exist on type 'FormData'."
        */
        // console.log('999999 basicUpload myFormData.entries() ', Array.from(myFormData.entries())) //
/*
* [Array(2)]
 0
 :
 Array(2)
 0
 :
 "file"
 1
 :
 File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
 length
 :
 2
* */

// Note: FILE.IO not set up to handle multiple files. Jus' sayin'.
        this._myHttpService.post('https://file.io', myFormData)
            .subscribe(
                (eventBack) => { console.log('whew file.io eventBack is ', eventBack)}
                /*
                You Bet! :o)
                 whew file.io eventBack is  {success: true, key: "06l3Ql", link: "https://file.io/06l3Ql", expiry: "14 days"}
                 */
                /* E.g.,
                 ------WebKitFormBoundary0DghgeLU8KM4eNoO
                 Content-Disposition: form-data; name="file"; filename="010006-MexAmerican.jpg"
                 Content-Type: image/jpeg


                 ------WebKitFormBoundary0DghgeLU8KM4eNoO--
                 */
            )

    } // /basicUpload()


    public onPhotosFileChange(eventPassedIn) {
        // Note: This occurs before, and separate from, the Form Submit. Curiouser and curiouser.
        console.log('Event Time! eventPassedIn.target.files ', eventPassedIn.target.files) // FileList
        console.log('Event Time! eventPassedIn.target.files[0] ', eventPassedIn.target.files[0]) // File

        // https://nehalist.io/uploading-files-in-angular2/
        console.log('-01- this.addArticleForm.value ', this.addArticleForm.value)
        /* Yes.
        P.S. This "C:\fakepath" stuff is O.K., and expected.

         {articleUrl_formControlName: "http://nytimes.com", articleTitle_formControlName: "Good morning 01", articlePhotos_formControlName: "C:\fakepath\010006-MexAmerican.jpg"}
         */

        let myOneFile = eventPassedIn.target.files[0];
        console.log('myOneFile is ', myOneFile)
        /*
         File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
         */

        console.log('addArticleForm ', this.addArticleForm)
        /*
        FormGroup { controls: { articleUrl_formControlName ...
         */
        console.log('addArticleForm.value ', this.addArticleForm.value)
        /*
         {articleUrl_formControlName: "http://nytimes.com", articleTitle_formControlName: "we", articlePhotos_formControlName: "C:\fakepath\AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.png"}
         */

        // ***********************************
/* No! It's not the "ID". It's the FORMCONTROLNAME. (mais bien sûr)
        this.addArticleForm.get('articlePhotos_id').setValue(myOneFile);
*/
        // Cannot read property 'setValue' of null


/*  Both equal:  Both are not allowed.
        this.addArticleForm.get('articlePhotos_formControlName').setValue(myOneFile);
        this.addArticleForm.controls['articlePhotos_formControlName'].setValue(myOneFile);
*/
        /* O la.
        "ERROR DOMException: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string."
         */
        // ***********************************


        console.log('what the hey myOneFile ', myOneFile)
        /* (Redundant. same as above o well)
         File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
         */
        console.log('-02- this.addArticleForm.value ', this.addArticleForm.value)


        /*
         Event Time! eventPassedIn.target.files

         File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
         1
         :
         File(362417) {name: "AndToThinkWeAllPlayedASmallPart ...
         */

// *********** O LA. Giving up on trying to use this FileList in any ARRAY or ARRAY.FROM() LIKE way.
        // Going to just use the old-fashioned FOR LOOP
        // https://www.javascripture.com/FileList

/* "FileList":
        this.photosFilenamesArray = eventPassedIn.target.files.map((eachFileThing) => eachFileThing.name)
*/
        /* Hmm. "files" not an Array. No ".map()"
         https://developer.mozilla.org/en-US/docs/Web/API/FileList
         */

        // NOT USING "ARRAY.FROM() anymore. Cheers.
        var photosFilenamesArrayTEMP = Array.from(eventPassedIn.target.files)
        console.log(photosFilenamesArrayTEMP) // [File, File]
        console.log(photosFilenamesArrayTEMP[0]) // File
        /* "File" thing whatever that is:
         File(115777) {name: "010006-MexAmerican.jpg", lastModified: 1459182030000, lastModifiedDate: Mon Mar 28 2016 12:20:30 GMT-0400 (EDT), webkitRelativePath: "", size: 115777, …}
         lastModified
         :
         1459182030000
         lastModifiedDate
         :
         Mon Mar 28 2016 12:20:30 GMT-0400 (EDT) {}
         name
         :
         "010006-MexAmerican.jpg"
         */
//        console.log(photosFilenamesArrayTEMP[0].name) // 010006-MexAmerican.jpg
//        console.log(photosFilenamesArrayTEMP[1].name) // WREILLY-Mac-WINSCurrentlyBeingUsed-2014-02-03.jpg
 // No gave error: (sad)
        //       this.photosFilenamesArray = photosFilenamesArrayTEMP.map((eachFileThing) => eachFileThing.name)
        /* Hmm. Grr.
         ERROR in src/app/article-list/article-list.component.ts(142,99): error TS2339: Property 'name' does not exist on type '{}'.

         webpack: Failed to compile.
         */
        /* Be aware, previous three lines generate: But I still get the array I need ... Cheers.
        "ERROR in src/app/article-list/article-list.component.ts(140,49): error TS2339: Property 'name' does not exist on type '{}'.
         src/app/article-list/article-list.component.ts(141,49): error TS2339: Property 'name' does not exist on type '{}'.
         src/app/article-list/article-list.component.ts(142,99): error TS2339: Property 'name' does not exist on type '{}'."
         */

/*
        FOR LOOP TIME:
            https://www.javascripture.com/FileList
*/

        for (var i = 0; i < eventPassedIn.target.files.length; i++) {
            console.log(eventPassedIn.target.files[i].name);
            this.photosFilenamesArray.push(eventPassedIn.target.files[i].name);
        }
        console.log('We are DONE - this.photosFilenamesArray ', this.photosFilenamesArray)
        /* YES.
         this.photosFilenamesArray  (2) ["010006-MexAmerican.jpg", "WREILLY-Mac-WINSCurrentlyBeingUsed-2014-02-03.jpg"]
         */

    }

    private prepareToAddArticle(): any {
        // https://nehalist.io/uploading-files-in-angular2/
        let myFormFieldsData = new FormData();
      //  console.log('-01- wtfrickety myFormFieldsData ', myFormFieldsData) // FormData {} // You cannot see FormData via console.log()

        // console.log('-01A- this.addArticleForm.get('articleUrl_formControlName').value', this.addArticleForm.get('articleUrl_formControlName').value)
        // "ReferenceError: articleUrl_formControlName is not defined"

        console.log('-01B- this.addArticleForm ', this.addArticleForm); // FormGroup
        /*
         FormGroup {validator: null, asyncValidator: null, _onCollectionChange: ƒ, pristine: false, touched: true, …}
         asyncValidator
         :
         null
         controls
         :
         {articleUrl_formControlName: FormControl, articleTitle_formControlName: FormControl, articlePhotos_formControlName: FormControl}
         dirty
         :
         (...)
         */
        console.log('-01B-A- this.addArticleForm.controls ', this.addArticleForm.controls);
        /*
         this.addArticleForm.controls  {articleUrl_formControlName: FormControl, articleTitle_formControlName: FormControl, articlePhotos_formControlName: FormControl}
         */
        console.log('-01B-B- this.addArticleForm.controls.articleTitle_formControlName.value ', this.addArticleForm.controls.articleTitle_formControlName.value); // Yes what's in input box
        console.log('-01B-C- this.addArticleForm.controls.articlePhotos_formControlName.value ', this.addArticleForm.controls.articlePhotos_formControlName.value); // C:\fakepath\010006-MexAmerican.jpg
        /* << this is all you see via console.log(), but this (presumably) is a full File object, not just this string for path. btw don't worry about "fakepath". All is well. Real path is there under the hood. Cheers.
        */


        // ***********************************
        // REACTIVE-MODEL-DRIVEN:
        // Huh? Not [] obj[key[] ?? // myFormFieldsData.append('articleUrl_formControlName', this.addArticleForm.controls['articleUrl_formControlName'].value)
        // It is time to MAP onto new keys:
        // WAS: articleUrl_formControlName
        // NOW SHOULD BE: articleUrl_name

        // (1) .controls.field << YEP, WORKS.
        myFormFieldsData.append('articleUrl_name', this.addArticleForm.controls.articleUrl_formControlName.value)

        // (2) .controls['field'] << YEP, WORKS.
        myFormFieldsData.append('articleTitle_name', this.addArticleForm.controls['articleTitle_formControlName'].value)


        // Q. (below) For .append(), do I want 'file'? Or 'articlePhotos_name'? Hmm.
        // For "file.io" API, seems it had to have "file". Maybe with my own server API, I can change it up...
        // At moment, doing both. Should/will drop one.

        // (3) .get('field') << YEP, WORKS.
/*  Was working fine. These are ORIGINAL Photo File Names.
I should maybe rename the field to 'articlePhotosOriginal_name' or similar.
        T.B.D.
        myFormFieldsData.append('articlePhotos_name', this.addArticleForm.get('articlePhotos_formControlName').value)
        myFormFieldsData.append('file', this.addArticleForm.get('articlePhotos_formControlName').value)
*/

        // (4) *NEW* Time to add an array of the RENAMED (by Multer) Photo File Names
        // photosRenamedFilenamesArray
        // Whamma-jamma this array right onto it ... ?
        // https://stackoverflow.com/questions/16104078/appending-array-to-formdata-and-send-via-ajax
  // YES!       myFormFieldsData.append('articlePhotos_name[]', this.photosRenamedFilenamesArray)
        /*
         error TS2345: Argument of type 'any[]' is not assignable to parameter of type 'string | Blob'.

         Hmm. But, it worked! Sort of anyway. Hmm.
         In MongoDB:
         The multiple photos is:
          An Array, of one String, separated by comma. Kinda weird.
          [ 'allonestring.jpg, secondpic.jpg' ]
         { "_id" : ObjectId("5af4b25eb0f4ef4a2394b7fa"), "articlePhotos" : [ "sometimes__1525985838159_010006-MexAmerican.jpg,sometimes__1525985838164_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg" ], "articleUrl" : "http://nytimes.com", "articleTitle" : "two two", "__v" : 0 }


An Example With 3:

         {articlePhotos: Array(1), _id: "5af4b43db0f4ef4a2394b7fb", articleUrl: "http://nytimes.com", articleTitle: "three", __v: 0}
         articlePhotos
         :
         Array(1)
         0
         :
         "sometimes__1525986355016_010006-MexAmerican.jpg,sometimes__1525986355019_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.png,sometimes__1525986355025_WREILLY-Mac-WINSCurrentlyBeingUsed-2014-02-03.jpg"
         length
         :
         1
         __proto__
         :
         Array(0)
         articleTitle
         :
         "three"
         articleUrl
         :
         "http://nytimes.com"
         __v
         :
         0
         _id
         :
         "5af4b43db0f4ef4a2394b7fb"


         */

        // https://stackoverflow.com/questions/16104078/appending-array-to-formdata-and-send-via-ajax
        // This SO page recommends using JSON.stringify() (then JSON.parse()). Hmm
        myFormFieldsData.append('articlePhotos_name', JSON.stringify(this.photosRenamedFilenamesArray))
        /*
         { "_id" : ObjectId("5af4b53ab0f4ef4a2394b7fc"), "articlePhotos" : [ "[\"sometimes__1525986614512_010006-MexAmerican.jpg\",\"sometimes__1525986614515_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg\"]" ], "articleUrl" : "http://nytimes.com", "articleTitle" : "2 w JSON biz", "__v" : 0 }
         */



        // --------
        /*
         ------WebKitFormBoundaryAxdbkLntT9ST7JB0
         Content-Disposition: form-data; name="articleUrl_name"

         http://nytimes.com
         ------WebKitFormBoundaryAxdbkLntT9ST7JB0
         Content-Disposition: form-data; name="articleTitle_name"

         gtr
         ------WebKitFormBoundaryAxdbkLntT9ST7JB0
         Content-Disposition: form-data; name="articlePhotos_name"

         C:\fakepath\010006-MexAmerican.jpg
         ------WebKitFormBoundaryAxdbkLntT9ST7JB0
         Content-Disposition: form-data; name="file"

         C:\fakepath\010006-MexAmerican.jpg
         ------WebKitFormBoundaryAxdbkLntT9ST7JB0--
         */
        // ***********************************
        // Something NEW. (oy) https://stackblitz.com/edit/angular-file-upload?file=app%2Fapp.component.ts

      // Don't work, trying to console.log() the FormData. Sorry.
        // No >> console.log('-02?- wtfrickety myFormFieldsData ', myFormFieldsData) // still just: FormData {}


        /*
         We did this just for debugging to see the FormData in the browser network tab.
         */
         var myxhr = new XMLHttpRequest;
         myxhr.open('POST', '/', true);
         myxhr.send(myFormFieldsData);
         /*
         LATEST:  Multiple Photos:
          Below in the "FormData", it is NOT an Array - it is two comma-separated Strings.
          But in the MongoDB it IS an Array, of two Strings
         Okay.

          ------WebKitFormBoundary3g7RUjARsLRYwcxA
          Content-Disposition: form-data; name="articleUrl_name"

          http://nytimes.com
          ------WebKitFormBoundary3g7RUjARsLRYwcxA
          Content-Disposition: form-data; name="articleTitle_name"

          two two
          ------WebKitFormBoundary3g7RUjARsLRYwcxA
          Content-Disposition: form-data; name="articlePhotos_name[]"

          sometimes__1525985838159_010006-MexAmerican.jpg,sometimes__1525985838164_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg
          ------WebKitFormBoundary3g7RUjARsLRYwcxA--

          In MongoDB:
          { "_id" : ObjectId("5af4b25eb0f4ef4a2394b7fa"), "articlePhotos" : [ "sometimes__1525985838159_010006-MexAmerican.jpg,sometimes__1525985838164_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg" ], "articleUrl" : "http://nytimes.com", "articleTitle" : "two two", "__v" : 0 }
          */


         /*
          ------WebKitFormBoundarySkpszp1E9NbAhSon
          Content-Disposition: form-data; name="articleUrl_name"

          http://nytimes.com
          ------WebKitFormBoundarySkpszp1E9NbAhSon
          Content-Disposition: form-data; name="articleTitle_name"

          hy
          ------WebKitFormBoundarySkpszp1E9NbAhSon
          Content-Disposition: form-data; name="articlePhotos_name"

          C:\fakepath\010006-MexAmerican.jpg
          ------WebKitFormBoundarySkpszp1E9NbAhSon
          Content-Disposition: form-data; name="file"

          C:\fakepath\010006-MexAmerican.jpg
          ------WebKitFormBoundarySkpszp1E9NbAhSon--
          */

        console.log('7777777777 After that SEND above, does program return to this next line? Yes it do'); //  yes

        return myFormFieldsData;

    } // /prepareToAddArticle()


    public addArticle(addArticleFormTemplate_refPassedIn) {
        console.log('addArticle - now OverLoading: both REACTIVE and TEMPLATE')
        // N.B. Only the TEMPLATE mode needs to pass in a parameter.

        // https://nehalist.io/uploading-files-in-angular2/

        console.log('addArticleFormTemplate_refPassedIn: (TEMPLATE only) ', addArticleFormTemplate_refPassedIn);
        /* Yes:
         {articleUrl_name: "http://nytimes.com", articleTitle_name: "TEMPLATE We Wrote This Yesterday. (So long as Today is Tomorrow.)"}
         */

        console.log('we are in addArticle - this.addArticleForm.value (REACT only) ', this.addArticleForm.value);
        /* Yeah. V. nice.
         {articleUrl_formControlName: "http://nytimes.com", articleTitle_formControlName: "REACTIVE We Wrote This Yesterday. (So long as Today is Tomorrow.)"}
         */



        let articleToCreate = {
            articleUrl_name: '',
            articleTitle_name: '',
            articlePhotos_name: null // We were using this for filenames; time to use it for FILES.
        };

        // https://nehalist.io/uploading-files-in-angular2/
        // ***********************************
        const myFormFieldsAndFiles = this.prepareToAddArticle();
        // ***********************************
        this.loadingPhotos = true;

        console.log('addArticle() Let\'s have a look via Network tab at myFormFieldsAndFiles FormData ');
        /*
         We did this just for debugging to see the FormData in the browser network tab.
         */
        var myxhr3 = new XMLHttpRequest;
        myxhr3.open('POST', '/myFormFieldsAndFiles', true);
        myxhr3.send(myFormFieldsAndFiles);
        /* YES. JUST RIGHT.
         ------WebKitFormBoundaryoPpanl3RULBL6o14
         Content-Disposition: form-data; name="articleUrl_name"

         http://nytimes.com
         ------WebKitFormBoundaryoPpanl3RULBL6o14
         Content-Disposition: form-data; name="articleTitle_name"

         fgh
         ------WebKitFormBoundaryoPpanl3RULBL6o14
         Content-Disposition: form-data; name="articlePhotos_name"

         C:\fakepath\010006-MexAmerican.jpg
         ------WebKitFormBoundaryoPpanl3RULBL6o14
         Content-Disposition: form-data; name="file"

         C:\fakepath\010006-MexAmerican.jpg
         ------WebKitFormBoundaryoPpanl3RULBL6o14--
         */


        /*
         if (addArticleFormTemplate_refPassedIn) {
            // TEMPLATE-DRIVEN
            articleToCreate = {
                articleUrl_name: addArticleFormTemplate_refPassedIn.articleUrl_name,
                articleTitle_name: addArticleFormTemplate_refPassedIn.articleTitle_name,
                articlePhotos_name: this.photosFilenamesArray
            };
            console.log('TEMPLATE articleToCreate is ', articleToCreate) // Yes we have the pics
        } else {
            // REACTIVE-MODEL-DRIVEN
            articleToCreate = {
                articleUrl_name: this.addArticleForm.value.articleUrl_formControlName,
                articleTitle_name: this.addArticleForm.value.articleTitle_formControlName,
                articlePhotos_name: this.photosFilenamesArray
            };

            // https://nehalist.io/uploading-files-in-angular2/
            // WE ARE DOING REACTIVE ONLY (thus far)
        }



        /* 2018-04-22 "C" in CRUD time:

         From here in the Component's TypeScript,
         we invoke the Article Service,
         to use its Angular HTTP
         to hit the REST API endpoint:

(akin to how we used Axios in the Express App for the CLIENT-SIDE JAVASCRIPT to talk to the REST API),

           POST to http://0.0.0.0:8089/articles
         */
        console.log('-01- BOUT TO GO TO SOIVICE articleToCreate is ', articleToCreate) // Yes we have the pics FILENAMES. Hmmph.
  //      console.log('-02- BOUT TO GO TO SOIVICE  myFormFieldsAndFiles ', myFormFieldsAndFiles) // // You cannot see FormData via console.log()




        /*
                this._myArticleService.createArticle(articleToCreate) // << "Worked" to send photo filenames, not files.
        */
        // https://nehalist.io/uploading-files-in-angular2/
        // WE ARE DOING REACTIVE ONLY (thus far)
        this._myArticleService.createArticle(myFormFieldsAndFiles)
            .subscribe(
                (whatIJustCreated: any) => {
                    // Observable success
                    console.log('whatIJustCreated ', whatIJustCreated);
                    // Type {}
                    this.articleIJustCreatedDisplay = whatIJustCreated;
                    this.articleIJustCreatedBoolean = true;

                    /*
                    O la. JSON.stringify of Array going into MongoDB
                    Time to JSON.parse what we get out. I think
                     */
                    console.log(' $$$$$$$$$$$$$$$$$$$$   whatIJustCreated.articlePhotos ', whatIJustCreated.articlePhotos)
                    console.log('whatIJustCreated.articlePhotos JSON.parse() ', JSON.parse(whatIJustCreated.articlePhotos))
                    /*
                    Damn. Looks like that worked. Hot damn.  20180510-1716

                    Of course, if you really do go this JSON/STRINGIFY/PARSE route, well,
                    you are stuck with a database that for EVERY TIME you obtain
                    this info, you MUST do JSON PARSE to use it.
                    That is, your database entry is really holding a STRING. ugh.
                    Kinda ugly.
                    O well.
                    Good enough for tonight's assignment! !! !!!


                     whatIJustCreated.articlePhotos JSON.parse()
                     (2) ["sometimes__1525986950360_010006-MexAmerican.jpg", "sometimes__1525986950363_AndToThinkWeAllPlayedASma…t-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"]
                     0
                     :
                     "sometimes__1525986950360_010006-MexAmerican.jpg"
                     1
                     :
                     "sometimes__1525986950363_AndToThinkWeAllPlayedASmallPart-NewYorkerCartoon-SlackScreenshot-2017-11-14.jpg"
                     */

                    this.articleIJustCreatedDisplay.articlePhotos = JSON.parse(whatIJustCreated.articlePhotos) // whamma-jamma this reconstituted Array of strings onto that {} type. should go okay I expect.

                    /* Working. Finally. Whoa. 20180510-1647. Due at 20180510-2359.

                     whatIJustCreated
                     {articlePhotos: Array(1), _id: "5af4adf4b0f4ef4a2394b7f8", articleUrl: "http://nytimes.com", articleTitle: "hy", __v: 0}
                     articlePhotos
                     :
                     Array(1)
                     0
                     :
                     "sometimes__1525984753235_010006-MexAmerican.jpg"
                     length
                     :
                     1
                     __proto__
                     :
                     Array(0)
                     articleTitle
                     :
                     "hy"
                     articleUrl
                     :
                     "http://nytimes.com"
                     __v
                     :
                     0
                     _id
                     :
                     "5af4adf4b0f4ef4a2394b7f8"
                     */



                    // New: Let's update the Articles array right here, right now.
                    // Also: The user-selected "How Many Articles" array.
                    // On create here, I do *not* refresh the page,
                    //  because I wanted to immediately display the just-created article.
                    //  Till now I had not thought to do this array-pushing.
                    //  Instead, the user had to refresh or perhaps navigate back
                    //  to this page, to see full list with newly added item.
                    //  This is better.
                    this.articles.push(this.articleIJustCreatedDisplay)
                    if (this.articlesHowMany.length) {
                        // If the user has NOT clicked on "First n" Articles,
                        //  we'll skip adding the just-created Article to that
                        //  (non-existent) list on the page.
                        //
                        // That is, only if the user *HAS* already asked for some number
                        // of Articles to appear will we add the
                        // just-created Article to that displayed list:
                        this.articlesHowMany.push(this.articleIJustCreatedDisplay)
                        /*
                         One tiny side-effect (totally benign, acceptable, and prob. desired):
                         re: "articlesHowMany":
                         - If user says "Display first 2 articles", and then adds one article...
                         - The "First n" articles list of 2 will be joined by the new one, in the
                         next spot (3rd spot)
                         (whereas it of course belongs ultimately in last spot)
                         - That of course goes away next time they click on asking for any other
                         number of articles to be displayed.
                         (The newly added one will correctly be in the last spot.)
                         */
                    } else {
                        // do nothing. User had *not* clicked on "Display First n".
                        // We do not add the just-created Article to a sort of "non-list"
                    }

                    // https://stackoverflow.com/questions/36655922/resetting-a-form-in-angular-2-after-submit
                    // Hmm. Seems to say resetForm() should be available o well.
                    this.addArticleForm.reset();
                }
            );
    } // /addArticle()

}