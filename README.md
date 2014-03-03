Needles
=======

A simple Javascript dependency injection container. It is inspired by PHP's unfortunately-named [Pimple](http://pimple.sensiolabs.org).

**Download:** [Production](needles.min.js) | [Development](needles.js)


Usage
-----

Prepare a new container by creating a new instance of the `Needles` class:

~~~js
var container	= new Needles();
~~~

Needles is able to manage two different kinds of data: _services_ and _parameters_.


### Defining Parameters

A parameter is simply a constant value. To define a parameter, call `set()` on the container instance:

~~~js
container.set('exampleParameter', 'example');
container.set('otherParameter', 'something else');
~~~


### Defining Services

A service is an object that does something as part of a larger system – for example, a templating engine, or an API interface. Almost any object could be a service.

Services are defined by calling `set()` with an anonymous function that returns an object:

~~~js
container.set('example', function(container){
	// The container instance will be provided as the first parameter
	return new ExampleObject(container.get('exampleParameter'));
});
~~~

The function will be provided the current container instance as the first parameter, allowing reference to other services or parameters.

Objects are only created when requested, so the definition order does not matter, and there is no unnecessary performance penalty since unused services are never loaded. 


### Bulk Definitions

You can also define multiple parameters and services in bulk:

~~~js
container.set({
	exampleParameter:	'value',
	exampleService:		function(){
		/* ... */
	}
});
~~~

You can also provide this to the initial constructor to do the same:

~~~js
var container	= new Needles({
	exampleParameter:	'value',
	exampleService:		function(){
		/* ... */
	}
});
~~~

The `set()` method returns the same container instance, allowing chaining:

~~~js
container.set('exampleParameter', 'value')
		 .set('otherParameter', 'other');
~~~


### Accessing Dependencies

Once defined, accessing parameters or services is done by calling `get()`:

~~~js
var example	= container.get('exampleDependency');
~~~

If an unknown service is requested, an error is thrown.


Advanced Usage
--------------

### Protecting Parameters

Any anonymous function provided is treated as a service, so if you want a service _to return a function_, you need to wrap the anonymous functions with the `protect()` method:

~~~js
container.set('random', container.protect(function(){
	return Math.random();
}));
~~~


### Modifying Services after Creation

In some cases, you may want to modify a service definition after it has been defined. To do this, call the `extend()` method to define additional code to be run on your service after it is created:

~~~js
// Initial definition
container.set('example', function(container){
	return new Example();
});

// Extension
container.extend('example', function(instance, container){
	// Modify instance
	instance.setOption(container.get('exampleOption'));
	
	return instance;
});
~~~

The first argument to the function provided to `extend` will be the service object, and the second is the container instance. The name of the service will be provided as the third parameter, however generally will not be needed.


### Accessing a Service Creation Function

Calling `get()` for a service will call the defined function, but to access the original function itself, call `raw()`:

~~~js
container.set('example', function(){
	return new Example();
});

var fn = container.raw('example');
~~~


### Nesting Containers

By using a container instance as a service within another container, you can have nested dependencies:

~~~js
// Parent container
var container	= new Needles();

container.set('nested', function(){
	// Child container
	var subcontainer	= new Needles();
	subcontainer.set('something', function(){
		return new Something();
	});
	
	return subcontainer;
});
~~~

You can then access a service on the child by chaining the method call:

~~~js
var something	= container.get('nested').get('something');
~~~


### Defining Factory Services

By default, each time you retrieve a service, the _same instance_ will be returned – so the service function will only be called once. If you want a _different_ instance returned each time – having the service function called every time – wrap the function with the `factory()` method:

~~~js
container.set('example', container.factory(function(container){
	return new Example();
}));
~~~


Contributing
------------

See the [Contributing information](CONTRIBUTING.md) for details. Basically: open a pull request!


Licence
-------

Needles is [released under the MIT license](LICENSE). Copyright 2014 Adam Averay.
