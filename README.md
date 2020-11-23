# inertia-can

The CanJS adapter for inertia.js

## Introduction:
Before using this library, is important to know [what is Inertia.js](https://inertiajs.com/#top), [what is it for](https://inertiajs.com/who-is-it-for) and [how it works](https://inertiajs.com/how-it-works), in the [official Inertia.js website](https://inertiajs.com/)

Also, from the official [CanJS](https://canjs.com/) website, is very important to know:
- [What is CanJS](https://canjs.com/doc/about.html)
- [Setting up CanJS](https://canjs.com/doc/guides/setup.html)
- CanJS [Observables](https://canjs.com/doc/api.html#Observables)
- CanJS [Custom Element Basics](https://canjs.com/doc/api.html#CustomElementBasics)
- CanJS [`can-stache-element`](https://canjs.com/doc/can-stache-element.html)
- CanJS [`can-stache`](https://canjs.com/doc/can-stache.html)
- [can-stache-bindings](https://canjs.com/doc/can-stache-element.html#Passingtemplates_customizinglayout_)
- [`can-stache-portal`](https://canjs.com/doc/can-stache.portal.html)
- [Passing custom templates to custom elements](https://canjs.com/doc/can-stache-element.html#Passingtemplates_customizinglayout_)

## Installation:

Install inertiajs and canjs adapter using npm or yarn:

```shell
$ npm install @inertiajs/inertia can inertia-can
```

```shell
$ yarn add @inertiajs/inertia can inertia-can
```

## Application initialization:

`inertia-app` is a [`StacheElement`](https://canjs.com/doc/can-stache-element.html) custom element, needs to be intialized in the main js file of the application like the following:

```js
import { inertiaapp } from "inertia-can";

const app = new inertiaapp().initialize({
  initialpage: json.parse(target.dataset.page),
  resolvecomponent: (name) =>
    import(`./pages/${name}`).then((module) => module.default),
});

let target = document.getelementbyid("app");
app.initialize({ target });
target.appendchild(app);
```

The code above will instantiated `inertia-app` custom and inserted it in the application root view html page.

A `async/await` polyfill like [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime) might be needed.

> **note**:
> it is important to not instantiate the returned module in `resolvecomponent` function, the adapter will handle the instantiation and passing the needed `StacheElement` instance properties.

## Pages:

Pages are just `StacheElement` custom tags, for example:

```js
import { StacheElement } from 'can';

export default class Dashboard extends StacheElement {
    static view = `<h1>Dashboard</h1>`

}

customElements.define('app-dashboard', Dashboard);

```

## Persistent layouts:

The example of the `<app-dashboard />` page above will have its own local layout, this is not useful when some pages has shared layout.
to make a [presistent layout](https://inertiajs.com/pages#persistent-layouts):

1- Define a layout custom element:

```js
import { StacheElement } from "can";
import { store } from 'inertia-can';

class Layout extends StacheElement {
  static view = `
        {{# portal(head)}}
            <title>
                {{# if (this.title) }}
                    {{ this.title }} - my app
                {{ else }}
                    my app
                {{/ if }}
            </title>
        {{/ portal }}

        <app-navbar />

        <app-side-menu />

        {{ this.component }}
    `;

  static props = {
    head: {
      get default() {
        return document.head;
      },
    },
  };

  get title() {
    return this.component.title;
  }

  get component() {
    return store.component;
  }
}
customElements.define("app-layout", layout);

export default new Layout();
```

The above example assume there's a `<app-navbar />` and `<app-side-menu />` already defined and imported.

Notice CanJS [`portal`](https://canjs.com/doc/can-stache.portal.html) feature is used to change the HTML document title inside the head tag.

The `store` an observable object where the application state defined, it contains the following with the default values:
```js
{   
    component: null,
    page: {},
    key: null
}
```

> __NOTE__:
> It is important to export an instance of the layout custom element, like this the layout will not be instantiated on every page change.

2- Define a page custom element, so the example of `<app-dashboard />` will be:

```js
import { StacheElement } from 'can';
import { default as layout } from '@/components/layout/layout';

export default class Dashboard extends StacheElement {

    static view = `
        <h1> {{ this.title }} </h1>
    `

    get layout() {
        return layout;
    }

    get  title() {
        return 'Tableau de bord';
    }

}

customElements.define('app-dashboard', Dashboard);

```

## Links:

Links are created using `<inertia-link>` custom element:

```js
import { StacheElement } from 'can';
import { Link } from 'inertia-can';

class MyPage extends satcheElement {
    static view = `
        <inertia-can href:raw='https://canjs.com/'>
            <can-template name="linktemplate">
                canjs website
            </can-template>
        </inertia-can>
    `
}

customElements.define('my-page', Mypage);
```

Notice the `can-template` tag is used to passe [custom templates](https://canjs.com/doc/can-stache-element.html#passingtemplates_customizinglayout_) to `StacheElement`.

The following properties are available for `inertia-link`:

`data`: type: deepobserble, required: false

`href`: type: string

`method`: type: string, default: 'get' (post, get, put, patch, delete)

`replace`: type: boolean, default: false

`preserveScroll`: type: boolean, defaut: false

`preserveState`: type: boolean, default: false

`only`: type:(deepobservable), required: false

`headers` type: deepobservable, required: false

`linkTemplate` type: function, required: true

`classname`: type: string

basically, `inertia-link` is a wrapper around [inertia link](https://inertiajs.com/links)


## License

[MIT License](LICENSE).
