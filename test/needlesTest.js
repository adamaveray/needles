(function(Needles, undefined){
	var container,
		defaultName		= 'test',
		defaultValue	= 'output',
		defaultService	= function(){
			return defaultValue;
		},
		setup	= function(){
			// Rebuild object
			container	= new Needles();
		};
	
	
	describe('Setting', function(){
		beforeEach(setup);
		
		it('should receive a parameter', function(){
			container.set(defaultName, defaultValue);
		});

		it('should receive a service', function(){
			container.set(defaultName, defaultService);
		});

		it('should allow chaining', function(){
			var chain	= container.set(defaultName, defaultService);
			
			expect(chain).toEqual(container);
		});

		it('should receive multiple dependencies', function(){
			container.set({
				'parameter':	defaultValue,
				'service':		defaultService
			});
		});

		it('should receive multiple dependencies at construction', function(){
			new Needles({
				'parameter':	defaultValue,
				'service':		defaultService
			});
		});
	});


	describe('Getting', function(){
		beforeEach(setup);
		
		it('should return a parameter', function(){
			// Store parameter
			container.set(defaultName, defaultValue);

			// Retrieve parameter
			var value	= container.get(defaultName);
			expect(value).toEqual(defaultValue);
		});

		it('should return a service instance', function(){
			// Store service
			container.set(defaultName, defaultService);

			// Retrieve service
			var value	= container.get(defaultName);
			expect(value).toEqual(defaultValue);
		});

		it('should throw an error for unknown dependencies', function(){
			expect(function(){
				container.get('nonexistent');
			}).toThrow();
		});

		it('should return a bulk dependency', function(){
			container.set({
				'parameter':	'other',
				'service':		defaultService
			});
			
			var value	= container.get('service');
			expect(value).toEqual(defaultValue);
		});

		it('should return a bulk dependency from construction', function(){
			var container	= new Needles({
				'parameter':	'other',
				'service':		defaultService
			});
			
			var value	= container.get('service');
			expect(value).toEqual(defaultValue);
		});

		it('should return a bulk dependency from construction', function(){
			var container	= new Needles({
				'parameter':	'other',
				'service':		defaultService
			});
			
			var value	= container.get('service');
			expect(value).toEqual(defaultValue);
		});	
	});
	
	
	describe('Raw service functions', function(){
		beforeEach(setup);
		
		it('should return raw service functions without calling', function(){
			container.set(defaultName, defaultService);
			
			var service	= container.raw(defaultName);
			expect(service).toEqual(defaultService);
		});
		
		it('should return protected service functions without calling', function(){
			container.set(defaultName, container.protect(defaultService));
			
			var value	= container.get(defaultName);
			expect(value).toEqual(defaultService);
		});
	});
	

	describe('Extending', function(){
		beforeEach(setup);
		
		it('should allow extension of services', function(){
			var customValue	= 'custom';
			
			container.set(defaultName, defaultService);
			
			container.extend(defaultName, function(original){
				// Value should have been provided correctly
				expect(original).toEqual(defaultValue);
				
				// Return modified value
				return customValue;
			});
			
			var value	= container.get(defaultName);
			expect(value).toEqual(customValue);
		});
		
		it('should not perform extension of parameters', function(){
			var customValue	= 'custom';
			
			container.set(defaultName, defaultValue);
			
			container.extend(defaultName, function(original){
				// Value should have been provided correctly
				expect(original).toEqual(defaultValue);
				
				// Return modified value
				return customValue;
			});
			
			var value	= container.get(defaultName);
			expect(value).toEqual(defaultValue);
		});

		it('should allow chaining', function(){
			var chain	= container.extend(defaultName, function(){});
			
			expect(chain).toEqual(container);
		});
	});
	

	describe('Factories', function(){
		beforeEach(setup);
		
		it('should return different values from factories', function(){
			var values	= ['a', 'b', 'c'];
			
			container.set(defaultValue, container.factory(function(){
				return values.shift();
			}));
			
			var i = 0;
			while(values.length){
				var checkValue	= values[0],
					value		= container.get(defaultValue);
				
				expect(value).toEqual(checkValue);
				
				// Infinite loop safety check
				if(++i > 10){
					throw new Error('Did not remove values from array correctly');
					break;
				}
			}
		});
		
		it('should only accept functions', function(){
			var invalidValues	= ['a string', 123, {}, []];
			
			for(var i = 0; i < invalidValues.length; i++){
				expect(function(){
					container.factory(invalidValues[i]);
				}).toThrow();
			}
		});
	});


	describe('Nested containers', function(){
		beforeEach(setup);
		
		it('should chain nested containers', function(){
			var childKey		= 'nested',
				childProperty	= 'subvalue',
				childValue		= 'example';
				
			container.set(childKey, function(){
				var subcontainer	= new Needles();
				subcontainer.set(childProperty, childValue);
				return subcontainer;
			});
			
			var value	= container.get(childKey).get(childProperty);
			expect(value).toEqual(childValue);
		});
	});


	describe('Service functions', function(){
		beforeEach(setup);
		
		it('should provide parameters to service functions', function(){
			container.set(defaultName, function(item, name){
				expect(item).toEqual(container);
				expect(name).toEqual(defaultName);
			});
			
			// Trigger
			container.get(defaultName);
		});

		it('should provide additional parameter to extended service functions', function(){
			container.set(defaultName, defaultService);
			
			container.extend(defaultName, function(value, item, name){
				expect(value).toEqual(defaultValue);
				expect(item).toEqual(container);
				expect(name).toEqual(defaultName);
				
				return value;
			});
			
			// Trigger
			container.get(defaultName);
		});
	});
}(window.Needles));
