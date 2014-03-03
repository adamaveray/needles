/**
 * Needles
 *
 * A simple Javascript dependency injection container
 * 
 * @version		0.1.1
 * @link		http://adamaveray.github.io/needles
 * @copyright	Adam Averay 2014
 * @license		MIT
 */
/*! Needles 0.1.1 | adamaveray.github.io/needles | © 2014 Adam Averay | MIT */
(function(root, undefined){
	/**
	 * @constructor
	 */
	var Needles	= root.Needles = function(dependencies){
		if(!(this instanceof Needles)){
			// Called without `new`
			return new Needles(dependencies);
		}
		
		// Prepare containers
		this._values		= {};
		this._services		= {};
		this._factories		= {};
		this._extensions	= {};

		if(dependencies){
			// Load initial dependencies
			this.set(dependencies);
		}
	};


	// Utilities
	function wrapService(service, type){
		return {
			'__needles__':	type,
			service:		service
		};
	}

	function unwrapService(value){
		return value.service;
	}
	
	function isWrappedService(value, type){
		return (value.__needles__ === type);
	}

	function isCallable(value){
		return (typeof(value) === 'function');
	}


	// Methods
	var proto	= Needles.prototype;

	/**
	 * Retrieve a stored dependency, instantiating it if it has not already been instantiated
	 *
	 * @param {String} name	The name of the dependency
	 * @returns {*}			The dependency value
	 * @throws {Error}		The dependency could not be found
	 */
	proto.get	= function(name){
		if(this._values[name] === undefined){
			var value;

			if(this._services[name] === undefined){
				// Unknown dependency
				throw new Error('Unknown dependency "'+name+'"');
			}
			
			// Initialise dependency
			value	= this._services[name](this, name);

			var extensions	= this._extensions[name];
			if(extensions !== undefined){
				for(var i = 0; i < extensions.length; i++){
					// Run extension
					value	= extensions[i](value, this, name);
				}
			}

			if(this._factories[name]){
				// Value must be reloaded each time - do not save
				return value;
			}

			// Store value
			this._values[name]	= value;
		}

		return this._values[name];
	};

	/**
	 * Define a dependency factory
	 *
	 * @param {String|Object} name	The name of the dependency, or an object containing dependencies
	 * @param {*} dependency		A parameter or service
	 * @returns {self}				The Needles instance, for chaining
	 */
	proto.set	= function(name, dependency){
		if(typeof name === 'object'){
			// Multiple given
			for(var key in name){
				if(!name.hasOwnProperty(key)){ continue; }

				this.set(key, name[key]);
			}

		} else {
			// Single given
			if(isCallable(dependency)){
				// Dependency is service
				this._services[name]	= dependency;

			} else if(isWrappedService(dependency, 'factory')){
				// Dependency is factory
				this._services[name]		= unwrapService(dependency);
				this._factories[name]	= true;

			} else {
				if(isWrappedService(dependency, 'protected')){
					// Dependency is protected function
					dependency	= unwrapService(dependency);
				}

				// Dependency is parameter
				this._values[name]	= dependency;
			}
		}

		return this;
	};

	/**
	 * Add an extension for a dependency, which will be run
	 * when preparing a dependency
	 *
	 * @param {String} name			The name of the dependency
	 * @param {Function} extension	The extension function
	 * @returns {this}				The Needles instance, for chaining
	 */
	proto.extend	= function(name, extension){
		if(!isCallable(extension)){
			throw new Error('Extension is not callable');
		}

		if(this._extensions[name] === undefined){
			this._extensions[name]	= [];
		}

		this._extensions[name].push(extension);

		return this;
	};

	/**
	 * Retrieves the unprocessed service function
	 *
	 * @param {String} name	The name of the dependency
	 * @returns {*}			The raw service function or the parameter value
	 */
	proto.raw	= function(name){
		if(this._services[name] !== undefined){
			// Raw service
			return this._services[name];
		}

		// No service - use value
		return this._values[name];
	};

	/**
	 * Converts a function to a format the container will treat as a parameter,
	 * not a service
	 *
	 * @param {function} parameter	The function to protected
	 * @returns {object}				A value to pass to set()
	 */
	proto.protect	= function(parameter){
		return wrapService(parameter, 'protected');
	};

	/**
	 * Converts a regular service builder to one that will be run every time
	 *
	 * @param {function} service	The service to convert to a factory
	 * @returns {object}				A value to pass to set()
	 */
	proto.factory	= function(service){
		if(!isCallable(service)){
			throw new Error('Service is not callable');
		}

		return wrapService(service, 'factory');
	};

}(this));
