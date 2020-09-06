// Store static head element;

const HEAD = document.head.cloneNode([true]);
const BODY = document.body.cloneNode([true]);

const HEAD_OBSERVER = new MutationObserver( OBSERVE );
const BODY_OBSERVER = new MutationObserver( OBSERVE );

HEAD_OBSERVER.observe(

	document.head,
	{

		attributes: true,
		childList: true,
		subtree: true

	}

);

BODY_OBSERVER.observe(

	document.body,
	{
		attributes: true,
		childList: true,
		subtree: false

	}

);

function OBSERVE( event ){

	for( let i = 0; i < event.length; i++ ){

		if( event[i].type === 'childList' ){

			for( let a = 0; a < event[i].addedNodes.length; a++ ){

				if( event[i].addedNodes[a].nodeType === 1 ){
					
					if( event[i].addedNodes[a].tagName === 'IMG' ){

						COMPILER.img.array.push( event[i].addedNodes[a] );

					}

					COMPILER.dynamic.push( event[i].addedNodes[a] )

				}

			}

		}

	}

} 

const COMPILER = {

	name: 'PROJECT',

	version: function(){

		let date = new Date();

		let yyy = date.getYear().toString(); 
		let mm  = date.getMonth().toString();
		let dd  = date.getDay().toString();
		let hh	= date.getHours().toString

		if( mm.length < 2 ) mm = '0'+ mm;
		if( dd.length < 2 ) dd = '0'+ dd;

		return yyy + '.' + mm + '.' + dd;

	},

	enter: String.fromCharCode(10),
	quote: String.fromCharCode(39),
	encapsulate: false,
	closure: false,

	manifest: {

		name: 'manifest.json',
		path: '',
		file: '',
		source: '',

	},

	index: {

		name: 'index.html',
		path: '',
		file: '',
		source: '',

	},

	css: {

		name: 'style.min.css',
		path: 'min/',
		file: '',
		source: '',

	},

	js: {

		name: 'app.min.js',
		path: 'min/',
		file: '',
		source: '',

	},

	img: {

		path: '',
		array: [],
		blob: [],

	},
	
	dynamic: [],

}

COMPILER.compile = {}

COMPILER.compile.package = function( step = 0 ){

	HEAD_OBSERVER.disconnect();
	BODY_OBSERVER.disconnect();

	switch( step ){

		case( 0 ):

			COMPILER.compile.js(

				function(){ COMPILER.compile.package( 1 ) },
				false

			);


		break;

		case( 1 ):

			COMPILER.compile.css(

				function(){ COMPILER.compile.package( 2 ) },
				false

			);


		break;

		case( 2 ):

			COMPILER.compile.index(

				function(){ COMPILER.compile.package( 3 ) },
				false

			);

		break;

		case( 3 ):

			COMPILER.compile.img(

				function(){ COMPILER.compile.package( 4 ) }

			)

		break;

		case( 4 ):

			COMPILER.compile.manifest(

				function(){ COMPILER.compile.package( 5 ) },
				false

			)

		break;

		case( 5 ):

			let name = COMPILER.name + '_' + COMPILER.version() + '.zip'

			let zip = new JSZip();
               
            let path = zip.folder( COMPILER.name );

			path.file( COMPILER.index.name, COMPILER.index.source );

			path.file( 'manifest.json', COMPILER.manifest.source );

			path.file( COMPILER.css.path + COMPILER.css.name, COMPILER.css.source );

			path.file( COMPILER.js.path + COMPILER.js.name, COMPILER.js.source );

			let img = path.folder("img");

			console.log( COMPILER.img.blob );

			for( let i = 0; i < COMPILER.img.blob.length; i++ ){

				let src = COMPILER.img.array[i].getAttribute('src');

				let n = src.length;
				
				while( src.charAt( n ) !== '/' ){

					n --;

				}

				let name = src.substring( n+1 );

				console.log( name );

				img.file( name, COMPILER.img.blob[i], { binary: true });

			}

			zip.generateAsync( {type:"blob"} ).then( function(content) {

				console.log(content);

				let pom = document.createElement('a');

				pom.setAttribute(

					'href',
					window.URL.createObjectURL( content ),

					)

				pom.setAttribute('download', name );

				pom.click();

			});

		break;

	}

	return 'OKAY PACKAGING TIME :D';

}

