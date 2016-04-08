/*
* Plugin: CustomAlert Plug-in
* A responsive, and customizable alert plug-in that accepts strings,
* and HTML DOM as content.
* Dependencies: CSS3
* Author: Lawrence Felix A. Bordeos
* Version: 0.1
*/

(function(){

	//constructor
	this.Alert = function() {

		//global vars
		this.closeButton = null;
		this.alert = null;
		this.overlay = null;
		this.transitionEnd = transitionSelect();

		var defaults = {
			positiveMessage: "Ok",
			maxWidth: 600,
			minWidth: 250,
			overlay: true,
			shake: true,
			sound: true,
			soundFile: "audio/alert",
			content: null,
			contentID: null
		}

		if(arguments[0] && typeof arguments[0] === "object") {
			this.options = mergeOptions(defaults, arguments[0]);
		}

		if(this.options.content === null && this.options.contentID !== null && typeof this.options.contentID === "string") {
			var c = document.getElementById(this.options.contentID);
			if( c !== null) {
				if(typeof c === "string") {
					this.options.content = c;
				} else {
					this.options.content  = c.innerHTML;
				}
			} else {
				this.options.content = "An error occured!"; //default msg
			}
		}
	}

	//methods
	Alert.prototype.open = function() {
		//build alert
		buildAlert.call(this);

		//bind events
		bindEvents.call(this);

		window.getComputedStyle(this.alert).height;

		this.alert.className = this.alert.className + (this.alert.offsetHeight > window.innerHeight? " alert-open alert-anchor":" alert-open");
		this.overlay.className = this.overlay.className + " alert-open";
	}

	Alert.prototype.close = function() {
		var _ = this;
		this.alert.className = this.alert.className.replace(" alert-open", "");
		this.overlay.className = this.overlay.className.replace(" alert-open", "");

		this.alert.addEventListener(this.transitionEnd, function() {
			_.alert.parentNode.removeChild(_.alert);
		});
		this.overlay.addEventListener(this.transitionEnd, function() {
			if(_.overlay.parentNode) {
				_.overlay.parentNode.removeChild(_.overlay);
			}
		});
	}

	Alert.prototype.shake = function() {
		var _ = this;
		this.alert.className = this.alert.className + " alert-shake";
		this.audioElement.play();
		setTimeout(function(){
			_.alert.className = _.alert.className.replace(" alert-shake","");
		},1000)
	}

	function transitionSelect() {
	    var el = document.createElement("div");
	    if (el.style.WebkitTransition) return "webkitTransitionEnd";
	    if (el.style.OTransition) return "oTransitionEnd";
	    return 'transitionend';
	}

	function mergeOptions(defaults, setOps) {
		var option;
		for(option in setOps) {
			if(setOps.hasOwnProperty(option)) {
				defaults[option] = setOps[option];
			}
		}
		return defaults;
	}

	function buildAlert() {
		var content, documentFragment;

		content = this.options.content;

		documentFragment = document.createDocumentFragment();

		//add overlay to documentFragment if true
		if(this.options.overlay === true) {
			this.overlay = document.createElement("div");
			this.overlay.className = "alert-overlay";
			documentFragment.appendChild(this.overlay);
		}

		//build container
		this.alert = document.createElement("div");
		this.alert.className = "alert-container " + this.options.className;
		if(window.innerWidth < this.options.maxWidth) {
			this.alert.style.maxWidth = (window.innerWidth - 40) + "px";
		} else {
			this.alert.style.maxWidth = this.options.maxWidth + "px";
		}
		this.alert.style.minWidth = this.options.minWidth + "px";

		//create content
		this.contentHolder = document.createElement("div");
		this.contentHolder.className = "alert-content";
		this.contentHolder.innerHTML = content;
		this.alert.appendChild(this.contentHolder);

		//create positive button
		this.positiveButton = document.createElement("button");
		this.positiveButton.className = "alert-close alert-positive-btn";
		this.positiveButton.innerHTML = this.options.positiveMessage;
		this.alert.appendChild(this.positiveButton);

		if(this.options.sound) {
			//create audio element
			this.audioElement = document.createElement("audio");
			this.audioElement.controls = false;
			this.audioElement.className = "alert-audio";

			//create source elements
			this.sourceMP3 = document.createElement("source");
			this.sourceMP3.type="audio/mp3";
			this.sourceMP3.src = this.options.soundFile + ".mp3";

			this.sourceOGG = document.createElement("source");
			this.sourceOGG.type="audio/ogg";
			this.sourceOGG.src = this.options.soundFile + ".ogg"

			this.audioElement.appendChild(this.sourceMP3);
			this.audioElement.appendChild(this.sourceOGG);
			this.alert.appendChild(this.audioElement);
		}

		//add alert to documentFragment
		documentFragment.appendChild(this.alert);

		//append documentFragment to body
		document.body.appendChild(documentFragment);
	}

	function bindEvents() {

		this.positiveButton.addEventListener('click', this.close.bind(this));

		if(this.overlay) {
			//shake alert box
			if(this.options.shake) {
				this.overlay.addEventListener('click', this.shake.bind(this));
			} else {
				this.overlay.addEventListener('click', this.close.bind(this));
			}
		}
	}
}())