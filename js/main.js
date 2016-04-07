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
			className: 'pop-out',
			positiveMessage: "Ok",
			closeButton: false,
			content: "",
			maxWidth: 600,
			minWidth: 250,
			overlay: true
		}

		if(arguments[0] && typeof arguments[0] === "object") {
			this.options = mergeOptions(defaults, arguments[0]);
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
			_.alert.parentNode.removeChild(_.modal);
		});
		this.overlay.addEventListener(this.transitionEnd, function {
			if(_.overlay.parentNode) {
				_.overlay.parentNode.removeChild(_.overlay);
			}
		});
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
			if(options.hasOwnProperty(options)) {
				defaults[option] = setOps[options];
			}
		}
		return source;
	}

	function buildAlert() {
		var content, documentFragment;

		//check content type
		if(typeof this.options.content === "string") {
			content = this.options.content;
		} else {
			content = this.option.content.innerHTML;
		}

		documentFragment = document.createDocumentFragment();

		//add overlay to documentFragment if true
		if(this.option.overlay === true) {
			this.overlay = document.createElement("div");
			this.overlay.className = "alert-overlay";
			documentFragment.appendChild(this.overlay);
		}

		//build container
		this.alert = document.createElement("div");
		this.alert = "alert-container " + this.options.className;
		this.alert.style.minWidth = this.options.minWidth + "px";
		this.alert.style.maxWidth = this.option.maxWidth + "px";

		//add a close button if true
		if(this.options.closeButton == true) {
			this.closeButton = document.createElement("button");
			this.closeButton.className = "alert-close alert-close-btn";
			this.closeButton.innerHTML = "x";
			this.alert.appendChild(this.closeButton);
		}

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

		//add alert to documentFragment
		documentFragment.appendChild(this.alert);

		//append documentFragment to body
		document.body.appendChild(documentFragment);
	}

	function bindEvents() {

		this.positiveButton.addEventListener('click', this.close.bind(this));

		if(this.closeButton) {
			this.closeButton.addEventListener('click', this.close.bind(this));
		}

		if(this.overlay) {
			this.overlay.addEventListener('click', this.close.bind.(this));
		}
	}
}())