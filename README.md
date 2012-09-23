#ExtensionManager.js
	This is a simple,lightweight way of adding extensions/plugins to an already created object,
	it provides a nice,standard way of handling and dealing with overloaded files,where a more
	modular approach can be taken or when one needs to extend a objects functionality without
	having to directly change the object source,it follows strict meta data rules,and requires
	you to return an object if you pass a function or directly pass an object that contains
	
		1. The Object to extend 
		2. The code to be added( either a function or an object)
		3. Meta Data:
				- Name : a string
				- Author : a string
				- Description : a string
				- Version : a string representing the version
				- License : an object containing objects with license data
		4. Dependencies: An array of strings of objects to check on the Object if they exist before we extend,if
			dependencies are found,they are added as arguments to the function provided,only if its a function
			
		5. Overwrite: a boolean value to indicate to overwrite if the extension name already exists
		
	##Example
	
		'''
			var EM = require("extensionmgr").ExtensionManager; 
				/* if in node or
				*	<script src="path to /extensionmgr.js"></script>
				* in the browser
				*/
			var Pluto = {
				"move": function(){},
				"stop": function(){},
				"Explode": function(){}
			};
			
			EM(Pluto).create("Rotate",function(){},null /* means no dependency*/,false)
			EM(Pluto).create("Explode",function(rotateExt){
				var rotate = rotateExt;
				//rest of your code doing some thing with that
				
			},["Rotate"] /* means no dependency*/,true /* wll overwrite any explode added before*/);
			EM(Pluto).create("Translate",{} /* if its an object,dependenicies will not be added*/,null,false);
			
			
				