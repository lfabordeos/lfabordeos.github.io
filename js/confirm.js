/*
* Plugin: Customconfirm Plug-in
* A responsive, and customizable confirm plug-in that accepts strings,
* and HTML DOM as content.
* Dependencies: CSS3
* Author: Lawrence Felix A. Bordeos
* Version: 0.1
*/

(function(){

	//constructor
	this.Confirm = function() {

		//global vars
		this.confirm = null;
		this.overlay = null;
		this.answer = null;
		this.transitionEnd = transitionSelect();

		var defaults = {
			positiveMessage: "Ok",
			negativeMessage: "Cancel",
			positiveCallback: function(){console.log("positive");},
			negativeCallback: function(){console.log("negative")},
			maxWidth: 600,
			minWidth: 250,
			overlay: true,
			shake: true,
			sound: true,
			soundFile: "audio/confirm",
			content: null,
			contentID: null
		}

		if(arguments[0] && typeof arguments[0] === "object") {
			this.options = mergeOptions(defaults, arguments[0]);
		}

		if(this.options.content === null) {
			if(this.options.contentID !== null && typeof this.options.contentID === "string") {
				var c = document.getElementById(this.options.contentID);
				if( c !== null) {
					if(typeof c === "string") {
						this.options.content = c;
					} else {
						this.options.content  = c.innerHTML;
					}
				} else {
					throw "Confirm box has no content!";
				}
			} else {
				throw "Confirm box has no content!";
			}	
		}
	}

	//methods
	Confirm.prototype.open = function() {
		//build confirm
		buildConfirm.call(this);

		//bind events
		bindEvents.call(this);

		window.getComputedStyle(this.confirm).height;

		this.confirm.className = this.confirm.className + (this.confirm.offsetHeight > window.innerHeight? " confirm-open confirm-anchor":" confirm-open");
		this.overlay.className = this.overlay.className + " confirm-open";
	}

	Confirm.prototype.close = function(x) {
		var _ = this;

		this.confirm.className = this.confirm.className.replace(" confirm-open", "");
		this.overlay.className = this.overlay.className.replace(" confirm-open", "");

		this.confirm.addEventListener(this.transitionEnd, function() {
			_.confirm.parentNode.removeChild(_.confirm);
		});
		this.overlay.addEventListener(this.transitionEnd, function() {
			if(_.overlay.parentNode) {
				_.overlay.parentNode.removeChild(_.overlay);
			}
		});

		switch(x) {
			case "positive": _.options.positiveCallback.call();
								break;
			case "negative": _.options.negativeCallback.call();
								break;
		}
	}

	Confirm.prototype.shake = function() {
		var _ = this;
		this.confirm.className = this.confirm.className + " confirm-shake";
		this.audioElement.play();
		setTimeout(function(){
			_.confirm.className = _.confirm.className.replace(" confirm-shake","");
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

	function buildConfirm() {
		var content, documentFragment;

		content = this.options.content;

		documentFragment = document.createDocumentFragment();

		//add overlay to documentFragment if true
		if(this.options.overlay === true) {
			this.overlay = document.createElement("div");
			this.overlay.className = "confirm-overlay";
			documentFragment.appendChild(this.overlay);
		}

		//build container
		this.confirm = document.createElement("div");
		this.confirm.className = "confirm-container " + this.options.className;
		console.log(window.innerWidth);
		if(window.innerWidth < this.options.maxWidth) {
			this.confirm.style.maxWidth = (window.innerWidth - 40) + "px";
		} else {
			this.confirm.style.maxWidth = this.options.maxWidth + "px";
		}
		this.confirm.style.minWidth = this.options.minWidth + "px";

		//create content
		this.contentHolder = document.createElement("div");
		this.contentHolder.className = "confirm-content";
		this.contentHolder.innerHTML = content;
		this.confirm.appendChild(this.contentHolder);

		//create positive button
		this.positiveButton = document.createElement("button");
		this.positiveButton.className = "confirm-close  confirm-btn confirm-positive-btn";
		this.positiveButton.innerHTML = this.options.positiveMessage;
		this.confirm.appendChild(this.positiveButton);

		//create negative button
		this.negativeButton = document.createElement("button");
		this.negativeButton.className = "confirm-close confirm-btn  confirm-negative-btn";
		this.negativeButton.innerHTML = this.options.negativeMessage;
		this.confirm.appendChild(this.negativeButton);

		if(this.options.sound) {
			//create audio element
			this.audioElement = document.createElement("audio");
			this.audioElement.controls = false;
			this.audioElement.className = "confirm-audio";

			//create source elements
			this.sourceMP3 = document.createElement("source");
			this.sourceMP3.type="audio/mp3";
			this.sourceMP3.src = this.options.soundFile + ".mp3";

			this.sourceOGG = document.createElement("source");
			this.sourceOGG.type="audio/ogg";
			this.sourceOGG.src = this.options.soundFile + ".ogg"

			this.audioElement.appendChild(this.sourceMP3);
			this.audioElement.appendChild(this.sourceOGG);
			this.confirm.appendChild(this.audioElement);
		}

		//add confirm to documentFragment
		documentFragment.appendChild(this.confirm);

		//append documentFragment to body
		document.body.appendChild(documentFragment);
	}

	function bindEvents() {
		var _ = this;
		this.positiveButton.addEventListener('click', this.close.bind(this,"positive"));
		this.negativeButton.addEventListener('click', this.close.bind(this,"negative"));

		if(this.overlay) {
			//shake confirm box
			if(this.options.shake) {
				this.overlay.addEventListener('click', this.shake.bind(this));
			} else {
				this.overlay.addEventListener('click', this.close.bind(this));
			}
		}
	}
}())