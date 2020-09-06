### compiler

Embeddable vanilla JS compiler for packaging static pages.

This compiler uses the global variable COMPILER.

### parameters

*strings*

`COMPILER.name:`      Project name.

`COMPILER.version:`   Project version.

`COMPILER.js.name:`   Javascript export path name.

`COMPILER.js.path:`   Javascript Package export path.


`COMPILER.css.name:`  Javascript export path name.

`COMPILER.css.path:`  Package export path.

`COMPILER.img.path:`  Image export path.

*booleans*

`COMPILER.scope:`     Wraps all code in an anonymous function, preventing variables to be accessible globally. 

### functions

`COMPILER.compile.package()`

Generates a zip file with consolidated css, javascript, manifest & images.

`COMPILER.compile.index()`

Generates an index.html file with minified script, link, and img paths.

`COMPILER.compile.js()`

Consolidates and exports all non-inline `<script>` elements.

`COMPILER.combine.css()`

Consolidates and exports all non-inline `<link rel="stylesheet">` elements.

Combines all `<script>` elements with the `.COMPILER_COMBINE` class.

### css flags

`.COMPILER_IGNORE`

Flags elements to be ignored when compiling js, css, or package.

`.COMPILER_COMBINE`

Flags elements that need to be combined using the `COMPILER.combine()` utility. This overrides the `.COMPILER_IGNORE` flag.

### limitations

* The code is not minified or optimized, just combined.
* Only compile non-inline and local files.
* Images must be appended to the document at some point before compiling in order to be added to the package.
*Images can be removed immediatley after. Dynamically added images are captured using Mutation Observers.*
* Images are saved as non-compressed png, even if the original is compressed.

### future

* Icon automation.
* Refactor reusable compenents.
* JS minification & optimizations via closure compiler.
* PNG compression.
* Service worker & PWA template.
