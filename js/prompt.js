/*
* Plugin: Customprompt Plug-in
* A responsive, and customizable prompt plug-in that accepts strings,
* and HTML DOM as content.
* Dependencies: CSS3
* Author: Lawrence Felix A. Bordeos
* Version: 0.1
*/

(function(){

	//constructor
	this.Prompt = function() {

		//global vars
		this.prompt = null;
		this.overlay = null;
		this.answer = null;
		this.transitionEnd = transitionSelect();

		var defaults = {
			positiveMessage: "Ok",
			negativeMessage: "Cancel",
			positiveCallback: null,
			cancelCallback: function(){console.log("negative")},
			submitCallback: null,
			maxWidth: 600,
			minWidth: 250,
			overlay: true,
			shake: true,
			sound: true,
			soundFile: "audio/prompt",
			content: null,
			contentID: null
		}

		if(arguments[0] && typeof arguments[0] === "object") {
			this.options = mergeOptions(defaults, arguments[0]);
		}

		if(this.options.submitCallback === null || this.options.submitCallback === "") {
			throw "submitCallback cannot be null!";

		}

		if(this.options.content === null) {
			if(this.options.contentID !== null && typeof this.options.contentID === "string") {
				var c = document.getElementById(this.options.contentID);
				if( c !== null) {
					if(typeof c === "string") {
						this.options.content = c + "<br/><input type=\"text\" name=\"prompt-input-id\" id=\"prompt-input-id\" />";
					} else {
						this.options.content  = c.innerHTML;
						//delete prompt content in current DOM
						c.parentNode.removeChild(c);
					}
				} else {
					throw "Prompt box has no content!";
				}
			} else {
				throw "Prompt box has no content!";
			}	
		}
	}

	//methods
	Prompt.prototype.open = function() {
		//build prompt
		buildPrompt.call(this);

		//bind events
		bindEvents.call(this);

		window.getComputedStyle(this.prompt).height;

		this.prompt.className = this.prompt.className + (this.prompt.offsetHeight > window.innerHeight? " prompt-open prompt-anchor":" prompt-open");
		this.overlay.className = this.overlay.className + " prompt-open";
	}

	Prompt.prototype.close = function() {
		var _ = this;

		this.prompt.className = this.prompt.className.replace(" prompt-open", "");
		this.overlay.className = this.overlay.className.replace(" prompt-open", "");

		this.prompt.addEventListener(this.transitionEnd, function() {
			_.prompt.parentNode.removeChild(_.prompt);
		});
		this.overlay.addEventListener(this.transitionEnd, function() {
			if(_.overlay.parentNode) {
				_.overlay.parentNode.removeChild(_.overlay);
			}
		});
	}

	Prompt.prototype.shake = function() {
		var _ = this;
		this.prompt.className = this.prompt.className + " prompt-shake";
		this.audioElement.play();
		setTimeout(function(){
			_.prompt.className = _.prompt.className.replace(" prompt-shake","");
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

	function buildPrompt() {
		var content, documentFragment;

		content = this.options.content;

		documentFragment = document.createDocumentFragment();

		//add overlay to documentFragment if true
		if(this.options.overlay === true) {
			this.overlay = document.createElement("div");
			this.overlay.className = "prompt-overlay";
			documentFragment.appendChild(this.overlay);
		}

		//build container
		this.prompt = document.createElement("div");
		this.prompt.className = "prompt-container " + this.options.className;
		console.log(window.innerWidth);
		if(window.innerWidth < this.options.maxWidth) {
			this.prompt.style.maxWidth = (window.innerWidth - 40) + "px";
		} else {
			this.prompt.style.maxWidth = this.options.maxWidth + "px";
		}
		this.prompt.style.minWidth = this.options.minWidth + "px";

		//create content
		this.contentHolder = document.createElement("div");
		this.contentHolder.className = "prompt-content";
		this.contentHolder.innerHTML = content;
		this.prompt.appendChild(this.contentHolder);

		//create positive button
		this.positiveButton = document.createElement("button");
		this.positiveButton.className = "prompt-close  prompt-btn prompt-positive-btn";
		this.positiveButton.innerHTML = this.options.positiveMessage;
		this.prompt.appendChild(this.positiveButton);

		//create negative button
		this.negativeButton = document.createElement("button");
		this.negativeButton.className = "prompt-close prompt-btn  prompt-negative-btn";
		this.negativeButton.innerHTML = this.options.negativeMessage;
		this.prompt.appendChild(this.negativeButton);

		if(this.options.sound) {
			//create audio element
			this.audioElement = document.createElement("audio");
			this.audioElement.controls = false;
			this.audioElement.className = "prompt-audio";

			//create source elements
			this.sourceMP3 = document.createElement("source");
			this.sourceMP3.type="audio/mp3";
			this.sourceMP3.src = this.options.soundFile + ".mp3";

			this.sourceOGG = document.createElement("source");
			this.sourceOGG.type="audio/ogg";
			this.sourceOGG.src = this.options.soundFile + ".ogg"

			this.audioElement.appendChild(this.sourceMP3);
			this.audioElement.appendChild(this.sourceOGG);
			this.prompt.appendChild(this.audioElement);
		}

		//add prompt to documentFragment
		documentFragment.appendChild(this.prompt);

		//append documentFragment to body
		document.body.appendChild(documentFragment);
	}

	function performCallback(x) {

	}

	function bindEvents() {
		var _ = this;
		this.positiveButton.addEventListener('click', this.options.submitCallback.bind(this));
		this.negativeButton.addEventListener('click', this.options.cancelCallback.bind(this));

		if(this.overlay) {
			//shake prompt box
			if(this.options.shake) {
				this.overlay.addEventListener('click', this.shake.bind(this));
			} else {
				this.overlay.addEventListener('click', this.close.bind(this));
			}
		}
	}
}())