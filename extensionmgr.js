//basic extension management system
var ExtensionManager = (function(root){
      if(!root) root = {};
      root.ext = (root["plugins"] || root['ext'] || root["extensions"] || {});
      var validate = function(ext){
         //basic checks 
         if(!matchType(ext,"object")) throw new Error("Extension must be Object or return an object!");

         //basic checks 
         if(!ext["version"]) throw new Error("Extension has no valid version information");
         if(!ext["author"]) throw new Error("Extension has no valid author information");
         if(!ext["license"]) throw new Error("Extension has no valid license information");
         if(!ext["description"]) throw new Error("Extension has no valid description information");

         //intermediate checks
         if(!matchType(ext["version"],"string")) throw new Error("Version's value is not a string in extension!");
         if(!matchType(ext["author"],"string")) throw new Error("Author's value is not a string in extension!");
         if(!matchType(ext["license"],"object")) throw new Error("Licence's value is not a string in extension!");
         if(!matchType(ext["description"],"string")) throw new Error("Description's value is not a string in extension!");

         //advance checks
         if(!(ext["license"]["type"])) throw new Error("License data has no valid licence type field!");

         return ext;
       },
       validateDependency = function(dep){
            if(!dep) return [];
            var i = 0,len = dep.length,item,obj=[];
            for(; i < len; i++){
               item = dep[i];
               if(!(item in root) && !(item in root.ext)){ 
                  throw new Error("Dependency is not found: "+item+" in "+ (root.__name__ || root.name));
               }
               obj[i] = root[item] || root.ext[item];
            };
            return obj;
       },
      checkExtensions = function(subject){
         if('plugins' in subject || 'extensions' in subject){
            extensions = subject["plugins"] || subject["extensions"];
         }
         return false;
      },
       matchType = function(obj,type){
             return ({}).toString.call(obj).match(/\s([\w]+)/)[1].toLowerCase() === type.toLowerCase();
       },
      ExtensionMgr =  {
         
         create: function(name,ext,deps,mustOverwright){
            var subject = root,extensions = root.ext;

            if(!mustOverwright && (root[name] || root.ext[name])) throw new Error("Extension Already Exist!");
            if(deps && !matchType(deps,"array")) throw new Error("Dependency list must be an Array!");
            if(!matchType(name,"string")) throw new Error("Arguments are not the proper types!");
            
            //basics checks for valid extensions,
            dependency = validateDependency(deps);

            extensions[name] = matchType(ext,"function") ? validate(ext.apply(ext,dependency)) : validate(ext);
            extensions[name].name = name;
            extensions[name].ename = name;
            extensions[name].signature = "__extensions__";

            //leak the extension onto the public handler
            subject[name] = subject.ext[name];

            return root;
         },

         remove: function(name){
            var extensions = root.ext;
            if(!extensions[name]) return;
            delete extensions[name];
         }
         
      };

      return ExtensionMgr;
});

var root = this;
if(root.exports !== undefined){
   root.exports = ExtensionManager;
}
else{
    root.ExtensionManager = ExtensionManager;
 }

