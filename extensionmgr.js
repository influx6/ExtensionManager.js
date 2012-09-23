//basic extension management system
var ExtensionManager = (function(root){
   //check the root files
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

       validateDependency = function(e,dep){
            if(!dep) return [];
            var i = 0,len = dep.length,item,obj= {};
            for(; i < len; i++){
               item = dep[i];
               if(!(item in e) && !(item in e.ext)){ 
                  throw new Error("Dependency is not found: "+item+" in "+ (e.name || e.__name__ || e.extensionName));
               }
               obj[item] = e[item] || e.ext[item];
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

      iterable = function(collection,eachfunc,finish){
         if(!collection || !eachfunc) return;
         //handles management of next call for collection,be it arrays or objects
         var len,keys,self = this,isArray = false;
         if(this.isObject(collection)){ keys = getKeys(collection); len = keys.length; }
         if(this.isArray(collection)){ isArray = true; len = collection.length;}

         eachfunc.collection = collection;
         eachfunc.size = len;
         eachfunc.__ri__ = len - 1;
         eachfunc.pos = 0;
         eachfunc.finish = finish;
         eachfunc.item = null;
         eachfunc.next = function(){
            var item,key;
            if(!isArray) key = getKeys[eachfunc.pos]; item = eachfunc.collection[key];
            if(isArray) key = eachfunc.pos; item = eachfunc.collection[key];

            if(eachfunc.pos >= eachfunc.size){ 
               if(eachfunc.finish) eachfunc.finish(eachfunc.item,key,eachfunc.collection);
               return false;
            }

            eachfunc.pos++;
            if(!item) return false;
            
            eachfunc.item = item;
            eachfunc(item,key,eachfunc.collection);
            return item;
         };
         
         return eachfunc;
      }, 
      getValues = function(o){
	    if(!matchType(o,"object")) return false;
	    var i=0,vals=[];
	    for(var j in o){
           vals[i] = o[j];
           i++;
        };
        return vals;
	  },

    getKeys = function(o){
	    if(!matchType(o,"object")) return false;
	    var i=0,vals=[];
	    for(var j in o){
           vals[i] = j;
           i++;
        };
        return vals;
	  },

     ExtensionMgr =  {
        ext: { ext:{} },

         create: function(name,ext,deps,mustOverwright){
            var subject = this.ext,extensions = subject.ext,
            //basics checks for valid extensions,
            finalize = function (s,t,d){
                   var _ext,
                   dependency = validateDependency(s,d);

               if(matchType(t,"function")) _ext = validate(t.apply(t,getValues(dependency)));
               if(matchType(t,"object")){
                  t.depends = dependency; _ext = t;
               }
            
               s.ext[name] = validate(_ext);
               s.ext[name].name = name;
               s.ext[name].ename = name;
               s.ext[name].signature = "__extensions__";

               //leak the extension onto the public handler
               s[name] = s.ext[name];
            };

            if(!mustOverwright && (subject[name] || extensions[name])) throw new Error("Extension Already Exist!");
            if(deps && !matchType(deps,"array")) throw new Error("Dependency list must be an Array!");
            if(!matchType(name,"string")) throw new Error("Arguments are not the proper types!");
            

            if(this instanceof argument.callee){
               finalize(subject,ext,deps);
               return this;
            }

            finalize(root,ext,deps);
            return root;
         },

         remove: function(name){
            var extensions = root.ext;
            if(!extensions[name]) return;
            delete extensions[name];
         },

         give: function(obj/*,list of all extensions you want, if all,then all will be added*/){},

         lend: function(obj/*,list of extensions you need,if all,all will be lent to the obj*/){},

         lists: function(){
            var exts = this.ext;
            for(var i in exts){
               return ("Name: "+ i +" description: "+exts[i]+";")
            }
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

