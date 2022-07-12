var finishFlash = function() {
	if (document.getElementsByClassName('flash').length > 0) {
		setTimeout(
	  		function() {
	  			document.getElementsByClassName('flash')[0].remove();
	  		},
	  		4000
	  	);
	}
};

var FlashesExtension = function() {
	this.name = "flash";

	this.initialize = function (naja) {
		naja.addEventListener('complete', finishFlash);
	}
}

naja.registerExtension(new FlashesExtension());

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', finishFlash);
} else {
	finishFlash();
}
