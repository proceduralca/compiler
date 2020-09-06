### compiler

A simple lightweight embeddable vanilla JS compiler for packaging static pages.

This compiler uses the global variable COMPILER.

### installation

The compiler currently needs to be embedded in the `body` of the document.
In order to capture the original html state for packaging it is recommended to embed the compiler js file before any other document modifiying scripts.
A Head and Body element mutation observer monitors added and changed elements as a fallback.

```
<body>

  <script src="compiler.min.js" class="COMPILER_IGNORE"></script>

  <!-- SCRIPTS TO BE COMPILED -->
  
  <script src="lib.js"></script>
  <script src="app.js"></script>

</body>
```

### compiling

Compiling functions can be run through a browser developer command line, an inline html script, or an embedded script.

```
COMPILER.name = 'Project'; // Set the package name.
COMPILER.version = 0.1; // Set the package version name.

COMPILER.compile.package(); // Exports a ZIP file with all files merged.
```

A list of all compile functions are listed further in the documentation.

### parameters

*strings*

`COMPILER.name:`      Project name.

`COMPILER.version:`   Project version.

`COMPILER.js.name:`   Javascript export file name.

`COMPILER.js.path:`   Javascript package export path.


`COMPILER.css.name:`  CSS export file name.

`COMPILER.css.path:`  CSS package export path.

`COMPILER.img.path:`  Image package export path.

*booleans*

`COMPILER.scope:`     If `true` all compiled code is wrapped in an anonymous function preventing variables to be accessible globally. 

### functions

`COMPILER.compile.package()`

Generates a zip file with consolidated css, javascript, manifest & images.

`COMPILER.compile.index()`

Generates an index.html file with minified script, link, and img paths.

`COMPILER.compile.js()`

Consolidates and exports all non-inline `<script>` elements.

`COMPILER.compile.css()`

Consolidates and exports all non-inline `<link rel="stylesheet">` elements.

`COMPILER.combine()`

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