COMPILER.compile.img = function( callback = function(){}, iterator = 0, unique = [] ){

	if( unique.length === 0 ){

		console.log('COMPILING IMAGES (HOPEFULLY...)')

		for ( let i = 0; i < document.images.length; i++ ){

			COMPILER.img.array.push( document.images[i] );

		}

		for( let i in COMPILER.img.array ){

			let test = true;

			let src = COMPILER.img.array[i].src;

			for( let u = 0; u < unique.length; u++ ){

				if( src === unique[u].src ){ test = false }

			}

			if( test ) unique.push( COMPILER.img.array[i] );

		}

			COMPILER.img.array = unique.slice();

			window.setTimeout( function(){ COMPILER.compile.img( callback, iterator, unique) }, 0 );

	} else {

		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');

		document.body.appendChild( canvas );

		canvas.width  = unique[iterator].width;
		canvas.height = unique[iterator].height;

		context.drawImage( unique[iterator], 0,0, canvas.width, canvas.height );

// 		let url = canvas.toDataURL( "image/png" ).substring( 22 );

		let blob = canvas.toBlob( function( blob ){

			COMPILER.img.blob.push( blob );

			if( COMPILER.img.blob.length === COMPILER.img.array.length ){

				console.log('COMPILING IMAGES COMPLETE! 📷')
				callback();

			}
			else{

				iterator++;
				window.setTimeout( function(){ COMPILER.compile.img( callback, iterator, unique) }, 0 );

			}

		} );

// 				img.file( "unifont.min.png", blob, { binary: true } );
	}

	return COMPILER.img.array;

}

COMPILER.compile.index = function( callback = function(){}, save = true ){

	console.log( 'COMPILING INDEX...' );

	let enter = COMPILER.enter;
	let quote = COMPILER.quote;

	// Remove comments

// 	let comments = document.body.getElementsByTagName('comment');

// 	console.log( comments );

// 	for ( let i = 0; i < comments.length; i++ ){

// 		comments[i].parentElement.removeChild( comments[i] );

// 	}

	let source = '<!DOCTYPE html>'

	source += enter;

	source += '<html lang="en">'
	
	source += enter;

	source += '<head>'

	// Remove styles from head element.

	let link = HEAD.getElementsByTagName('link');
	
	for ( let i = 0; i < link.length; i++ ){

		if( link[i].rel === 'stylesheet' ){

            console.log( link[i] );

			HEAD.removeChild( link[i] );

			console.log( HEAD )

		}

	}

	let head = HEAD.innerHTML;

	source += head;

	// Replace css file name with output file name.
	
	source += enter;

	let url = quote + COMPILER.css.path + COMPILER.css.name + quote;

	source += '<link rel='+ quote + 'stylesheet' + quote + ' href=' + url + '>'

	source += '</link>'

	source += COMPILER.enter;

	source += '</head>';

	source += COMPILER.enter;

	source += '<body>';

	// Remove observed dynamic elements to prevent duplication.

	for( let i = 0; i < COMPILER.dynamic.length; i++ ){

		// Ignore previously removed files.

		if( COMPILER.dynamic[i].parentElement !== null ){

			COMPILER.dynamic[i].parentElement.removeChild( COMPILER.dynamic[i] );

		}

	}

	// 	Remove scripts from body element.

	while( document.body.getElementsByTagName('script').length !==0 ){

		document.body.removeChild( document.body.getElementsByTagName('script')[0] );

	}

	// Add body html to source.

	source += document.body.innerHTML;

	source += COMPILER.enter;

	// Add minified script reference to source.

	let script = '<script src=';
	
	script += COMPILER.quote + COMPILER.js.path + COMPILER.js.name + COMPILER.quote;

	script += '></script>'

	source += script;

	source += enter;

	source += '</body>';

	// Save file

	source = COMPILER.whitespace( source );

	console.log( 'COMPILING INDEX COMPLETE. THANK YOU! :D' );

	COMPILER.index.file = COMPILER.export( source, COMPILER.index.name, save );

	// Send callback function with data url for packaging.

	window.setTimeout( callback, 0, COMPILER.index.file );

	COMPILER.index.source = source;

	return source;

}

