define(["libs/underscore","libs/backbone/backbone","utils/add-logging","utils/localization"],function(a,b,c,d){function e(){var b=Array.prototype.slice.call(arguments,0),c=b.pop();return b.unshift(c),a.defaults.apply(a,b)}function f(b,c){c=c||"model";var e=a.template(b.join(""));return function(a,b){var f={view:b||{},_l:d};return f[c]=a||{},e(f)}}var g={logger:null,_logNamespace:"."};c(g);var h=b.Model.extend({initialize:function(b){if(this._checkEnabledSessionStorage(),!b.id)throw new Error("SessionStorageModel requires an id in the initial attributes");this.id=b.id;var c=this.isNew()?{}:this._read(this);this.clear({silent:!0}),this.save(a.extend({},this.defaults,c,b),{silent:!0}),this.on("change",function(){this.save()})},_checkEnabledSessionStorage:function(){try{return sessionStorage.length}catch(a){return alert("Please enable cookies in your browser for this Galaxy site"),!1}},sync:function(a,b,c){c.silent||b.trigger("request",b,{},c);var d={};switch(a){case"create":d=this._create(b);break;case"read":d=this._read(b);break;case"update":d=this._update(b);break;case"delete":d=this._delete(b)}return void 0!==d||null!==d?c.success&&c.success():c.error&&c.error(),d},_create:function(a){try{var b=a.toJSON(),c=sessionStorage.setItem(a.id,JSON.stringify(b));return null===c?c:b}catch(d){if(!(d instanceof DOMException&&navigator.userAgent.indexOf("Safari")>-1))throw d}return null},_read:function(a){return JSON.parse(sessionStorage.getItem(a.id))},_update:function(a){return a._create(a)},_delete:function(a){return sessionStorage.removeItem(a.id)},isNew:function(){return!sessionStorage.hasOwnProperty(this.id)},_log:function(){return JSON.stringify(this.toJSON(),null,"  ")},toString:function(){return"SessionStorageModel("+this.id+")"}});!function(){h.prototype=a.omit(h.prototype,"url","urlRoot")}();var i={searchAttributes:[],searchAliases:{},searchAttribute:function(b,c){var d=this.get(b);return c&&void 0!==d&&null!==d?a.isArray(d)?this._searchArrayAttribute(d,c):-1!==d.toString().toLowerCase().indexOf(c.toLowerCase()):!1},_searchArrayAttribute:function(b,c){return c=c.toLowerCase(),a.any(b,function(a){return-1!==a.toString().toLowerCase().indexOf(c.toLowerCase())})},search:function(b){var c=this;return a.filter(this.searchAttributes,function(a){return c.searchAttribute(a,b)})},matches:function(a){var b="=",c=a.split(b);if(c.length>=2){var d=c[0];return d=this.searchAliases[d]||d,this.searchAttribute(d,c[1])}return!!this.search(a).length},matchesAll:function(b){var c=this;return b=b.match(/(".*"|\w*=".*"|\S*)/g).filter(function(a){return!!a}),a.all(b,function(a){return a=a.replace(/"/g,""),c.matches(a)})}},j={hiddenUntilActivated:function(b,c){if(c=c||{},this.HUAVOptions={$elementShown:this.$el,showFn:jQuery.prototype.toggle,showSpeed:"fast"},a.extend(this.HUAVOptions,c||{}),this.HUAVOptions.hasBeenShown=this.HUAVOptions.$elementShown.is(":visible"),this.hidden=this.isHidden(),b){var d=this;b.on("click",function(){d.toggle(d.HUAVOptions.showSpeed)})}},isHidden:function(){return this.HUAVOptions.$elementShown.is(":hidden")},toggle:function(){return this.hidden?(this.HUAVOptions.hasBeenShown||a.isFunction(this.HUAVOptions.onshowFirstTime)&&(this.HUAVOptions.hasBeenShown=!0,this.HUAVOptions.onshowFirstTime.call(this)),a.isFunction(this.HUAVOptions.onshow)&&(this.HUAVOptions.onshow.call(this),this.trigger("hiddenUntilActivated:shown",this)),this.hidden=!1):(a.isFunction(this.HUAVOptions.onhide)&&(this.HUAVOptions.onhide.call(this),this.trigger("hiddenUntilActivated:hidden",this)),this.hidden=!0),this.HUAVOptions.showFn.apply(this.HUAVOptions.$elementShown,arguments)}},k={initialize:function(a){this.draggable=a.draggable||!1},$dragHandle:function(){return this.$(".title-bar")},toggleDraggable:function(){this.draggable?this.draggableOff():this.draggableOn()},draggableOn:function(){this.draggable=!0,this.dragStartHandler=a.bind(this._dragStartHandler,this),this.dragEndHandler=a.bind(this._dragEndHandler,this);var b=this.$dragHandle().attr("draggable",!0).get(0);b.addEventListener("dragstart",this.dragStartHandler,!1),b.addEventListener("dragend",this.dragEndHandler,!1)},draggableOff:function(){this.draggable=!1;var a=this.$dragHandle().attr("draggable",!1).get(0);a.removeEventListener("dragstart",this.dragStartHandler,!1),a.removeEventListener("dragend",this.dragEndHandler,!1)},_dragStartHandler:function(a){return a.dataTransfer.effectAllowed="move",a.dataTransfer.setData("text",JSON.stringify(this.model.toJSON())),this.trigger("draggable:dragstart",a,this),!1},_dragEndHandler:function(a){return this.trigger("draggable:dragend",a,this),!1}},l={initialize:function(a){this.selectable=a.selectable||!1,this.selected=a.selected||!1},$selector:function(){return this.$(".selector")},_renderSelected:function(){this.$selector().find("span").toggleClass("fa-check-square-o",this.selected).toggleClass("fa-square-o",!this.selected)},toggleSelector:function(){this.$selector().is(":visible")?this.hideSelector():this.showSelector()},showSelector:function(a){a=void 0!==a?a:this.fxSpeed,this.selectable=!0,this.trigger("selectable",!0,this),this._renderSelected(),this.$selector().show(a)},hideSelector:function(a){a=void 0!==a?a:this.fxSpeed,this.selectable=!1,this.trigger("selectable",!1,this),this.$selector().hide(a)},toggleSelect:function(a){this.selected?this.deselect(a):this.select(a)},select:function(a){return this.selected||(this.trigger("selected",this,a),this.selected=!0,this._renderSelected()),!1},deselect:function(a){return this.selected&&(this.trigger("de-selected",this,a),this.selected=!1,this._renderSelected()),!1}};return{LoggableMixin:g,SessionStorageModel:h,mixin:e,SearchableModelMixin:i,HiddenUntilActivatedViewMixin:j,DraggableViewMixin:k,SelectableViewMixin:l,wrapTemplate:f}});
//# sourceMappingURL=../../maps/mvc/base-mvc.js.map