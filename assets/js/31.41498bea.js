(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{325:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return r}));n(128);var o=n(0);function s(){const e=Object(o.getCurrentInstance)();if(!e)throw new Error("must be called in setup");return(null==e?void 0:e.proxy)||{}}function r(){const e=Object(o.ref)(!1);return Object(o.onMounted)(()=>{e.value=!0}),Object(o.onUpdated)(()=>{e.value=!1,setTimeout(()=>{e.value=!0},100)}),{recoShowModule:e}}},326:function(e,t,n){"use strict";n.d(t,"b",(function(){return f})),n.d(t,"a",(function(){return y}));var o=n(328),s=n.n(o),r=(n(327),n(0)),i=n(1),a=function(e,t,n,o){var s,r=arguments.length,i=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const u=/^(\w+)\-/,c=r.default.extend({props:{icon:{type:String,default:""},link:{type:String,default:""}}});let l=class extends c{getClass(e){return u.test(e)?e.replace(u,(...e)=>"reco"===e[1]?"iconfont "+e[0]:`${e[1]} ${e[0]}`):e}go(e){""!==e&&window.open(e)}render(){return(0,arguments[0])("i",s()([{},{class:this.getClass(this.icon),on:{click:this.go.bind(this,this.link)}}]),[this.$slots.default])}};l=a([i.b],l);var f=l,d=function(e,t,n,o){var s,r=arguments.length,i=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const p=r.default.extend({props:{delay:{type:String,default:"0"},duration:{type:String,default:".25"},transform:{type:Array,default:()=>["translateY(-20px)","translateY(0)"]}}});let h=class extends p{setStyle(e){e.style.transition=`transform ${this.duration}s ease-in-out ${this.delay}s, opacity ${this.duration}s ease-in-out ${this.delay}s`,e.style.transform=this.transform[0],e.style.opacity=0}unsetStyle(e){e.style.transform=this.transform[1],e.style.opacity=1}render(){return(0,arguments[0])("transition",{attrs:{name:"module"},on:{enter:this.setStyle,appear:this.setStyle,"before-leave":this.setStyle,"after-appear":this.unsetStyle,"after-enter":this.unsetStyle}},[this.$slots.default])}};h=d([i.b],h);var y=h},327:function(e,t,n){"use strict";var o=n(21),s=n(4),r=n(330);o({global:!0},{Reflect:{}}),r(s.Reflect,"Reflect",!0)},328:function(e,t,n){"use strict";function o(){return(o=Object.assign?Object.assign.bind():function(e){for(var t,n=1;n<arguments.length;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)}var s=["attrs","props","domProps"],r=["class","style","directives"],i=["on","nativeOn"],a=function(e,t){return function(){e&&e.apply(this,arguments),t&&t.apply(this,arguments)}};e.exports=function(e){return e.reduce((function(e,t){for(var n in t)if(e[n])if(-1!==s.indexOf(n))e[n]=o({},e[n],t[n]);else if(-1!==r.indexOf(n)){var u=e[n]instanceof Array?e[n]:[e[n]],c=t[n]instanceof Array?t[n]:[t[n]];e[n]=[].concat(u,c)}else if(-1!==i.indexOf(n))for(var l in t[n])if(e[n][l]){var f=e[n][l]instanceof Array?e[n][l]:[e[n][l]],d=t[n][l]instanceof Array?t[n][l]:[t[n][l]];e[n][l]=[].concat(f,d)}else e[n][l]=t[n][l];else if("hook"===n)for(var p in t[n])e[n][p]=e[n][p]?a(e[n][p],t[n][p]):t[n][p];else e[n]=t[n];else e[n]=t[n];return e}),{})}},330:function(e,t,n){"use strict";var o=n(17).f,s=n(13),r=n(26)("toStringTag");e.exports=function(e,t,n){e&&!n&&(e=e.prototype),e&&!s(e,r)&&o(e,r,{configurable:!0,value:t})}},492:function(e,t,n){},591:function(e,t,n){"use strict";n(492)},756:function(e,t,n){"use strict";n.r(t);n(16);var o=n(0),s=n(326),r=n(325),i=Object(o.defineComponent)({components:{RecoIcon:s.b},setup(e,t){const n=Object(r.a)(),s=Object(o.reactive)({query:"",focused:!1,focusIndex:0,placeholder:void 0}),i=Object(o.computed)(()=>s.focused&&u.value&&u.value.length),a=e=>{for(const t in n.$site.locales||{})if("/"!==t&&0===e.path.indexOf(t))return t;return"/"},u=Object(o.computed)(()=>{const e=s.query.trim().toLowerCase();if(!e)return;const{pages:t}=n.$site,o=n.$site.themeConfig.searchMaxSuggestions,r=n.$localePath,i=t=>t&&t.title&&t.title.toLowerCase().indexOf(e)>-1,u=[];for(let e=0;e<t.length&&!(u.length>=o);e++){const n=t[e];if(a(n)===r)if(i(n))u.push(n);else if(n.headers)for(let e=0;e<n.headers.length&&!(u.length>=o);e++){const t=n.headers[e];i(t)&&u.push(Object.assign({},n,{path:n.path+"#"+t.slug,header:t}))}}return u}),c=Object(o.computed)(()=>(n.$site.themeConfig.nav||[]).length+(n.$site.repo?1:0)<=2);return{showSuggestions:i,suggestions:u,alignRight:c,onUp:()=>{i.value&&(s.focusIndex>0?s.focusIndex--:s.focusIndex=u.value.length-1)},onDown:()=>{i.value&&(s.focusIndex<u.value.length-1?s.focusIndex++:s.focusIndex=0)},focus:e=>{s.focusIndex=e},unfocus:()=>{s.focusIndex=-1},go:e=>{i.value&&(n.$router.push(u.value[e].path),s.query="",s.focusIndex=0)},...Object(o.toRefs)(s)}},mounted(){this.placeholder=this.$site.themeConfig.searchPlaceholder||""}}),a=(n(591),n(2)),u=Object(a.a)(i,(function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{staticClass:"search-box"},[t("reco-icon",{attrs:{icon:"reco-search"}}),e._v(" "),t("input",{ref:"input",class:{focused:e.focused},attrs:{"aria-label":"Search",placeholder:e.placeholder,autocomplete:"off",spellcheck:"false"},domProps:{value:e.query},on:{input:function(t){e.query=t.target.value},focus:function(t){e.focused=!0},blur:function(t){e.focused=!1},keyup:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.go(e.focusIndex)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"up",38,t.key,["Up","ArrowUp"])?null:e.onUp.apply(null,arguments)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"down",40,t.key,["Down","ArrowDown"])?null:e.onDown.apply(null,arguments)}]}}),e._v(" "),e.showSuggestions?t("ul",{staticClass:"suggestions",class:{"align-right":e.alignRight},on:{mouseleave:e.unfocus}},e._l(e.suggestions,(function(n,o){return t("li",{key:o,staticClass:"suggestion",class:{focused:o===e.focusIndex},on:{mousedown:function(t){return e.go(o)},mouseenter:function(t){return e.focus(o)}}},[t("a",{attrs:{href:n.path},on:{click:function(e){e.preventDefault()}}},[t("span",{staticClass:"page-title"},[e._v(e._s(n.title||n.path))]),e._v(" "),n.header?t("span",{staticClass:"header"},[e._v("> "+e._s(n.header.title))]):e._e()])])})),0):e._e()],1)}),[],!1,null,null,null);t.default=u.exports}}]);