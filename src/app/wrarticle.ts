// https://stackoverflow.com/questions/38398877/how-do-i-declare-a-model-class-in-my-angular-2-component-using-typescript
// https://javascript.info/class

// https://www.sitepen.com/blog/2014/08/22/advanced-typescript-concepts-classes-types/
// https://johnpapa.net/typescriptpost3/
// https://www.developer.com/lang/top-10-things-to-know-about-typescript.html

export class Wrarticle {

    // Q. Hmm. Trying to see if possible to omit
    // these property declarations here, just get
    // a sort of "shortcut" to declaring them, via
    // the constructor.
    // A. Nope. Seems no, absolutely not.
    // That shortcut is avail. in JavaScript, kids, but not
    // here in good old strict old I'll repeat good old TYPESCRIPT.
    // Okay.
       articleTitle_name: string;

        articleUrl_name: string; // not really using...
        articleCategory_name: string; // not really using...


        constructor(title: string, url: string, category: string) {
            this.articleTitle_name = title;
            this.articleUrl_name = url;
            this.articleCategory_name = category;

            console.log('heck we just constructed a wrarticle')
            console.log('this.articleTitle_name ', this.articleTitle_name)
            console.log('this.articleUrl_name ', this.articleUrl_name)
        }
}
