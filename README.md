# inversify-express-doc

[![Build Status](https://travis-ci.org/GuidionDev/inversify-express-doc.svg?branch=master)](https://travis-ci.org/GuidionDev/inversify-express-doc)

### Smart API documentation for an inversify express based API

## Why would i use this? 

If you are reading this, I probably don't need to tell you how awesome inversify or express are, since you are most likely already using inversify-express if you landed on this page. If not, you should [check it out](https://github.com/inversify/https://github.com/inversify/inversify-express-utils).

Since inversify express allows you to declare your routes directly on your classes/functions with decorators, i thought it would be cool to just use these decorators to also generate documentation about these routes. In this way you **dont need to make any changes** to your code, and it will automatically generate api documentation(and expose it on a /doc endpoint if you want).

## It just works™

If you are already using inversify-express-utils, all you need to do is pass the inversify container to inversify-express-doc. Now all your documentation is availlable!

### example: 

```js
import { Container } from 'inversify';
import { load } from 'inversify-express-doc';

const container = new Container();
// load inversify bindings.. 
// start express server before loading inversify-express-doc
load(container);

```

## Showing your documentation

There are two ways to use the documentation generated. The easiest is to simply import 'inversify-express-doc' in your inversify config file, like so:
(it will then automatically bind the DocController to the kernel)

```js
import 'inversify-express-doc';
```

You can go to /doc to view the automatically generated api documentation, you might want to redirect there from your base path. The standard documentation output looks like this:

![img](http://oi64.tinypic.com/2gufqcw.jpg)


Alternatively, get the raw json documentation and do with it what you want:

```js
import { getDocumentationData } from 'inversify-express-doc';
const apiDocumentation = getDocumentationData();
// Do stuff!
```

## Advanced

inversify-express-doc also exposes a @Doc decorator for your endpoints, which you can use to add details about it for your users.

Since there might be some additional information you want to gather about your endpoints, like what kind of authorization they require, you can wrap your middleware in an object that exposes some extra info. These objects require a name and a value field, in addition to a middleware field(which is what will be passed to inversify-express-utils like usual).

This name/value info will then be shown in the documentation.

## Backwards compatibility

Instead of using the inversify metadata to generate the documentation by loading the inversify container, it is still also possible to replace the inversify-express-util decorators with the inversify-express-doc decorators. But this option will no longer be supported in future releases.