COMPILER.compile.css = function( callback = function(){}, save = true, index = 0, source = '' ){

	let link = document.head.getElementsByTagName('link');

	let styles = [];

	for ( let i = 0; i < link.length; i++ ){

		if( link[i].rel === 'stylesheet' ) styles.push( link[i] );

	}

	for( let i = 0; i < styles.length; i++ ){

		let frame = document.createElement( 'iframe' );

		frame.id = 'COMPILER_FRAME';

		document.body.appendChild( frame );

		frame.src = styles[ index ].href;

		frame.onload = function(){

			let frame = document.getElementById( 'COMPILER_FRAME' );

			source += frame.contentWindow.document.body.innerText;

			source += String.fromCharCode(13);

			document.body.removeChild( frame );

			if( index < styles.length-1 ){

				window.setTimeout(

					function(){ COMPILER.compile.css( callback, save, index +v1, source ) },
					0

				);

			} else if( index === styles.length-1 ){

				source = COMPILER.whitespace( source );

				COMPILER.css.file = COMPILER.export( source, COMPILER.css.name, save );

				COMPILER.css.source = source;

				console.log( 'COMPILING CSS COMPLETE! YAY :)')

				window.setTimeout( callback, 0, COMPILER.css.file );

				return source;
			}

		}

	}

	return 'COMPILING CURRENT CSS FILE...'

}

COMPILER.compile.js = function( callback = function(){}, save = true, index = 0, source = '' ){

	let array = document.body.getElementsByTagName('script');

	let scripts = [];

	let i = 0;

	for( let i = 0; i < array.length; i++ ){

		if( array[ i ].className !== 'COMPILER_IGNORE' ){

			scripts.push( array[ i ] );
		
		}
	}

	let frame = document.createElement( 'iframe' );

	frame.id = 'COMPILER_FRAME';

	document.body.appendChild( frame );

	frame.src = scripts[ index ].src;

	frame.onload = function(){

		let frame = document.getElementById( 'COMPILER_FRAME' );

		source += frame.contentWindow.document.body.innerText;

		source += String.fromCharCode(13);

		document.body.removeChild( frame );

		if( index < scripts.length-1 ){

			window.setTimeout(

				function(){ COMPILER.compile.js( callback, save, index +1, source ); },
				0

			);

		} else if( index === scripts.length-1 ){

			source = COMPILER.whitespace( source );

			COMPILER.js.file = COMPILER.export( source, COMPILER.js.name, save );

			console.log('COMPILING SCRIPTS COMPLETE. THAT SHOULD HELP ;)')

			window.setTimeout( callback, 0, COMPILER.js.file );

			COMPILER.js.source = source;

			return source;

		}
	}

	return 'COMPILING SCRIPTS...'

}

COMPILER.compile.manifest = function( callback = function(){}, save = true ){

	let src = ''

	let link = document.getElementsByTagName( 'link' );

	for( let i in link ){

		if( link[i].rel === 'manifest' ) src = link[i].href;

	}

	let source = ''

	let frame = document.createElement( 'iframe' );

	frame.id = 'COMPILER_FRAME';

	document.body.appendChild( frame );

	frame.src = src;

	frame.onload = function(){

		let frame = document.getElementById( 'COMPILER_FRAME' );

		source += frame.contentWindow.document.body.innerText;

		source += String.fromCharCode(13);

		document.body.removeChild( frame );

		COMPILER.manifest.source = source;

		COMPILER.js.file = COMPILER.export( source, COMPILER.manifest.name, save );

		callback();

		return source;

	}

	return 'MANIFEST DESTINY! :D'
}

COMPILER.combine = function( array = [], iterator = 0 ){

	

}

COMPILER.export = function( source, name, save = true ){

	var pom = document.createElement('a');

	pom.setAttribute(

		'href',
		'data:text/plain;charset=utf-8,' + encodeURIComponent( source ));

	pom.setAttribute('download', name );

	if( save ) pom.click();

	return( pom.href );

}

COMPILER.whitespace = function( source ){

	let count = 0;

	for( let i = 0; i < source.length; i++ ){

		if( source.charAt( i ) === COMPILER.enter || source.charAt( i ) === String.fromCharCode( 13 ) ){

			count++;

			if( count > 1 ){

				a = source.substring( 0, i-1 );
				b = source.substring( i );
				source = a + b;
				i--

			}

		} else {

			count = 0;

		}

	}

	return source;

}