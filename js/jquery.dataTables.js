/*! DataTables 1.10.3
 * Â©2008-2014 SpryMedia Ltd - datatables.net/license
 */
(function(Da,P,l){var O=function(h){function V(a){var b,c,d={};h.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=e.replace(b[0],b[2].toLowerCase()),d[c]=e,"o"===b[1]&&V(a[e])});a._hungarianMap=d}function G(a,b,c){a._hungarianMap||V(a);var d;h.each(b,function(e){d=a._hungarianMap[e];if(d!==l&&(c||b[d]===l))"o"===d.charAt(0)?(b[d]||(b[d]={}),h.extend(!0,b[d],b[e]),G(a[d],b[d],c)):b[d]=b[e]})}function O(a){var b=p.defaults.oLanguage,c=a.sZeroRecords;
!a.sEmptyTable&&(c&&"No data available in table"===b.sEmptyTable)&&D(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(c&&"Loading..."===b.sLoadingRecords)&&D(a,a,"sZeroRecords","sLoadingRecords");a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&db(a)}function eb(a){z(a,"ordering","bSort");z(a,"orderMulti","bSortMulti");z(a,"orderClasses","bSortClasses");z(a,"orderCellsTop","bSortCellsTop");z(a,"order","aaSorting");z(a,"orderFixed","aaSortingFixed");z(a,"paging","bPaginate");
z(a,"pagingType","sPaginationType");z(a,"pageLength","iDisplayLength");z(a,"searching","bFilter");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&G(p.models.oSearch,a[b])}function fb(a){z(a,"orderable","bSortable");z(a,"orderData","aDataSort");z(a,"orderSequence","asSorting");z(a,"orderDataType","sortDataType")}function gb(a){var a=a.oBrowser,b=h("<div/>").css({position:"absolute",top:0,left:0,height:1,width:1,overflow:"hidden"}).append(h("<div/>").css({position:"absolute",top:1,left:1,width:100,
overflow:"scroll"}).append(h('<div class="test"/>').css({width:"100%",height:10}))).appendTo("body"),c=b.find(".test");a.bScrollOversize=100===c[0].offsetWidth;a.bScrollbarLeft=1!==c.offset().left;b.remove()}function hb(a,b,c,d,e,f){var g,i=!1;c!==l&&(g=c,i=!0);for(;d!==e;)a.hasOwnProperty(d)&&(g=i?b(g,a[d],d,a):a[d],i=!0,d+=f);return g}function Ea(a,b){var c=p.defaults.column,d=a.aoColumns.length,c=h.extend({},p.models.oColumn,c,{nTh:b?b:P.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:
"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=h.extend({},p.models.oSearch,c[d]);ia(a,d,null)}function ia(a,b,c){var b=a.aoColumns[b],d=a.oClasses,e=h(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=e.attr("width")||null;var f=(e.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==l&&null!==c&&(fb(c),G(p.defaults.column,c),c.mDataProp!==l&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&
!c.sClass&&(c.sClass=c.className),h.extend(b,c),D(b,c,"sWidth","sWidthOrig"),"number"===typeof c.iDataSort&&(b.aDataSort=[c.iDataSort]),D(b,c,"aDataSort"));var g=b.mData,i=W(g),j=b.mRender?W(b.mRender):null,c=function(a){return"string"===typeof a&&-1!==a.indexOf("@")};b._bAttrSrc=h.isPlainObject(g)&&(c(g.sort)||c(g.type)||c(g.filter));b.fnGetData=function(a,b,c){var d=i(a,b,l,c);return j&&b?j(d,b,a,c):d};b.fnSetData=function(a,b,c){return Q(g)(a,b,c)};"number"!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||
(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==h.inArray("asc",b.asSorting);c=-1!==h.inArray("desc",b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=d.sSortableNone,b.sSortingClassJUI=""):a&&!c?(b.sSortingClass=d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI)}function X(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Fa(a);for(var c=0,d=b.length;c<
d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&Y(a);u(a,null,"column-sizing",[a])}function ja(a,b){var c=Z(a,"bVisible");return"number"===typeof c[b]?c[b]:null}function $(a,b){var c=Z(a,"bVisible"),c=h.inArray(b,c);return-1!==c?c:null}function aa(a){return Z(a,"bVisible").length}function Z(a,b){var c=[];h.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Ga(a){var b=a.aoColumns,c=a.aoData,d=p.ext.type.detect,e,f,g,i,j,h,m,o,k;e=0;for(f=b.length;e<f;e++)if(m=
b[e],k=[],!m.sType&&m._sManualType)m.sType=m._sManualType;else if(!m.sType){g=0;for(i=d.length;g<i;g++){j=0;for(h=c.length;j<h&&!(k[j]===l&&(k[j]=w(a,j,e,"type")),o=d[g](k[j],a),!o||"html"===o);j++);if(o){m.sType=o;break}}m.sType||(m.sType="string")}}function ib(a,b,c,d){var e,f,g,i,j,n,m=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){n=b[e];var o=n.targets!==l?n.targets:n.aTargets;h.isArray(o)||(o=[o]);f=0;for(g=o.length;f<g;f++)if("number"===typeof o[f]&&0<=o[f]){for(;m.length<=o[f];)Ea(a);d(o[f],
n)}else if("number"===typeof o[f]&&0>o[f])d(m.length+o[f],n);else if("string"===typeof o[f]){i=0;for(j=m.length;i<j;i++)("_all"==o[f]||h(m[i].nTh).hasClass(o[f]))&&d(i,n)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function I(a,b,c,d){var e=a.aoData.length,f=h.extend(!0,{},p.models.oRow,{src:c?"dom":"data"});f._aData=b;a.aoData.push(f);for(var b=a.aoColumns,f=0,g=b.length;f<g;f++)c&&Ha(a,e,f,w(a,e,f)),b[f].sType=null;a.aiDisplayMaster.push(e);(c||!a.oFeatures.bDeferRender)&&Ia(a,e,c,d);return e}
function ka(a,b){var c;b instanceof h||(b=h(b));return b.map(function(b,e){c=la(a,e);return I(a,c.data,e,c.cells)})}function w(a,b,c,d){var e=a.iDraw,f=a.aoColumns[c],g=a.aoData[b]._aData,i=f.sDefaultContent,c=f.fnGetData(g,d,{settings:a,row:b,col:c});if(c===l)return a.iDrawError!=e&&null===i&&(R(a,0,"Requested unknown parameter "+("function"==typeof f.mData?"{function}":"'"+f.mData+"'")+" for row "+b,4),a.iDrawError=e),i;if((c===g||null===c)&&null!==i)c=i;else if("function"===typeof c)return c.call(g);
return null===c&&"display"==d?"":c}function Ha(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d,{settings:a,row:b,col:c})}function Ja(a){return h.map(a.match(/(\\.|[^\.])+/g),function(a){return a.replace(/\\./g,".")})}function W(a){if(h.isPlainObject(a)){var b={};h.each(a,function(a,c){c&&(b[a]=W(c))});return function(a,c,f,g){var i=b[c]||b._;return i!==l?i(a,c,f,g):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f,g){return a(b,c,f,g)};if("string"===
typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var c=function(a,b,f){var g,i;if(""!==f){i=Ja(f);for(var j=0,h=i.length;j<h;j++){f=i[j].match(ba);g=i[j].match(S);if(f){i[j]=i[j].replace(ba,"");""!==i[j]&&(a=a[i[j]]);g=[];i.splice(0,j+1);i=i.join(".");j=0;for(h=a.length;j<h;j++)g.push(c(a[j],b,i));a=f[0].substring(1,f[0].length-1);a=""===a?g:g.join(a);break}else if(g){i[j]=i[j].replace(S,"");a=a[i[j]]();continue}if(null===a||a[i[j]]===l)return l;a=a[i[j]]}}return a};return function(b,
e){return c(b,e,a)}}return function(b){return b[a]}}function Q(a){if(h.isPlainObject(a))return Q(a._);if(null===a)return function(){};if("function"===typeof a)return function(b,d,e){a(b,"set",d,e)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,d,e){var e=Ja(e),f;f=e[e.length-1];for(var g,i,j=0,h=e.length-1;j<h;j++){g=e[j].match(ba);i=e[j].match(S);if(g){e[j]=e[j].replace(ba,"");a[e[j]]=[];f=e.slice();f.splice(0,j+1);g=f.join(".");i=0;for(h=
d.length;i<h;i++)f={},b(f,d[i],g),a[e[j]].push(f);return}i&&(e[j]=e[j].replace(S,""),a=a[e[j]](d));if(null===a[e[j]]||a[e[j]]===l)a[e[j]]={};a=a[e[j]]}if(f.match(S))a[f.replace(S,"")](d);else a[f.replace(ba,"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ka(a){return C(a.aoData,"_aData")}function ma(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0}function na(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--; -1!=d&&c===l&&
a.splice(d,1)}function oa(a,b,c,d){var e=a.aoData[b],f;if("dom"===c||(!c||"auto"===c)&&"dom"===e.src)e._aData=la(a,e).data;else{var g=e.anCells,i;if(g){c=0;for(f=g.length;c<f;c++){for(i=g[c];i.childNodes.length;)i.removeChild(i.firstChild);g[c].innerHTML=w(a,b,c,"display")}}}e._aSortData=null;e._aFilterData=null;a=a.aoColumns;if(d!==l)a[d].sType=null;else{c=0;for(f=a.length;c<f;c++)a[c].sType=null}La(e)}function la(a,b){var c=[],d=b.firstChild,e,f,g=0,i,j=a.aoColumns,n=a._rowReadObject,m=n?{}:[],
o=function(a,b){if("string"===typeof a){var c=a.indexOf("@");-1!==c&&(c=a.substring(c+1),Q(a)(m,b.getAttribute(c)))}},k=function(a){f=j[g];i=h.trim(a.innerHTML);f&&f._bAttrSrc?(Q(f.mData._)(m,i),o(f.mData.sort,a),o(f.mData.type,a),o(f.mData.filter,a)):n?(f._setter||(f._setter=Q(f.mData)),f._setter(m,i)):m.push(i);g++};if(d)for(;d;){e=d.nodeName.toUpperCase();if("TD"==e||"TH"==e)k(d),c.push(d);d=d.nextSibling}else{c=b.anCells;d=0;for(e=c.length;d<e;d++)k(c[d])}return{data:m,cells:c}}function Ia(a,
b,c,d){var e=a.aoData[b],f=e._aData,g=[],i,j,h,m,o;if(null===e.nTr){i=c||P.createElement("tr");e.nTr=i;e.anCells=g;i._DT_RowIndex=b;La(e);m=0;for(o=a.aoColumns.length;m<o;m++){h=a.aoColumns[m];j=c?d[m]:P.createElement(h.sCellType);g.push(j);if(!c||h.mRender||h.mData!==m)j.innerHTML=w(a,b,m,"display");h.sClass&&(j.className+=" "+h.sClass);h.bVisible&&!c?i.appendChild(j):!h.bVisible&&c&&j.parentNode.removeChild(j);h.fnCreatedCell&&h.fnCreatedCell.call(a.oInstance,j,w(a,b,m),f,b,m)}u(a,"aoRowCreatedCallback",
null,[i,f,b])}e.nTr.setAttribute("role","row")}function La(a){var b=a.nTr,c=a._aData;if(b){c.DT_RowId&&(b.id=c.DT_RowId);if(c.DT_RowClass){var d=c.DT_RowClass.split(" ");a.__rowc=a.__rowc?Ma(a.__rowc.concat(d)):d;h(b).removeClass(a.__rowc.join(" ")).addClass(c.DT_RowClass)}c.DT_RowData&&h(b).data(c.DT_RowData)}}function jb(a){var b,c,d,e,f,g=a.nTHead,i=a.nTFoot,j=0===h("th, td",g).length,n=a.oClasses,m=a.aoColumns;j&&(e=h("<tr/>").appendTo(g));b=0;for(c=m.length;b<c;b++)f=m[b],d=h(f.nTh).addClass(f.sClass),
j&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),Na(a,f.nTh,b))),f.sTitle!=d.html()&&d.html(f.sTitle),Oa(a,"header")(a,d,f,n);j&&ca(a.aoHeader,g);h(g).find(">tr").attr("role","row");h(g).find(">tr>th, >tr>td").addClass(n.sHeaderTH);h(i).find(">tr>th, >tr>td").addClass(n.sFooterTH);if(null!==i){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=m[b],f.nTf=a[b].cell,f.sClass&&h(f.nTf).addClass(f.sClass)}}function da(a,
b,c){var d,e,f,g=[],i=[],j=a.aoColumns.length,n;if(b){c===l&&(c=!1);d=0;for(e=b.length;d<e;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=j-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);i.push([])}d=0;for(e=g.length;d<e;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(n=j=1,i[d][f]===l){a.appendChild(g[d][f].cell);for(i[d][f]=1;g[d+j]!==l&&g[d][f].cell==g[d+j][f].cell;)i[d+j][f]=1,j++;for(;g[d][f+n]!==l&&g[d][f].cell==g[d][f+n].cell;){for(c=0;c<
j;c++)i[d+c][f+n]=1;n++}h(g[d][f].cell).attr("rowspan",j).attr("colspan",n)}}}}function L(a){var b=u(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,b))B(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=d.length,f=a.oLanguage,g=a.iInitDisplayStart,i="ssp"==A(a),j=a.aiDisplay;a.bDrawing=!0;g!==l&&-1!==g&&(a._iDisplayStart=i?g:g>=a.fnRecordsDisplay()?0:g,a.iInitDisplayStart=-1);var g=a._iDisplayStart,n=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,B(a,!1);else if(i){if(!a.bDestroying&&
!kb(a))return}else a.iDraw++;if(0!==j.length){f=i?a.aoData.length:n;for(i=i?0:g;i<f;i++){var m=j[i],o=a.aoData[m];null===o.nTr&&Ia(a,m);m=o.nTr;if(0!==e){var k=d[c%e];o._sRowStripe!=k&&(h(m).removeClass(o._sRowStripe).addClass(k),o._sRowStripe=k)}u(a,"aoRowCallback",null,[m,o._aData,c,i]);b.push(m);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==A(a)?c=f.sLoadingRecords:f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=h("<tr/>",{"class":e?d[0]:""}).append(h("<td />",{valign:"top",colSpan:aa(a),
"class":a.oClasses.sRowEmpty}).html(c))[0];u(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Ka(a),g,n,j]);u(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],Ka(a),g,n,j]);d=h(a.nTBody);d.children().detach();d.append(h(b));u(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function M(a,b){var c=a.oFeatures,d=c.bFilter;c.bSort&&lb(a);d?ea(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;L(a);a._drawHold=
!1}function mb(a){var b=a.oClasses,c=h(a.nTable),c=h("<div/>").insertBefore(c),d=a.oFeatures,e=h("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(""),g,i,j,n,m,o,k=0;k<f.length;k++){g=null;i=f[k];if("<"==i){j=h("<div/>")[0];n=f[k+1];if("'"==n||'"'==n){m="";for(o=2;f[k+o]!=n;)m+=f[k+o],o++;"H"==m?m=b.sJUIHeader:"F"==m&&(m=b.sJUIFooter);-1!=m.indexOf(".")?(n=m.split("."),
j.id=n[0].substr(1,n[0].length-1),j.className=n[1]):"#"==m.charAt(0)?j.id=m.substr(1,m.length-1):j.className=m;k+=o}e.append(j);e=h(j)}else if(">"==i)e=e.parent();else if("l"==i&&d.bPaginate&&d.bLengthChange)g=nb(a);else if("f"==i&&d.bFilter)g=ob(a);else if("r"==i&&d.bProcessing)g=pb(a);else if("t"==i)g=qb(a);else if("i"==i&&d.bInfo)g=rb(a);else if("p"==i&&d.bPaginate)g=sb(a);else if(0!==p.ext.feature.length){j=p.ext.feature;o=0;for(n=j.length;o<n;o++)if(i==j[o].cFeature){g=j[o].fnInit(a);break}}g&&
(j=a.aanFeatures,j[i]||(j[i]=[]),j[i].push(g),e.append(g))}c.replaceWith(e)}function ca(a,b){var c=h(b).children("tr"),d,e,f,g,i,j,n,m,o,k;a.splice(0,a.length);f=0;for(j=c.length;f<j;f++)a.push([]);f=0;for(j=c.length;f<j;f++){d=c[f];for(e=d.firstChild;e;){if("TD"==e.nodeName.toUpperCase()||"TH"==e.nodeName.toUpperCase()){m=1*e.getAttribute("colspan");o=1*e.getAttribute("rowspan");m=!m||0===m||1===m?1:m;o=!o||0===o||1===o?1:o;g=0;for(i=a[f];i[g];)g++;n=g;k=1===m?!0:!1;for(i=0;i<m;i++)for(g=0;g<o;g++)a[f+
g][n+i]={cell:e,unique:k},a[f+g].nTr=d}e=e.nextSibling}}}function pa(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],ca(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function qa(a,b,c){u(a,"aoServerParams","serverParams",[b]);if(b&&h.isArray(b)){var d={},e=/(.*?)\[\]$/;h.each(b,function(a,b){var c=b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,g=a.ajax,i=a.oInstance;
if(h.isPlainObject(g)&&g.data){f=g.data;var j=h.isFunction(f)?f(b):f,b=h.isFunction(f)&&j?j:h.extend(!0,b,j);delete g.data}j={data:b,success:function(b){var d=b.error||b.sError;d&&a.oApi._fnLog(a,0,d);a.json=b;u(a,null,"xhr",[a,b]);c(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var d=a.oApi._fnLog;"parsererror"==c?d(a,0,"Invalid JSON response",1):4===b.readyState&&d(a,0,"Ajax error",7);B(a,!1)}};a.oAjaxData=b;u(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(i,a.sAjaxSource,
h.map(b,function(a,b){return{name:b,value:a}}),c,a):a.sAjaxSource||"string"===typeof g?a.jqXHR=h.ajax(h.extend(j,{url:g||a.sAjaxSource})):h.isFunction(g)?a.jqXHR=g.call(i,b,c,a):(a.jqXHR=h.ajax(h.extend(j,g)),g.data=f)}function kb(a){return a.bAjaxDataGet?(a.iDraw++,B(a,!0),qa(a,tb(a),function(b){ub(a,b)}),!1):!0}function tb(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,f=a.aoPreSearchCols,g,i=[],j,n,m,o=T(a);g=a._iDisplayStart;j=!1!==d.bPaginate?a._iDisplayLength:-1;var k=function(a,
b){i.push({name:a,value:b})};k("sEcho",a.iDraw);k("iColumns",c);k("sColumns",C(b,"sName").join(","));k("iDisplayStart",g);k("iDisplayLength",j);var l={draw:a.iDraw,columns:[],order:[],start:g,length:j,search:{value:e.sSearch,regex:e.bRegex}};for(g=0;g<c;g++)n=b[g],m=f[g],j="function"==typeof n.mData?"function":n.mData,l.columns.push({data:j,name:n.sName,searchable:n.bSearchable,orderable:n.bSortable,search:{value:m.sSearch,regex:m.bRegex}}),k("mDataProp_"+g,j),d.bFilter&&(k("sSearch_"+g,m.sSearch),
k("bRegex_"+g,m.bRegex),k("bSearchable_"+g,n.bSearchable)),d.bSort&&k("bSortable_"+g,n.bSortable);d.bFilter&&(k("sSearch",e.sSearch),k("bRegex",e.bRegex));d.bSort&&(h.each(o,function(a,b){l.order.push({column:b.col,dir:b.dir});k("iSortCol_"+a,b.col);k("sSortDir_"+a,b.dir)}),k("iSortingCols",o.length));b=p.ext.legacy.ajax;return null===b?a.sAjaxSource?i:l:b?i:l}function ub(a,b){var c=b.sEcho!==l?b.sEcho:b.draw,d=b.iTotalRecords!==l?b.iTotalRecords:b.recordsTotal,e=b.iTotalDisplayRecords!==l?b.iTotalDisplayRecords:
b.recordsFiltered;if(c){if(1*c<a.iDraw)return;a.iDraw=1*c}ma(a);a._iRecordsTotal=parseInt(d,10);a._iRecordsDisplay=parseInt(e,10);c=ra(a,b);d=0;for(e=c.length;d<e;d++)I(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;L(a);a._bInitComplete||sa(a,b);a.bAjaxDataGet=!0;B(a,!1)}function ra(a,b){var c=h.isPlainObject(a.ajax)&&a.ajax.dataSrc!==l?a.ajax.dataSrc:a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?W(c)(b):b}function ob(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,
f=a.aanFeatures,g='<input type="search" class="'+b.sFilterInput+'"/>',i=d.sSearch,i=i.match(/_INPUT_/)?i.replace("_INPUT_",g):i+g,b=h("<div/>",{id:!f.f?c+"_filter":null,"class":b.sFilter}).append(h("<label/>").append(i)),f=function(){var b=!this.value?"":this.value;b!=e.sSearch&&(ea(a,{sSearch:b,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive}),a._iDisplayStart=0,L(a))},g=null!==a.searchDelay?a.searchDelay:"ssp"===A(a)?400:0,j=h("input",b).val(e.sSearch).attr("placeholder",d.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT",
g?ta(f,g):f).bind("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",c);h(a.nTable).on("search.dt.DT",function(b,c){if(a===c)try{j[0]!==P.activeElement&&j.val(e.sSearch)}catch(d){}});return b[0]}function ea(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};Ga(a);if("ssp"!=A(a)){vb(a,b.sSearch,c,b.bEscapeRegex!==l?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);
f(b);for(b=0;b<e.length;b++)wb(a,e[b].sSearch,b,e[b].bEscapeRegex!==l?!e[b].bEscapeRegex:e[b].bRegex,e[b].bSmart,e[b].bCaseInsensitive);xb(a)}else f(b);a.bFiltered=!0;u(a,null,"search",[a])}function xb(a){for(var b=p.ext.search,c=a.aiDisplay,d,e,f=0,g=b.length;f<g;f++){for(var i=[],j=0,h=c.length;j<h;j++)e=c[j],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData,j)&&i.push(e);c.length=0;c.push.apply(c,i)}}function wb(a,b,c,d,e,f){if(""!==b)for(var g=a.aiDisplay,d=Pa(b,d,e,f),e=g.length-1;0<=e;e--)b=a.aoData[g[e]]._aFilterData[c],
d.test(b)||g.splice(e,1)}function vb(a,b,c,d,e,f){var d=Pa(b,d,e,f),e=a.oPreviousSearch.sSearch,f=a.aiDisplayMaster,g;0!==p.ext.search.length&&(c=!0);g=yb(a);if(0>=b.length)a.aiDisplay=f.slice();else{if(g||c||e.length>b.length||0!==b.indexOf(e)||a.bSorted)a.aiDisplay=f.slice();b=a.aiDisplay;for(c=b.length-1;0<=c;c--)d.test(a.aoData[b[c]]._sFilterRow)||b.splice(c,1)}}function Pa(a,b,c,d){a=b?a:Qa(a);c&&(a="^(?=.*?"+h.map(a.match(/"[^"]+"|[^ ]+/g)||"",function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),
a=b?b[1]:a;return a.replace('"',"")}).join(")(?=.*?")+").*$");return RegExp(a,d?"i":"")}function Qa(a){return a.replace(Xb,"\\$1")}function yb(a){var b=a.aoColumns,c,d,e,f,g,i,j,h,m=p.ext.type.search;c=!1;d=0;for(f=a.aoData.length;d<f;d++)if(h=a.aoData[d],!h._aFilterData){i=[];e=0;for(g=b.length;e<g;e++)c=b[e],c.bSearchable?(j=w(a,d,e,"filter"),m[c.sType]&&(j=m[c.sType](j)),null===j&&(j=""),"string"!==typeof j&&j.toString&&(j=j.toString())):j="",j.indexOf&&-1!==j.indexOf("&")&&(ua.innerHTML=j,j=Yb?
ua.textContent:ua.innerText),j.replace&&(j=j.replace(/[\r\n]/g,"")),i.push(j);h._aFilterData=i;h._sFilterRow=i.join("  ");c=!0}return c}function zb(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function Ab(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function rb(a){var b=a.sTableId,c=a.aanFeatures.i,d=h("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:Bb,sName:"information"}),
d.attr("role","status").attr("aria-live","polite"),h(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function Bb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),i=g?c.sInfo:c.sInfoEmpty;g!==f&&(i+=" "+c.sInfoFiltered);i+=c.sInfoPostFix;i=Cb(a,i);c=c.fnInfoCallback;null!==c&&(i=c.call(a.oInstance,a,d,e,f,g,i));h(b).html(i)}}function Cb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,
f=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,f)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(f/e)))}function va(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;if(a.bInitialised){mb(a);jb(a);da(a,a.aoHeader);da(a,a.aoFooter);B(a,!0);c.bAutoWidth&&Fa(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&
(f.nTh.style.width=s(f.sWidth));M(a);e=A(a);"ssp"!=e&&("ajax"==e?qa(a,[],function(c){var f=ra(a,c);for(b=0;b<f.length;b++)I(a,f[b]);a.iInitDisplayStart=d;M(a);B(a,!1);sa(a,c)},a):(B(a,!1),sa(a)))}else setTimeout(function(){va(a)},200)}function sa(a,b){a._bInitComplete=!0;b&&X(a);u(a,"aoInitComplete","init",[a,b])}function Ra(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Sa(a);u(a,null,"length",[a,c])}function nb(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=h.isArray(d[0]),f=e?d[0]:d,d=e?
d[1]:d,e=h("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),g=0,i=f.length;g<i;g++)e[0][g]=new Option(d[g],f[g]);var j=h("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(j[0].id=c+"_length");j.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));h("select",j).val(a._iDisplayLength).bind("change.DT",function(){Ra(a,h(this).val());L(a)});h(a.nTable).bind("length.dt.DT",function(b,c,d){a===c&&h("select",j).val(d)});return j[0]}function sb(a){var b=
a.sPaginationType,c=p.ext.pager[b],d="function"===typeof c,e=function(a){L(a)},b=h("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;d||c.fnInit(a,b,e);f.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,j=a._iDisplayLength,h=a.fnRecordsDisplay(),m=-1===j,b=m?0:Math.ceil(b/j),j=m?1:Math.ceil(h/j),h=c(b,j),o,m=0;for(o=f.p.length;m<o;m++)Oa(a,"pageButton")(a,f.p[m],m,h,b,j)}else c.fnUpdate(a,e)},sName:"pagination"}));return b}function Ta(a,
b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===e?d=0:"number"===typeof b?(d=b*e,d>f&&(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):"next"==b?d+e<f&&(d+=e):"last"==b?d=Math.floor((f-1)/e)*e:R(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(u(a,null,"page",[a]),c&&L(a));return b}function pb(a){return h("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}
function B(a,b){a.oFeatures.bProcessing&&h(a.aanFeatures.r).css("display",b?"block":"none");u(a,null,"processing",[a,b])}function qb(a){var b=h(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,g=b.children("caption"),i=g.length?g[0]._captionSide:null,j=h(b[0].cloneNode(!1)),n=h(b[0].cloneNode(!1)),m=b.children("tfoot");c.sX&&"100%"===b.attr("width")&&b.removeAttr("width");m.length||(m=null);c=h("<div/>",{"class":f.sScrollWrapper}).append(h("<div/>",
{"class":f.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?!d?null:s(d):"100%"}).append(h("<div/>",{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(j.removeAttr("id").css("margin-left",0).append(b.children("thead")))).append("top"===i?g:null)).append(h("<div/>",{"class":f.sScrollBody}).css({overflow:"auto",height:!e?null:s(e),width:!d?null:s(d)}).append(b));m&&c.append(h("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",
border:0,width:d?!d?null:s(d):"100%"}).append(h("<div/>",{"class":f.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",0).append(b.children("tfoot")))).append("bottom"===i?g:null));var b=c.children(),o=b[0],f=b[1],k=m?b[2]:null;d&&h(f).scroll(function(){var a=this.scrollLeft;o.scrollLeft=a;m&&(k.scrollLeft=a)});a.nScrollHead=o;a.nScrollBody=f;a.nScrollFoot=k;a.aoDrawCallback.push({fn:Y,sName:"scrolling"});return c[0]}function Y(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,f=b.iBarWidth,
g=h(a.nScrollHead),i=g[0].style,j=g.children("div"),n=j[0].style,m=j.children("table"),j=a.nScrollBody,o=h(j),k=j.style,l=h(a.nScrollFoot).children("div"),p=l.children("table"),r=h(a.nTHead),q=h(a.nTable),fa=q[0],N=fa.style,J=a.nTFoot?h(a.nTFoot):null,t=a.oBrowser,u=t.bScrollOversize,x,v,w,K,y,z=[],A=[],B=[],C,D=function(a){a=a.style;a.paddingTop="0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};q.children("thead, tfoot").remove();y=r.clone().prependTo(q);x=r.find("tr");
w=y.find("tr");y.find("th, td").removeAttr("tabindex");J&&(K=J.clone().prependTo(q),v=J.find("tr"),K=K.find("tr"));c||(k.width="100%",g[0].style.width="100%");h.each(pa(a,y),function(b,c){C=ja(a,b);c.style.width=a.aoColumns[C].sWidth});J&&F(function(a){a.style.width=""},K);b.bCollapse&&""!==e&&(k.height=o[0].offsetHeight+r[0].offsetHeight+"px");g=q.outerWidth();if(""===c){if(N.width="100%",u&&(q.find("tbody").height()>j.offsetHeight||"scroll"==o.css("overflow-y")))N.width=s(q.outerWidth()-f)}else""!==
d?N.width=s(d):g==o.width()&&o.height()<q.height()?(N.width=s(g-f),q.outerWidth()>g-f&&(N.width=s(g))):N.width=s(g);g=q.outerWidth();F(D,w);F(function(a){B.push(a.innerHTML);z.push(s(h(a).css("width")))},w);F(function(a,b){a.style.width=z[b]},x);h(w).height(0);J&&(F(D,K),F(function(a){A.push(s(h(a).css("width")))},K),F(function(a,b){a.style.width=A[b]},v),h(K).height(0));F(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+B[b]+"</div>";a.style.width=z[b]},
w);J&&F(function(a,b){a.innerHTML="";a.style.width=A[b]},K);if(q.outerWidth()<g){v=j.scrollHeight>j.offsetHeight||"scroll"==o.css("overflow-y")?g+f:g;if(u&&(j.scrollHeight>j.offsetHeight||"scroll"==o.css("overflow-y")))N.width=s(v-f);(""===c||""!==d)&&R(a,1,"Possible column misalignment",6)}else v="100%";k.width=s(v);i.width=s(v);J&&(a.nScrollFoot.style.width=s(v));!e&&u&&(k.height=s(fa.offsetHeight+f));e&&b.bCollapse&&(k.height=s(e),b=c&&fa.offsetWidth>j.offsetWidth?f:0,fa.offsetHeight<j.offsetHeight&&
(k.height=s(fa.offsetHeight+b)));b=q.outerWidth();m[0].style.width=s(b);n.width=s(b);m=q.height()>j.clientHeight||"scroll"==o.css("overflow-y");t="padding"+(t.bScrollbarLeft?"Left":"Right");n[t]=m?f+"px":"0px";J&&(p[0].style.width=s(b),l[0].style.width=s(b),l[0].style[t]=m?f+"px":"0px");o.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}function F(a,b,c){for(var d=0,e=0,f=b.length,g,i;e<f;){g=b[e].firstChild;for(i=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,i,d):a(g,d),d++),g=
g.nextSibling,i=c?i.nextSibling:null;e++}}function Fa(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,f=d.sX,g=d.sXInner,i=c.length,d=Z(a,"bVisible"),j=h("th",a.nTHead),n=b.getAttribute("width"),m=b.parentNode,o=!1,k,l;for(k=0;k<d.length;k++)l=c[d[k]],null!==l.sWidth&&(l.sWidth=Db(l.sWidthOrig,m),o=!0);if(!o&&!f&&!e&&i==aa(a)&&i==j.length)for(k=0;k<i;k++)c[k].sWidth=s(j.eq(k).width());else{i=h(b).clone().empty().css("visibility","hidden").removeAttr("id").append(h(a.nTHead).clone(!1)).append(h(a.nTFoot).clone(!1)).append(h("<tbody><tr/></tbody>"));
i.find("tfoot th, tfoot td").css("width","");var p=i.find("tbody tr"),j=pa(a,i.find("thead")[0]);for(k=0;k<d.length;k++)l=c[d[k]],j[k].style.width=null!==l.sWidthOrig&&""!==l.sWidthOrig?s(l.sWidthOrig):"";if(a.aoData.length)for(k=0;k<d.length;k++)o=d[k],l=c[o],h(Eb(a,o)).clone(!1).append(l.sContentPadding).appendTo(p);i.appendTo(m);f&&g?i.width(g):f?(i.css("width","auto"),i.width()<m.offsetWidth&&i.width(m.offsetWidth)):e?i.width(m.offsetWidth):n&&i.width(n);Fb(a,i[0]);if(f){for(k=g=0;k<d.length;k++)l=
c[d[k]],e=h(j[k]).outerWidth(),g+=null===l.sWidthOrig?e:parseInt(l.sWidth,10)+e-h(j[k]).width();i.width(s(g));b.style.width=s(g)}for(k=0;k<d.length;k++)if(l=c[d[k]],e=h(j[k]).width())l.sWidth=s(e);b.style.width=s(i.css("width"));i.remove()}n&&(b.style.width=s(n));if((n||f)&&!a._reszEvt)h(Da).bind("resize.DT-"+a.sInstance,ta(function(){X(a)})),a._reszEvt=!0}function ta(a,b){var c=b!==l?b:200,d,e;return function(){var b=this,g=+new Date,i=arguments;d&&g<d+c?(clearTimeout(e),e=setTimeout(function(){d=
l;a.apply(b,i)},c)):d?(d=g,a.apply(b,i)):d=g}}function Db(a,b){if(!a)return 0;var c=h("<div/>").css("width",s(a)).appendTo(b||P.body),d=c[0].offsetWidth;c.remove();return d}function Fb(a,b){var c=a.oScroll;if(c.sX||c.sY)c=!c.sX?c.iBarWidth:0,b.style.width=s(h(b).outerWidth()-c)}function Eb(a,b){var c=Gb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?h("<td/>").html(w(a,c,b,"display"))[0]:d.anCells[b]}function Gb(a,b){for(var c,d=-1,e=-1,f=0,g=a.aoData.length;f<g;f++)c=w(a,f,b,"display")+"",
c=c.replace(Zb,""),c.length>d&&(d=c.length,e=f);return e}function s(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function Hb(){if(!p.__scrollbarWidth){var a=h("<p/>").css({width:"100%",height:200,padding:0})[0],b=h("<div/>").css({position:"absolute",top:0,left:0,width:200,height:150,padding:0,overflow:"hidden",visibility:"hidden"}).append(a).appendTo("body"),c=a.offsetWidth;b.css("overflow","scroll");a=a.offsetWidth;c===a&&(a=b[0].clientWidth);b.remove();p.__scrollbarWidth=
c-a}return p.__scrollbarWidth}function T(a){var b,c,d=[],e=a.aoColumns,f,g,i,j;b=a.aaSortingFixed;c=h.isPlainObject(b);var n=[];f=function(a){a.length&&!h.isArray(a[0])?n.push(a):n.push.apply(n,a)};h.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<n.length;a++){j=n[a][0];f=e[j].aDataSort;b=0;for(c=f.length;b<c;b++)g=f[b],i=e[g].sType||"string",n[a]._idx===l&&(n[a]._idx=h.inArray(n[a][1],e[g].asSorting)),d.push({src:j,col:g,dir:n[a][1],index:n[a]._idx,type:i,formatter:p.ext.type.order[i+
"-pre"]})}return d}function lb(a){var b,c,d=[],e=p.ext.type.order,f=a.aoData,g=0,i,h=a.aiDisplayMaster,n;Ga(a);n=T(a);b=0;for(c=n.length;b<c;b++)i=n[b],i.formatter&&g++,Ib(a,i.col);if("ssp"!=A(a)&&0!==n.length){b=0;for(c=h.length;b<c;b++)d[h[b]]=b;g===n.length?h.sort(function(a,b){var c,e,g,i,h=n.length,j=f[a]._aSortData,l=f[b]._aSortData;for(g=0;g<h;g++)if(i=n[g],c=j[i.col],e=l[i.col],c=c<e?-1:c>e?1:0,0!==c)return"asc"===i.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):h.sort(function(a,b){var c,
g,i,h,j=n.length,l=f[a]._aSortData,p=f[b]._aSortData;for(i=0;i<j;i++)if(h=n[i],c=l[h.col],g=p[h.col],h=e[h.type+"-"+h.dir]||e["string-"+h.dir],c=h(c,g),0!==c)return c;c=d[a];g=d[b];return c<g?-1:c>g?1:0})}a.bSorted=!0}function Jb(a){for(var b,c,d=a.aoColumns,e=T(a),a=a.oLanguage.oAria,f=0,g=d.length;f<g;f++){c=d[f];var i=c.asSorting;b=c.sTitle.replace(/<.*?>/g,"");var h=c.nTh;h.removeAttribute("aria-sort");c.bSortable&&(0<e.length&&e[0].col==f?(h.setAttribute("aria-sort","asc"==e[0].dir?"ascending":
"descending"),c=i[e[0].index+1]||i[0]):c=i[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);h.setAttribute("aria-label",b)}}function Ua(a,b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,g=function(a,b){var c=a._idx;c===l&&(c=h.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};"number"===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=h.inArray(b,C(e,"0")),-1!==c?(b=g(e[c],!0),null===b?e.splice(c,1):(e[c][1]=f[b],e[c]._idx=b)):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&
e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);M(a);"function"==typeof d&&d(a)}function Na(a,b,c,d){var e=a.aoColumns[c];Va(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(B(a,!0),setTimeout(function(){Ua(a,c,b.shiftKey,d);"ssp"!==A(a)&&B(a,!1)},0)):Ua(a,c,b.shiftKey,d))})}function wa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=T(a),e=a.oFeatures,f,g;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)g=b[e].src,h(C(a.aoData,
"anCells",g)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)g=d[e].src,h(C(a.aoData,"anCells",g)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function Ib(a,b){var c=a.aoColumns[b],d=p.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,$(a,b)));for(var f,g=p.ext.type.order[c.sType+"-pre"],i=0,h=a.aoData.length;i<h;i++)if(c=a.aoData[i],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[i]:w(a,i,b,"sort"),c._aSortData[b]=g?g(f):f}function xa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b=
{time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:h.extend(!0,[],a.aaSorting),search:zb(a.oPreviousSearch),columns:h.map(a.aoColumns,function(b,d){return{visible:b.bVisible,search:zb(a.aoPreSearchCols[d])}})};u(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,a,b)}}function Kb(a){var b,c,d=a.aoColumns;if(a.oFeatures.bStateSave){var e=a.fnStateLoadCallback.call(a.oInstance,a);if(e&&e.time&&(b=u(a,"aoStateLoadParams","stateLoadParams",
[a,e]),-1===h.inArray(!1,b)&&(b=a.iStateDuration,!(0<b&&e.time<+new Date-1E3*b)&&d.length===e.columns.length))){a.oLoadedState=h.extend(!0,{},e);a._iDisplayStart=e.start;a.iInitDisplayStart=e.start;a._iDisplayLength=e.length;a.aaSorting=[];h.each(e.order,function(b,c){a.aaSorting.push(c[0]>=d.length?[0,c[1]]:c)});h.extend(a.oPreviousSearch,Ab(e.search));b=0;for(c=e.columns.length;b<c;b++){var f=e.columns[b];d[b].bVisible=f.visible;h.extend(a.aoPreSearchCols[b],Ab(f.search))}u(a,"aoStateLoaded","stateLoaded",
[a,e])}}}function ya(a){var b=p.settings,a=h.inArray(a,C(b,"nTable"));return-1!==a?b[a]:null}function R(a,b,c,d){c="DataTables warning: "+(null!==a?"table id="+a.sTableId+" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+d);if(b)Da.console&&console.log&&console.log(c);else if(a=p.ext,"alert"==(a.sErrMode||a.errMode))alert(c);else throw Error(c);}function D(a,b,c,d){h.isArray(c)?h.each(c,function(c,d){h.isArray(d)?D(a,b,d[0],d[1]):D(a,b,d)}):(d===l&&
(d=c),b[c]!==l&&(a[d]=b[c]))}function Lb(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],h.isPlainObject(d)?(h.isPlainObject(a[e])||(a[e]={}),h.extend(!0,a[e],d)):a[e]=c&&"data"!==e&&"aaData"!==e&&h.isArray(d)?d.slice():d);return a}function Va(a,b,c){h(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===a.which&&(a.preventDefault(),c(a))}).bind("selectstart.DT",function(){return!1})}function y(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function u(a,b,c,d){var e=
[];b&&(e=h.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&h(a.nTable).trigger(c+".dt",d);return e}function Sa(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);if(-1===d||0>b)b=0;a._iDisplayStart=b}function Oa(a,b){var c=a.renderer,d=p.ext.renderer[b];return h.isPlainObject(c)&&c[b]?d[c[b]]||d._:"string"===typeof c?d[c]||d._:d._}function A(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function Wa(a,b){var c=
[],c=Mb.numbers_length,d=Math.floor(c/2);b<=c?c=U(0,b):a<=d?(c=U(0,c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-d?c=U(b-(c-2),b):(c=U(a-1,a+2),c.push("ellipsis"),c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function db(a){h.each({num:function(b){return za(b,a)},"num-fmt":function(b){return za(b,a,Xa)},"html-num":function(b){return za(b,a,Aa)},"html-num-fmt":function(b){return za(b,a,Aa,Xa)}},function(b,c){v.type.order[b+a+"-pre"]=c})}function Nb(a){return function(){var b=
[ya(this[p.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return p.ext.internal[a].apply(this,b)}}var p,v,q,r,t,Ya={},Ob=/[\r\n]/g,Aa=/<.*?>/g,$b=/^[\w\+\-]/,ac=/[\w\+\-]$/,Xb=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),Xa=/[',$\u00a3\u20ac\u00a5%\u2009\u202F]/g,H=function(a){return!a||!0===a||"-"===a?!0:!1},Pb=function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Qb=function(a,b){Ya[b]||(Ya[b]=RegExp(Qa(b),"g"));return"string"===
typeof a&&"."!==b?a.replace(/\./g,"").replace(Ya[b],"."):a},Za=function(a,b,c){var d="string"===typeof a;b&&d&&(a=Qb(a,b));c&&d&&(a=a.replace(Xa,""));return H(a)||!isNaN(parseFloat(a))&&isFinite(a)},Rb=function(a,b,c){return H(a)?!0:!(H(a)||"string"===typeof a)?null:Za(a.replace(Aa,""),b,c)?!0:null},C=function(a,b,c){var d=[],e=0,f=a.length;if(c!==l)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<f;e++)a[e]&&d.push(a[e][b]);return d},ga=function(a,b,c,d){var e=[],f=0,g=b.length;if(d!==
l)for(;f<g;f++)e.push(a[b[f]][c][d]);else for(;f<g;f++)e.push(a[b[f]][c]);return e},U=function(a,b){var c=[],d;b===l?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Ma=function(a){var b=[],c,d,e=a.length,f,g=0;d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<g;f++)if(b[f]===c)continue a;b.push(c);g++}return b},z=function(a,b,c){a[b]!==l&&(a[c]=a[b])},ba=/\[.*?\]$/,S=/\(\)$/,ua=h("<div>")[0],Yb=ua.textContent!==l,Zb=/<.*?>/g;p=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,
b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new q(ya(this[v.iApiIndex])):new q(this)};this.fnAddData=function(a,b){var c=this.api(!0),d=h.isArray(a)&&(h.isArray(a[0])||h.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===l||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===l||a?b.draw(!1):(""!==d.sX||""!==d.sY)&&Y(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();
(a===l||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],h=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,h);(c===l||c)&&d.draw();return h};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(!a)};this.fnFilter=function(a,b,c,d,e,h){e=this.api(!0);null===b||b===l?e.search(a,c,d,h):e.column(b).search(a,c,d,h);e.draw()};this.fnGetData=function(a,b){var c=
this.api(!0);if(a!==l){var d=a.nodeName?a.nodeName.toLowerCase():"";return b!==l||"td"==d||"th"==d?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==l?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return"TR"==c?b.row(a).index():"TD"==c||"TH"==c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};
this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===l||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===l||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ya(this[v.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var h=
this.api(!0);c===l||null===c?h.row(b).data(a):h.cell(b,c).data(a);(e===l||e)&&h.columns.adjust();(d===l||d)&&h.draw();return 0};this.fnVersionCheck=v.fnVersionCheck;var b=this,c=a===l,d=this.length;c&&(a={});this.oApi=this.internal=v.internal;for(var e in p.ext.internal)e&&(this[e]=Nb(e));this.each(function(){var e={},g=1<d?Lb(e,a,!0):a,i=0,j,n=this.getAttribute("id"),e=!1,m=p.defaults;if("table"!=this.nodeName.toLowerCase())R(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{eb(m);
fb(m.column);G(m,m,!0);G(m.column,m.column,!0);G(m,g);var o=p.settings,i=0;for(j=o.length;i<j;i++){if(o[i].nTable==this){j=g.bRetrieve!==l?g.bRetrieve:m.bRetrieve;if(c||j)return o[i].oInstance;if(g.bDestroy!==l?g.bDestroy:m.bDestroy){o[i].oInstance.fnDestroy();break}else{R(o[i],0,"Cannot reinitialise DataTable",3);return}}if(o[i].sTableId==this.id){o.splice(i,1);break}}if(null===n||""===n)this.id=n="DataTables_Table_"+p.ext._unique++;var k=h.extend(!0,{},p.models.oSettings,{nTable:this,oApi:b.internal,
oInit:g,sDestroyWidth:h(this)[0].style.width,sInstance:n,sTableId:n});o.push(k);k.oInstance=1===b.length?b:h(this).dataTable();eb(g);g.oLanguage&&O(g.oLanguage);g.aLengthMenu&&!g.iDisplayLength&&(g.iDisplayLength=h.isArray(g.aLengthMenu[0])?g.aLengthMenu[0][0]:g.aLengthMenu[0]);g=Lb(h.extend(!0,{},m),g);D(k.oFeatures,g,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));D(k,g,["asStripeClasses","ajax","fnServerData","fnFormatNumber",
"sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"],["bJQueryUI","bJUI"]]);D(k.oScroll,g,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);
D(k.oLanguage,g,"fnInfoCallback");y(k,"aoDrawCallback",g.fnDrawCallback,"user");y(k,"aoServerParams",g.fnServerParams,"user");y(k,"aoStateSaveParams",g.fnStateSaveParams,"user");y(k,"aoStateLoadParams",g.fnStateLoadParams,"user");y(k,"aoStateLoaded",g.fnStateLoaded,"user");y(k,"aoRowCallback",g.fnRowCallback,"user");y(k,"aoRowCreatedCallback",g.fnCreatedRow,"user");y(k,"aoHeaderCallback",g.fnHeaderCallback,"user");y(k,"aoFooterCallback",g.fnFooterCallback,"user");y(k,"aoInitComplete",g.fnInitComplete,
"user");y(k,"aoPreDrawCallback",g.fnPreDrawCallback,"user");n=k.oClasses;g.bJQueryUI?(h.extend(n,p.ext.oJUIClasses,g.oClasses),g.sDom===m.sDom&&"lfrtip"===m.sDom&&(k.sDom='<"H"lfr>t<"F"ip>'),k.renderer)?h.isPlainObject(k.renderer)&&!k.renderer.header&&(k.renderer.header="jqueryui"):k.renderer="jqueryui":h.extend(n,p.ext.classes,g.oClasses);h(this).addClass(n.sTable);if(""!==k.oScroll.sX||""!==k.oScroll.sY)k.oScroll.iBarWidth=Hb();!0===k.oScroll.sX&&(k.oScroll.sX="100%");k.iInitDisplayStart===l&&(k.iInitDisplayStart=
g.iDisplayStart,k._iDisplayStart=g.iDisplayStart);null!==g.iDeferLoading&&(k.bDeferLoading=!0,i=h.isArray(g.iDeferLoading),k._iRecordsDisplay=i?g.iDeferLoading[0]:g.iDeferLoading,k._iRecordsTotal=i?g.iDeferLoading[1]:g.iDeferLoading);""!==g.oLanguage.sUrl?(k.oLanguage.sUrl=g.oLanguage.sUrl,h.getJSON(k.oLanguage.sUrl,null,function(a){O(a);G(m.oLanguage,a);h.extend(true,k.oLanguage,g.oLanguage,a);va(k)}),e=!0):h.extend(!0,k.oLanguage,g.oLanguage);null===g.asStripeClasses&&(k.asStripeClasses=[n.sStripeOdd,
n.sStripeEven]);var i=k.asStripeClasses,r=h("tbody tr:eq(0)",this);-1!==h.inArray(!0,h.map(i,function(a){return r.hasClass(a)}))&&(h("tbody tr",this).removeClass(i.join(" ")),k.asDestroyStripes=i.slice());var o=[],q,i=this.getElementsByTagName("thead");0!==i.length&&(ca(k.aoHeader,i[0]),o=pa(k));if(null===g.aoColumns){q=[];i=0;for(j=o.length;i<j;i++)q.push(null)}else q=g.aoColumns;i=0;for(j=q.length;i<j;i++)Ea(k,o?o[i]:null);ib(k,g.aoColumnDefs,q,function(a,b){ia(k,a,b)});if(r.length){var s=function(a,
b){return a.getAttribute("data-"+b)?b:null};h.each(la(k,r[0]).cells,function(a,b){var c=k.aoColumns[a];if(c.mData===a){var d=s(b,"sort")||s(b,"order"),e=s(b,"filter")||s(b,"search");if(d!==null||e!==null){c.mData={_:a+".display",sort:d!==null?a+".@data-"+d:l,type:d!==null?a+".@data-"+d:l,filter:e!==null?a+".@data-"+e:l};ia(k,a)}}})}var t=k.oFeatures;g.bStateSave&&(t.bStateSave=!0,Kb(k,g),y(k,"aoDrawCallback",xa,"state_save"));if(g.aaSorting===l){o=k.aaSorting;i=0;for(j=o.length;i<j;i++)o[i][1]=k.aoColumns[i].asSorting[0]}wa(k);
t.bSort&&y(k,"aoDrawCallback",function(){if(k.bSorted){var a=T(k),b={};h.each(a,function(a,c){b[c.src]=c.dir});u(k,null,"order",[k,a,b]);Jb(k)}});y(k,"aoDrawCallback",function(){(k.bSorted||A(k)==="ssp"||t.bDeferRender)&&wa(k)},"sc");gb(k);i=h(this).children("caption").each(function(){this._captionSide=h(this).css("caption-side")});j=h(this).children("thead");0===j.length&&(j=h("<thead/>").appendTo(this));k.nTHead=j[0];j=h(this).children("tbody");0===j.length&&(j=h("<tbody/>").appendTo(this));k.nTBody=
j[0];j=h(this).children("tfoot");if(0===j.length&&0<i.length&&(""!==k.oScroll.sX||""!==k.oScroll.sY))j=h("<tfoot/>").appendTo(this);0===j.length||0===j.children().length?h(this).addClass(n.sNoFooter):0<j.length&&(k.nTFoot=j[0],ca(k.aoFooter,k.nTFoot));if(g.aaData)for(i=0;i<g.aaData.length;i++)I(k,g.aaData[i]);else(k.bDeferLoading||"dom"==A(k))&&ka(k,h(k.nTBody).children("tr"));k.aiDisplay=k.aiDisplayMaster.slice();k.bInitialised=!0;!1===e&&va(k)}});b=null;return this};var Sb=[],x=Array.prototype,
bc=function(a){var b,c,d=p.settings,e=h.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=h.inArray(a,e),-1!==b?[d[b]]:null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=h(a):a instanceof h&&(c=a)}else return[];if(c)return c.map(function(){b=h.inArray(this,e);return-1!==b?d[b]:null}).toArray()};q=function(a,b){if(!this instanceof q)throw"DT API must be constructed as a new object";
var c=[],d=function(a){(a=bc(a))&&c.push.apply(c,a)};if(h.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=Ma(c);b&&this.push.apply(this,b.toArray?b.toArray():b);this.selector={rows:null,cols:null,opts:null};q.extend(this,this,Sb)};p.Api=q;q.prototype={concat:x.concat,context:[],each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new q(b[a],this[a]):null},filter:function(a){var b=[];
if(x.filter)b=x.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new q(this.context,b)},flatten:function(){var a=[];return new q(this.context,a.concat.apply(a,this.toArray()))},join:x.join,indexOf:x.indexOf||function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c){var d=[],e,f,g,h,j,n=this.context,m,o,k=this.selector;"string"===typeof a&&(c=b,b=a,a=!1);f=0;for(g=n.length;f<g;f++){var p=
new q(n[f]);if("table"===b)e=c.call(p,n[f],f),e!==l&&d.push(e);else if("columns"===b||"rows"===b)e=c.call(p,n[f],this[f],f),e!==l&&d.push(e);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){o=this[f];"column-rows"===b&&(m=Ba(n[f],k.opts));h=0;for(j=o.length;h<j;h++)e=o[h],e="cell"===b?c.call(p,n[f],e.row,e.column,f,h):c.call(p,n[f],e,f,h,m),e!==l&&d.push(e)}}return d.length?(a=new q(n,a?d.concat.apply([],d):d),b=a.selector,b.rows=k.rows,b.cols=k.cols,b.opts=k.opts,a):this},lastIndexOf:x.lastIndexOf||
function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(x.map)b=x.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new q(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:x.pop,push:x.push,reduce:x.reduce||function(a,b){return hb(this,a,b,0,this.length,1)},reduceRight:x.reduceRight||function(a,b){return hb(this,a,b,this.length-1,-1,-1)},reverse:x.reverse,selector:null,
shift:x.shift,sort:x.sort,splice:x.splice,toArray:function(){return x.slice.call(this)},to$:function(){return h(this)},toJQuery:function(){return h(this)},unique:function(){return new q(this.context,Ma(this))},unshift:x.unshift};q.extend=function(a,b,c){if(b&&(b instanceof q||b.__dt_wrapper)){var d,e,f,g=function(a,b,c){return function(){var d=b.apply(a,arguments);q.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<e;d++)f=c[d],b[f.name]="function"===typeof f.val?g(a,f.val,f):h.isPlainObject(f.val)?
{}:f.val,b[f.name].__dt_wrapper=!0,q.extend(a,b[f.name],f.propExt)}};q.register=r=function(a,b){if(h.isArray(a))for(var c=0,d=a.length;c<d;c++)q.register(a[c],b);else for(var e=a.split("."),f=Sb,g,i,c=0,d=e.length;c<d;c++){g=(i=-1!==e[c].indexOf("()"))?e[c].replace("()",""):e[c];var j;a:{j=0;for(var n=f.length;j<n;j++)if(f[j].name===g){j=f[j];break a}j=null}j||(j={name:g,val:{},methodExt:[],propExt:[]},f.push(j));c===d-1?j.val=b:f=i?j.methodExt:j.propExt}};q.registerPlural=t=function(a,b,c){q.register(a,
c);q.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof q?a.length?h.isArray(a[0])?new q(a.context,a[0]):a[0]:l:a})};r("tables()",function(a){var b;if(a){b=q;var c=this.context;if("number"===typeof a)a=[c[a]];else var d=h.map(c,function(a){return a.nTable}),a=h(d).filter(a).map(function(){var a=h.inArray(this,d);return c[a]}).toArray();b=new b(a)}else b=this;return b});r("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new q(b[0]):a});t("tables().nodes()",
"table().node()",function(){return this.iterator("table",function(a){return a.nTable})});t("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody})});t("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead})});t("tables().footer()","table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot})});t("tables().containers()","table().container()",function(){return this.iterator("table",
function(a){return a.nTableWrapper})});r("draw()",function(a){return this.iterator("table",function(b){M(b,!1===a)})});r("page()",function(a){return a===l?this.page.info().page:this.iterator("table",function(b){Ta(b,a)})});r("page.info()",function(){if(0===this.context.length)return l;var a=this.context[0],b=a._iDisplayStart,c=a._iDisplayLength,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),
recordsDisplay:d}});r("page.len()",function(a){return a===l?0!==this.context.length?this.context[0]._iDisplayLength:l:this.iterator("table",function(b){Ra(b,a)})});var Tb=function(a,b,c){"ssp"==A(a)?M(a,b):(B(a,!0),qa(a,[],function(c){ma(a);for(var c=ra(a,c),d=0,g=c.length;d<g;d++)I(a,c[d]);M(a,b);B(a,!1)}));if(c){var d=new q(a);d.one("draw",function(){c(d.ajax.json())})}};r("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});r("ajax.params()",function(){var a=this.context;
if(0<a.length)return a[0].oAjaxData});r("ajax.reload()",function(a,b){return this.iterator("table",function(c){Tb(c,!1===b,a)})});r("ajax.url()",function(a){var b=this.context;if(a===l){if(0===b.length)return l;b=b[0];return b.ajax?h.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){h.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});r("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Tb(c,!1===b,a)})});var $a=function(a,b){var c=
[],d,e,f,g,i,j;d=typeof a;if(!a||"string"===d||"function"===d||a.length===l)a=[a];f=0;for(g=a.length;f<g;f++){e=a[f]&&a[f].split?a[f].split(","):[a[f]];i=0;for(j=e.length;i<j;i++)(d=b("string"===typeof e[i]?h.trim(e[i]):e[i]))&&d.length&&c.push.apply(c,d)}return c},ab=function(a){a||(a={});a.filter&&!a.search&&(a.search=a.filter);return{search:a.search||"none",order:a.order||"current",page:a.page||"all"}},bb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a.length=1,a.context=
[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,d,e,f=[],g=a.aiDisplay;c=a.aiDisplayMaster;var i=b.search;d=b.order;e=b.page;if("ssp"==A(a))return"removed"===i?[]:U(0,c.length);if("current"==e){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(g[c])}else if("current"==d||"applied"==d)f="none"==i?c.slice():"applied"==i?g.slice():h.map(c,function(a){return-1===h.inArray(a,g)?a:null});else if("index"==d||"original"==d){c=0;for(d=a.aoData.length;c<d;c++)"none"==i?f.push(c):(e=h.inArray(c,
g),(-1===e&&"removed"==i||0<=e&&"applied"==i)&&f.push(c))}return f};r("rows()",function(a,b){a===l?a="":h.isPlainObject(a)&&(b=a,a="");var b=ab(b),c=this.iterator("table",function(c){var e=b;return $a(a,function(a){var b=Pb(a);if(b!==null&&!e)return[b];var i=Ba(c,e);if(b!==null&&h.inArray(b,i)!==-1)return[b];if(!a)return i;b=ga(c.aoData,i,"nTr");return typeof a==="function"?h.map(i,function(b){var e=c.aoData[b];return a(b,e._aData,e.nTr)?b:null}):a.nodeName&&h.inArray(a,b)!==-1?[a._DT_RowIndex]:h(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()})});
c.selector.rows=a;c.selector.opts=b;return c});r("rows().nodes()",function(){return this.iterator("row",function(a,b){return a.aoData[b].nTr||l})});r("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return ga(a.aoData,b,"_aData")})});t("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var d=b.aoData[c];return"search"===a?d._aFilterData:d._aSortData})});t("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,
c){oa(b,c,a)})});t("rows().indexes()","row().index()",function(){return this.iterator("row",function(a,b){return b})});t("rows().remove()","row().remove()",function(){var a=this;return this.iterator("row",function(b,c,d){var e=b.aoData;e.splice(c,1);for(var f=0,g=e.length;f<g;f++)null!==e[f].nTr&&(e[f].nTr._DT_RowIndex=f);h.inArray(c,b.aiDisplay);na(b.aiDisplayMaster,c);na(b.aiDisplay,c);na(a[d],c,!1);Sa(b)})});r("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,g,h=[];f=0;
for(g=a.length;f<g;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?h.push(ka(b,c)[0]):h.push(I(b,c));return h}),c=this.rows(-1);c.pop();c.push.apply(c,b.toArray());return c});r("row()",function(a,b){return bb(this.rows(a,b))});r("row().data()",function(a){var b=this.context;if(a===l)return b.length&&this.length?b[0].aoData[this[0]]._aData:l;b[0].aoData[this[0]]._aData=a;oa(b[0],this[0],"data");return this});r("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||
null:null});r("row.add()",function(a){a instanceof h&&a.length&&(a=a[0]);var b=this.iterator("table",function(b){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?ka(b,a)[0]:I(b,a)});return this.row(b[0])});var cb=function(a,b){var c=a.context;c.length&&(c=c[0].aoData[b!==l?b:a[0]],c._details&&(c._details.remove(),c._detailsShow=l,c._details=l))},Ub=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];if(d._details){(d._detailsShow=b)?d._details.insertAfter(d.nTr):d._details.detach();
var e=c[0],f=new q(e),g=e.aoData;f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");0<C(g,"_details").length&&(f.on("draw.dt.DT_details",function(a,b){e===b&&f.rows({page:"current"}).eq(0).each(function(a){a=g[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on("column-visibility.dt.DT_details",function(a,b){if(e===b)for(var c,d=aa(b),f=0,h=g.length;f<h;f++)c=g[f],c._details&&c._details.children("td[colspan]").attr("colspan",d)}),f.on("destroy.dt.DT_details",function(a,
b){if(e===b)for(var c=0,d=g.length;c<d;c++)g[c]._details&&cb(f,c)}))}}};r("row().child()",function(a,b){var c=this.context;if(a===l)return c.length&&this.length?c[0].aoData[this[0]]._details:l;if(!0===a)this.child.show();else if(!1===a)cb(this);else if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(a.nodeName&&"tr"===a.nodeName.toLowerCase())e.push(a);else{var c=h("<tr><td/></tr>").addClass(b);h("td",c).addClass(b).html(a)[0].colSpan=aa(d);e.push(c[0])}};if(h.isArray(a)||
a instanceof h)for(var g=0,i=a.length;g<i;g++)f(a[g],b);else f(a,b);c._details&&c._details.remove();c._details=h(e);c._detailsShow&&c._details.insertAfter(c.nTr)}return this});r(["row().child.show()","row().child().show()"],function(){Ub(this,!0);return this});r(["row().child.hide()","row().child().hide()"],function(){Ub(this,!1);return this});r(["row().child.remove()","row().child().remove()"],function(){cb(this);return this});r("row().child.isShown()",function(){var a=this.context;return a.length&&
this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var cc=/^(.+):(name|visIdx|visible)$/,Vb=function(a,b,c,d,e){for(var c=[],d=0,f=e.length;d<f;d++)c.push(w(a,e[d],b));return c};r("columns()",function(a,b){a===l?a="":h.isPlainObject(a)&&(b=a,a="");var b=ab(b),c=this.iterator("table",function(c){var e=a,f=b,g=c.aoColumns,i=C(g,"sName"),j=C(g,"nTh");return $a(e,function(a){var b=Pb(a);if(a==="")return U(g.length);if(b!==null)return[b>=0?b:g.length+b];if(typeof a==="function"){var e=Ba(c,f);return h.map(g,
function(b,f){return a(f,Vb(c,f,0,0,e),j[f])?f:null})}var k=typeof a==="string"?a.match(cc):"";if(k)switch(k[2]){case "visIdx":case "visible":b=parseInt(k[1],10);if(b<0){var l=h.map(g,function(a,b){return a.bVisible?b:null});return[l[l.length+b]]}return[ja(c,b)];case "name":return h.map(i,function(a,b){return a===k[1]?b:null})}else return h(j).filter(a).map(function(){return h.inArray(this,j)}).toArray()})});c.selector.cols=a;c.selector.opts=b;return c});t("columns().header()","column().header()",
function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh})});t("columns().footer()","column().footer()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTf})});t("columns().data()","column().data()",function(){return this.iterator("column-rows",Vb)});t("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData})});t("columns().cache()","column().cache()",function(a){return this.iterator("column-rows",
function(b,c,d,e,f){return ga(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)})});t("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,e){return ga(a.aoData,e,"anCells",b)})});t("columns().visible()","column().visible()",function(a,b){return this.iterator("column",function(c,d){var e;if(a===l)e=c.aoColumns[d].bVisible;else{var f=c.aoColumns;e=f[d];var g=c.aoData,i,j,n;if(a===l)e=e.bVisible;else{if(e.bVisible!==a){if(a){var m=h.inArray(!0,C(f,
"bVisible"),d+1);i=0;for(j=g.length;i<j;i++)n=g[i].nTr,f=g[i].anCells,n&&n.insertBefore(f[d],f[m]||null)}else h(C(c.aoData,"anCells",d)).detach();e.bVisible=a;da(c,c.aoHeader);da(c,c.aoFooter);if(b===l||b)X(c),(c.oScroll.sX||c.oScroll.sY)&&Y(c);u(c,null,"column-visibility",[c,d,a]);xa(c)}e=void 0}}return e})});t("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?$(b,c):c})});r("columns.adjust()",function(){return this.iterator("table",
function(a){X(a)})});r("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return ja(c,b);if("fromData"===a||"toVisible"===a)return $(c,b)}});r("column()",function(a,b){return bb(this.columns(a,b))});r("cells()",function(a,b,c){h.isPlainObject(a)&&(typeof a.row!==l?(c=b,b=null):(c=a,a=null));h.isPlainObject(b)&&(c=b,b=null);if(null===b||b===l)return this.iterator("table",function(b){var d=a,e=ab(c),f=b.aoData,g=Ba(b,e),e=ga(f,g,"anCells"),
i=h([].concat.apply([],e)),j,m=b.aoColumns.length,n,p,r,q,s,t;return $a(d,function(a){var c=typeof a==="function";if(a===null||a===l||c){n=[];p=0;for(r=g.length;p<r;p++){j=g[p];for(q=0;q<m;q++){s={row:j,column:q};if(c){t=b.aoData[j];a(s,w(b,j,q),t.anCells[q])&&n.push(s)}else n.push(s)}}return n}return h.isPlainObject(a)?[a]:i.filter(a).map(function(a,b){j=b.parentNode._DT_RowIndex;return{row:j,column:h.inArray(b,f[j].anCells)}}).toArray()})});var d=this.columns(b,c),e=this.rows(a,c),f,g,i,j,n,m=this.iterator("table",
function(a,b){f=[];g=0;for(i=e[b].length;g<i;g++){j=0;for(n=d[b].length;j<n;j++)f.push({row:e[b][g],column:d[b][j]})}return f});h.extend(m.selector,{cols:b,rows:a,opts:c});return m});t("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(a,b,c){return a.aoData[b].anCells[c]})});r("cells().data()",function(){return this.iterator("cell",function(a,b,c){return w(a,b,c)})});t("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",
function(b,c,d){return b.aoData[c][a][d]})});t("cells().render()","cell().render()",function(a){return this.iterator("cell",function(b,c,d){return w(b,c,d,a)})});t("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,b,c){return{row:b,column:c,columnVisible:$(a,c)}})});r(["cells().invalidate()","cell().invalidate()"],function(a){var b=this.selector;this.rows(b.rows,b.opts).invalidate(a);return this});r("cell()",function(a,b,c){return bb(this.cells(a,b,c))});r("cell().data()",
function(a){var b=this.context,c=this[0];if(a===l)return b.length&&c.length?w(b[0],c[0].row,c[0].column):l;Ha(b[0],c[0].row,c[0].column,a);oa(b[0],c[0].row,"data",c[0].column);return this});r("order()",function(a,b){var c=this.context;if(a===l)return 0!==c.length?c[0].aaSorting:l;"number"===typeof a?a=[[a,b]]:h.isArray(a[0])||(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(b){b.aaSorting=a.slice()})});r("order.listener()",function(a,b,c){return this.iterator("table",
function(d){Na(d,a,b,c)})});r(["columns().order()","column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];h.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});r("search()",function(a,b,c,d){var e=this.context;return a===l?0!==e.length?e[0].oPreviousSearch.sSearch:l:this.iterator("table",function(e){e.oFeatures.bFilter&&ea(e,h.extend({},e.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});t("columns().search()",
"column().search()",function(a,b,c,d){return this.iterator("column",function(e,f){var g=e.aoPreSearchCols;if(a===l)return g[f].sSearch;e.oFeatures.bFilter&&(h.extend(g[f],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),ea(e,e.oPreviousSearch,1))})});r("state()",function(){return this.context.length?this.context[0].oSavedState:null});r("state.clear()",function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});r("state.loaded()",
function(){return this.context.length?this.context[0].oLoadedState:null});r("state.save()",function(){return this.iterator("table",function(a){xa(a)})});p.versionCheck=p.fnVersionCheck=function(a){for(var b=p.version.split("."),a=a.split("."),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};p.isDataTable=p.fnIsDataTable=function(a){var b=h(a).get(0),c=!1;h.each(p.settings,function(a,e){if(e.nTable===b||e.nScrollHead===b||e.nScrollFoot===b)c=!0});
return c};p.tables=p.fnTables=function(a){return jQuery.map(p.settings,function(b){if(!a||a&&h(b.nTable).is(":visible"))return b.nTable})};p.util={throttle:ta};p.camelToHungarian=G;r("$()",function(a,b){var c=this.rows(b).nodes(),c=h(c);return h([].concat(c.filter(a).toArray(),c.find(a).toArray()))});h.each(["on","one","off"],function(a,b){r(b+"()",function(){var a=Array.prototype.slice.call(arguments);a[0].match(/\.dt\b/)||(a[0]+=".dt");var d=h(this.tables().nodes());d[b].apply(d,a);return this})});
r("clear()",function(){return this.iterator("table",function(a){ma(a)})});r("settings()",function(){return new q(this.context,this.context)});r("data()",function(){return this.iterator("table",function(a){return C(a.aoData,"_aData")}).flatten()});r("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,f=b.nTBody,g=b.nTHead,i=b.nTFoot,j=h(e),f=h(f),l=h(b.nTableWrapper),m=h.map(b.aoData,function(a){return a.nTr}),o;b.bDestroying=
!0;u(b,"aoDestroyCallback","destroy",[b]);a||(new q(b)).columns().visible(!0);l.unbind(".DT").find(":not(tbody *)").unbind(".DT");h(Da).unbind(".DT-"+b.sInstance);e!=g.parentNode&&(j.children("thead").detach(),j.append(g));i&&e!=i.parentNode&&(j.children("tfoot").detach(),j.append(i));j.detach();l.detach();b.aaSorting=[];b.aaSortingFixed=[];wa(b);h(m).removeClass(b.asStripeClasses.join(" "));h("th, td",g).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);b.bJUI&&
(h("th span."+d.sSortIcon+", td span."+d.sSortIcon,g).detach(),h("th, td",g).each(function(){var a=h("div."+d.sSortJUIWrapper,this);h(this).append(a.contents());a.detach()}));!a&&c&&c.insertBefore(e,b.nTableReinsertBefore);f.children().detach();f.append(m);j.css("width",b.sDestroyWidth).removeClass(d.sTable);(o=b.asDestroyStripes.length)&&f.children().each(function(a){h(this).addClass(b.asDestroyStripes[a%o])});c=h.inArray(b,p.settings);-1!==c&&p.settings.splice(c,1)})});p.version="1.10.3";p.settings=
[];p.models={};p.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};p.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null};p.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",
sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};p.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,
fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,
fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},
sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:h.extend({},p.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,
sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null};V(p.defaults);p.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};V(p.defaults.column);p.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,
bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],
sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,
bAjaxDataGet:!0,jqXHR:null,json:l,oAjaxData:l,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==A(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==A(this)?1*this._iRecordsDisplay:
this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{}};p.ext=v={classes:{},errMode:"alert",feature:[],search:[],internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],
search:{},order:{}},_unique:0,fnVersionCheck:p.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:p.version};h.extend(v,{afnFiltering:v.search,aTypes:v.type.detect,ofnSearch:v.type.search,oSort:v.type.order,afnSortData:v.order,aoFeatures:v.feature,oApi:v.internal,oStdClasses:v.classes,oPagination:v.pager});h.extend(p.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",
sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",
sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var Ca="",Ca="",E=Ca+"ui-state-default",ha=Ca+"css_right ui-icon ui-icon-",Wb=Ca+"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";h.extend(p.ext.oJUIClasses,p.ext.classes,{sPageButton:"fg-button ui-button "+
E,sPageButtonActive:"ui-state-disabled",sPageButtonDisabled:"ui-state-disabled",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:E+" sorting_asc",sSortDesc:E+" sorting_desc",sSortable:E+" sorting",sSortableAsc:E+" sorting_asc_disabled",sSortableDesc:E+" sorting_desc_disabled",sSortableNone:E+" sorting_disabled",sSortJUIAsc:ha+"triangle-1-n",sSortJUIDesc:ha+"triangle-1-s",sSortJUI:ha+"carat-2-n-s",sSortJUIAscAllowed:ha+"carat-1-n",sSortJUIDescAllowed:ha+
"carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead "+E,sScrollFoot:"dataTables_scrollFoot "+E,sHeaderTH:E,sFooterTH:E,sJUIHeader:Wb+" ui-corner-tl ui-corner-tr",sJUIFooter:Wb+" ui-corner-bl ui-corner-br"});var Mb=p.ext.pager;h.extend(Mb,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},simple_numbers:function(a,b){return["previous",Wa(a,b),"next"]},full_numbers:function(a,b){return["first",
"previous",Wa(a,b),"next","last"]},_numbers:Wa,numbers_length:7});h.extend(!0,p.ext.renderer,{pageButton:{_:function(a,b,c,d,e,f){var g=a.oClasses,i=a.oLanguage.oPaginate,j,l,m=0,o=function(b,d){var k,p,r,q,s=function(b){Ta(a,b.data.action,true)};k=0;for(p=d.length;k<p;k++){q=d[k];if(h.isArray(q)){r=h("<"+(q.DT_el||"div")+"/>").appendTo(b);o(r,q)}else{l=j="";switch(q){case "ellipsis":b.append("<span>&hellip;</span>");break;case "first":j=i.sFirst;l=q+(e>0?"":" "+g.sPageButtonDisabled);break;case "previous":j=
i.sPrevious;l=q+(e>0?"":" "+g.sPageButtonDisabled);break;case "next":j=i.sNext;l=q+(e<f-1?"":" "+g.sPageButtonDisabled);break;case "last":j=i.sLast;l=q+(e<f-1?"":" "+g.sPageButtonDisabled);break;default:j=q+1;l=e===q?g.sPageButtonActive:""}if(j){r=h("<a>",{"class":g.sPageButton+" "+l,"aria-controls":a.sTableId,"data-dt-idx":m,tabindex:a.iTabIndex,id:c===0&&typeof q==="string"?a.sTableId+"_"+q:null}).html(j).appendTo(b);Va(r,{action:q},s);m++}}}};try{var k=h(P.activeElement).data("dt-idx");o(h(b).empty(),
d);k!==null&&h(b).find("[data-dt-idx="+k+"]").focus()}catch(p){}}}});var za=function(a,b,c,d){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=Qb(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};h.extend(v.type.order,{"date-pre":function(a){return Date.parse(a)||0},"html-pre":function(a){return H(a)?"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return H(a)?"":"string"===typeof a?a.toLowerCase():!a.toString?"":a.toString()},"string-asc":function(a,
b){return a<b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});db("");h.extend(p.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return Za(a,c)?"num"+c:null},function(a){if(a&&!(a instanceof Date)&&(!$b.test(a)||!ac.test(a)))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||H(a)?"date":null},function(a,b){var c=b.oLanguage.sDecimal;return Za(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Rb(a,c)?"html-num"+c:null},function(a,b){var c=
b.oLanguage.sDecimal;return Rb(a,c,!0)?"html-num-fmt"+c:null},function(a){return H(a)||"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);h.extend(p.ext.type.search,{html:function(a){return H(a)?a:"string"===typeof a?a.replace(Ob," ").replace(Aa,""):""},string:function(a){return H(a)?a:"string"===typeof a?a.replace(Ob," "):a}});h.extend(!0,p.ext.renderer,{header:{_:function(a,b,c,d){h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(c.sSortingClass+" "+d.sSortAsc+
" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass)}})},jqueryui:function(a,b,c,d){h("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(h("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass);b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+
" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass(h[e]=="asc"?d.sSortJUIAsc:h[e]=="desc"?d.sSortJUIDesc:c.sSortingClassJUI)}})}}});p.render={number:function(a,b,c,d){return{display:function(e){var f=0>e?"-":"",e=Math.abs(parseFloat(e)),g=parseInt(e,10),e=c?b+(e-g).toFixed(c).substring(2):"";return f+(d||"")+g.toString().replace(/\B(?=(\d{3})+(?!\d))/g,a)+e}}}};h.extend(p.ext.internal,{_fnExternApiFunc:Nb,_fnBuildAjax:qa,_fnAjaxUpdate:kb,_fnAjaxParameters:tb,_fnAjaxUpdateDraw:ub,
_fnAjaxDataSrc:ra,_fnAddColumn:Ea,_fnColumnOptions:ia,_fnAdjustColumnSizing:X,_fnVisibleToColumnIndex:ja,_fnColumnIndexToVisible:$,_fnVisbleColumns:aa,_fnGetColumns:Z,_fnColumnTypes:Ga,_fnApplyColumnDefs:ib,_fnHungarianMap:V,_fnCamelToHungarian:G,_fnLanguageCompat:O,_fnBrowserDetect:gb,_fnAddData:I,_fnAddTr:ka,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==l?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return h.inArray(c,a.aoData[b].anCells)},_fnGetCellData:w,_fnSetCellData:Ha,
_fnSplitObjNotation:Ja,_fnGetObjectDataFn:W,_fnSetObjectDataFn:Q,_fnGetDataMaster:Ka,_fnClearTable:ma,_fnDeleteIndex:na,_fnInvalidateRow:oa,_fnGetRowElements:la,_fnCreateTr:Ia,_fnBuildHead:jb,_fnDrawHead:da,_fnDraw:L,_fnReDraw:M,_fnAddOptionsHtml:mb,_fnDetectHeader:ca,_fnGetUniqueThs:pa,_fnFeatureHtmlFilter:ob,_fnFilterComplete:ea,_fnFilterCustom:xb,_fnFilterColumn:wb,_fnFilter:vb,_fnFilterCreateSearch:Pa,_fnEscapeRegex:Qa,_fnFilterData:yb,_fnFeatureHtmlInfo:rb,_fnUpdateInfo:Bb,_fnInfoMacros:Cb,_fnInitialise:va,
_fnInitComplete:sa,_fnLengthChange:Ra,_fnFeatureHtmlLength:nb,_fnFeatureHtmlPaginate:sb,_fnPageChange:Ta,_fnFeatureHtmlProcessing:pb,_fnProcessingDisplay:B,_fnFeatureHtmlTable:qb,_fnScrollDraw:Y,_fnApplyToChildren:F,_fnCalculateColumnWidths:Fa,_fnThrottle:ta,_fnConvertToWidth:Db,_fnScrollingWidthAdjust:Fb,_fnGetWidestNode:Eb,_fnGetMaxLenString:Gb,_fnStringToCss:s,_fnScrollBarWidth:Hb,_fnSortFlatten:T,_fnSort:lb,_fnSortAria:Jb,_fnSortListener:Ua,_fnSortAttachListener:Na,_fnSortingClasses:wa,_fnSortData:Ib,
_fnSaveState:xa,_fnLoadState:Kb,_fnSettingsFromNode:ya,_fnLog:R,_fnMap:D,_fnBindAction:Va,_fnCallbackReg:y,_fnCallbackFire:u,_fnLengthOverflow:Sa,_fnRenderer:Oa,_fnDataSource:A,_fnRowAttributes:La,_fnCalculateEnd:function(){}});h.fn.dataTable=p;h.fn.dataTableSettings=p.settings;h.fn.dataTableExt=p.ext;h.fn.DataTable=function(a){return h(this).dataTable(a).api()};h.each(p,function(a,b){h.fn.DataTable[a]=b});return h.fn.dataTable};"function"===typeof define&&define.amd?define("datatables",["jquery"],
O):"object"===typeof exports?O(require("jquery")):jQuery&&!jQuery.fn.dataTable&&O(jQuery)})(window,document);




/*! AutoFill 1.2.1
 * Â©2008-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     AutoFill
 * @description Add Excel like click and drag auto-fill options to DataTables
 * @version     1.2.1
 * @file        dataTables.autoFill.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2014 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( window, document, undefined ) {

var factory = function( $, DataTable ) {
"use strict";

/** 
 * AutoFill provides Excel like auto-fill features for a DataTable
 *
 * @class AutoFill
 * @constructor
 * @param {object} oTD DataTables settings object
 * @param {object} oConfig Configuration object for AutoFill
 */
var AutoFill = function( oDT, oConfig )
{
	/* Sanity check that we are a new instance */
	if ( ! (this instanceof AutoFill) ) {
		throw( "Warning: AutoFill must be initialised with the keyword 'new'" );
	}

	if ( ! $.fn.dataTableExt.fnVersionCheck('1.7.0') ) {
		throw( "Warning: AutoFill requires DataTables 1.7 or greater");
	}


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public class variables
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	this.c = {};

	/**
	 * @namespace Settings object which contains customisable information for AutoFill instance
	 */
	this.s = {
		/**
		 * @namespace Cached information about the little dragging icon (the filler)
		 */
		"filler": {
			"height": 0,
			"width": 0
		},

		/**
		 * @namespace Cached information about the border display
		 */
		"border": {
			"width": 2
		},

		/**
		 * @namespace Store for live information for the current drag
		 */
		"drag": {
			"startX": -1,
			"startY": -1,
			"startTd": null,
			"endTd": null,
			"dragging": false
		},

		/**
		 * @namespace Data cache for information that we need for scrolling the screen when we near
		 *   the edges
		 */
		"screen": {
			"interval": null,
			"y": 0,
			"height": 0,
			"scrollTop": 0
		},

		/**
		 * @namespace Data cache for the position of the DataTables scrolling element (when scrolling
		 *   is enabled)
		 */
		"scroller": {
			"top": 0,
			"bottom": 0
		},

		/**
		 * @namespace Information stored for each column. An array of objects
		 */
		"columns": []
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		"table": null,
		"filler": null,
		"borderTop": null,
		"borderRight": null,
		"borderBottom": null,
		"borderLeft": null,
		"currentTarget": null
	};



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public class methods
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Retreieve the settings object from an instance
	 *  @method fnSettings
	 *  @returns {object} AutoFill settings object
	 */
	this.fnSettings = function () {
		return this.s;
	};


	/* Constructor logic */
	this._fnInit( oDT, oConfig );
	return this;
};



AutoFill.prototype = {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods (they are of course public in JS, but recommended as private)
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Initialisation
	 *  @method _fnInit
	 *  @param {object} dt DataTables settings object
	 *  @param {object} config Configuration object for AutoFill
	 *  @returns void
	 */
	"_fnInit": function ( dt, config )
	{
		var
			that = this,
			i, iLen;

		// Use DataTables API to get the settings allowing selectors, instances
		// etc to be used, or for backwards compatibility get from the old
		// fnSettings method
		this.s.dt = DataTable.Api ?
			new DataTable.Api( dt ).settings()[0] :
			dt.fnSettings();
		this.s.init = config || {};
		this.dom.table = this.s.dt.nTable;

		$.extend( true, this.c, AutoFill.defaults, config );

		/* Add and configure the columns */
		this._initColumns();

		/* Auto Fill click and drag icon */
		var filler = $('<div/>', {
				'class': 'AutoFill_filler'
			} )
			.appendTo( 'body' );
		this.dom.filler = filler[0];

		// Get the height / width of the click element
		this.s.filler.height = filler.height();
		this.s.filler.width = filler.width();
		filler[0].style.display = "none";

		/* Border display - one div for each side. We can't just use a single
		 * one with a border, as we want the events to effectively pass through
		 * the transparent bit of the box
		 */
		var border;
		var appender = document.body;
		if ( that.s.dt.oScroll.sY !== "" ) {
			that.s.dt.nTable.parentNode.style.position = "relative";
			appender = that.s.dt.nTable.parentNode;
		}

		border = $('<div/>', {
			"class": "AutoFill_border"
		} );
		this.dom.borderTop    = border.clone().appendTo( appender )[0];
		this.dom.borderRight  = border.clone().appendTo( appender )[0];
		this.dom.borderBottom = border.clone().appendTo( appender )[0];
		this.dom.borderLeft   = border.clone().appendTo( appender )[0];

		/* Events */
		filler.on( 'mousedown.DTAF', function (e) {
			this.onselectstart = function() { return false; };
			that._fnFillerDragStart.call( that, e );
			return false;
		} );

		$('tbody', this.dom.table).on(
			'mouseover.DTAF mouseout.DTAF',
			'>tr>td, >tr>th',
			function (e) {
				that._fnFillerDisplay.call( that, e );
			}
		);

		$(this.dom.table).on( 'destroy.dt.DTAF', function () {
			filler.off( 'mousedown.DTAF' ).remove();
			$('tbody', this.dom.table).off( 'mouseover.DTAF mouseout.DTAF' );
		} );
	},


	_initColumns: function ( )
	{
		var that = this;
		var i, ien;
		var dt = this.s.dt;
		var config = this.s.init;

		for ( i=0, ien=dt.aoColumns.length ; i<ien ; i++ ) {
			this.s.columns[i] = $.extend( true, {}, AutoFill.defaults.column );
		}

		dt.oApi._fnApplyColumnDefs(
			dt,
			config.aoColumnDefs || config.columnDefs,
			config.aoColumns || config.columns,
			function (colIdx, def) {
				that._fnColumnOptions( colIdx, def );
			}
		);

		// For columns which don't have read, write, step functions defined,
		// use the default ones
		for ( i=0, ien=dt.aoColumns.length ; i<ien ; i++ ) {
			var column = this.s.columns[i];

			if ( ! column.read ) {
				column.read = this._fnReadCell;
			}
			if ( ! column.write ) {
				column.read = this._fnWriteCell;
			}
			if ( ! column.step ) {
				column.read = this._fnStep;
			}
		}
	},


	"_fnColumnOptions": function ( i, opts )
	{
		var column = this.s.columns[ i ];
		var set = function ( outProp, inProp ) {
			if ( opts[ inProp[0] ] !== undefined ) {
				column[ outProp ] = opts[ inProp[0] ];
			}
			if ( opts[ inProp[1] ] !== undefined ) {
				column[ outProp ] = opts[ inProp[1] ];
			}
		};

		// Compatibility with the old Hungarian style of notation
		set( 'enable',    ['bEnable',     'enable'] );
		set( 'read',      ['fnRead',      'read'] );
		set( 'write',     ['fnWrite',     'write'] );
		set( 'step',      ['fnStep',      'step'] );
		set( 'increment', ['bIncrement',  'increment'] );
	},


	/**
	 * Find out the coordinates of a given TD cell in a table
	 *  @method  _fnTargetCoords
	 *  @param   {Node} nTd
	 *  @returns {Object} x and y properties, for the position of the cell in the tables DOM
	 */
	"_fnTargetCoords": function ( nTd )
	{
		var nTr = $(nTd).parents('tr')[0];
		var position = this.s.dt.oInstance.fnGetPosition( nTd );

		return {
			"x":      $('td', nTr).index(nTd),
			"y":      $('tr', nTr.parentNode).index(nTr),
			"row":    position[0],
			"column": position[2]
		};
	},


	/**
	 * Display the border around one or more cells (from start to end)
	 *  @method  _fnUpdateBorder
	 *  @param   {Node} nStart Starting cell
	 *  @param   {Node} nEnd Ending cell
	 *  @returns void
	 */
	"_fnUpdateBorder": function ( nStart, nEnd )
	{
		var
			border = this.s.border.width,
			offsetStart = $(nStart).offset(),
			offsetEnd = $(nEnd).offset(),
			x1 = offsetStart.left - border,
			x2 = offsetEnd.left + $(nEnd).outerWidth(),
			y1 = offsetStart.top - border,
			y2 = offsetEnd.top + $(nEnd).outerHeight(),
			width = offsetEnd.left + $(nEnd).outerWidth() - offsetStart.left + (2*border),
			height = offsetEnd.top + $(nEnd).outerHeight() - offsetStart.top + (2*border),
			oStyle;

		// Recalculate start and end (when dragging "backwards")  
		if( offsetStart.left > offsetEnd.left) {
			x1 = offsetEnd.left - border;
			x2 = offsetStart.left + $(nStart).outerWidth();
			width = offsetStart.left + $(nStart).outerWidth() - offsetEnd.left + (2*border);
		}

		if ( this.s.dt.oScroll.sY !== "" )
		{
			/* The border elements are inside the DT scroller - so position relative to that */
			var
				offsetScroll = $(this.s.dt.nTable.parentNode).offset(),
				scrollTop = $(this.s.dt.nTable.parentNode).scrollTop(),
				scrollLeft = $(this.s.dt.nTable.parentNode).scrollLeft();

			x1 -= offsetScroll.left - scrollLeft;
			x2 -= offsetScroll.left - scrollLeft;
			y1 -= offsetScroll.top - scrollTop;
			y2 -= offsetScroll.top - scrollTop;
		}

		/* Top */
		oStyle = this.dom.borderTop.style;
		oStyle.top = y1+"px";
		oStyle.left = x1+"px";
		oStyle.height = this.s.border.width+"px";
		oStyle.width = width+"px";

		/* Bottom */
		oStyle = this.dom.borderBottom.style;
		oStyle.top = y2+"px";
		oStyle.left = x1+"px";
		oStyle.height = this.s.border.width+"px";
		oStyle.width = width+"px";

		/* Left */
		oStyle = this.dom.borderLeft.style;
		oStyle.top = y1+"px";
		oStyle.left = x1+"px";
		oStyle.height = height+"px";
		oStyle.width = this.s.border.width+"px";

		/* Right */
		oStyle = this.dom.borderRight.style;
		oStyle.top = y1+"px";
		oStyle.left = x2+"px";
		oStyle.height = height+"px";
		oStyle.width = this.s.border.width+"px";
	},


	/**
	 * Mouse down event handler for starting a drag
	 *  @method  _fnFillerDragStart
	 *  @param   {Object} e Event object
	 *  @returns void
	 */
	"_fnFillerDragStart": function (e)
	{
		var that = this;
		var startingTd = this.dom.currentTarget;

		this.s.drag.dragging = true;

		that.dom.borderTop.style.display = "block";
		that.dom.borderRight.style.display = "block";
		that.dom.borderBottom.style.display = "block";
		that.dom.borderLeft.style.display = "block";

		var coords = this._fnTargetCoords( startingTd );
		this.s.drag.startX = coords.x;
		this.s.drag.startY = coords.y;

		this.s.drag.startTd = startingTd;
		this.s.drag.endTd = startingTd;

		this._fnUpdateBorder( startingTd, startingTd );

		$(document).bind('mousemove.AutoFill', function (e) {
			that._fnFillerDragMove.call( that, e );
		} );

		$(document).bind('mouseup.AutoFill', function (e) {
			that._fnFillerFinish.call( that, e );
		} );

		/* Scrolling information cache */
		this.s.screen.y = e.pageY;
		this.s.screen.height = $(window).height();
		this.s.screen.scrollTop = $(document).scrollTop();

		if ( this.s.dt.oScroll.sY !== "" )
		{
			this.s.scroller.top = $(this.s.dt.nTable.parentNode).offset().top;
			this.s.scroller.bottom = this.s.scroller.top + $(this.s.dt.nTable.parentNode).height();
		}

		/* Scrolling handler - we set an interval (which is cancelled on mouse up) which will fire
		 * regularly and see if we need to do any scrolling
		 */
		this.s.screen.interval = setInterval( function () {
			var iScrollTop = $(document).scrollTop();
			var iScrollDelta = iScrollTop - that.s.screen.scrollTop;
			that.s.screen.y += iScrollDelta;

			if ( that.s.screen.height - that.s.screen.y + iScrollTop < 50 )
			{
				$('html, body').animate( {
					"scrollTop": iScrollTop + 50
				}, 240, 'linear' );
			}
			else if ( that.s.screen.y - iScrollTop < 50 )
			{
				$('html, body').animate( {
					"scrollTop": iScrollTop - 50
				}, 240, 'linear' );
			}

			if ( that.s.dt.oScroll.sY !== "" )
			{
				if ( that.s.screen.y > that.s.scroller.bottom - 50 )
				{
					$(that.s.dt.nTable.parentNode).animate( {
						"scrollTop": $(that.s.dt.nTable.parentNode).scrollTop() + 50
					}, 240, 'linear' );
				}
				else if ( that.s.screen.y < that.s.scroller.top + 50 )
				{
					$(that.s.dt.nTable.parentNode).animate( {
						"scrollTop": $(that.s.dt.nTable.parentNode).scrollTop() - 50
					}, 240, 'linear' );
				}
			}
		}, 250 );
	},


	/**
	 * Mouse move event handler for during a move. See if we want to update the display based on the
	 * new cursor position
	 *  @method  _fnFillerDragMove
	 *  @param   {Object} e Event object
	 *  @returns void
	 */
	"_fnFillerDragMove": function (e)
	{
		if ( e.target && e.target.nodeName.toUpperCase() == "TD" &&
			 e.target != this.s.drag.endTd )
		{
			var coords = this._fnTargetCoords( e.target );

			if ( this.c.mode == "y" && coords.x != this.s.drag.startX )
			{
				e.target = $('tbody>tr:eq('+coords.y+')>td:eq('+this.s.drag.startX+')', this.dom.table)[0];
			}
			if ( this.c.mode == "x" && coords.y != this.s.drag.startY )
			{
				e.target = $('tbody>tr:eq('+this.s.drag.startY+')>td:eq('+coords.x+')', this.dom.table)[0];
			}

			if ( this.c.mode == "either")
			{
				if(coords.x != this.s.drag.startX )
				{
					e.target = $('tbody>tr:eq('+this.s.drag.startY+')>td:eq('+coords.x+')', this.dom.table)[0];
				}
				else if ( coords.y != this.s.drag.startY ) {
					e.target = $('tbody>tr:eq('+coords.y+')>td:eq('+this.s.drag.startX+')', this.dom.table)[0];
				}
			}

			// update coords
			if ( this.c.mode !== "both" ) {
				coords = this._fnTargetCoords( e.target );
			}

			var drag = this.s.drag;
			drag.endTd = e.target;

			if ( coords.y >= this.s.drag.startY ) {
				this._fnUpdateBorder( drag.startTd, drag.endTd );
			}
			else {
				this._fnUpdateBorder( drag.endTd, drag.startTd );
			}
			this._fnFillerPosition( e.target );
		}

		/* Update the screen information so we can perform scrolling */
		this.s.screen.y = e.pageY;
		this.s.screen.scrollTop = $(document).scrollTop();

		if ( this.s.dt.oScroll.sY !== "" )
		{
			this.s.scroller.scrollTop = $(this.s.dt.nTable.parentNode).scrollTop();
			this.s.scroller.top = $(this.s.dt.nTable.parentNode).offset().top;
			this.s.scroller.bottom = this.s.scroller.top + $(this.s.dt.nTable.parentNode).height();
		}
	},


	/**
	 * Mouse release handler - end the drag and take action to update the cells with the needed values
	 *  @method  _fnFillerFinish
	 *  @param   {Object} e Event object
	 *  @returns void
	 */
	"_fnFillerFinish": function (e)
	{
		var that = this, i, iLen, j;

		$(document).unbind('mousemove.AutoFill mouseup.AutoFill');

		this.dom.borderTop.style.display = "none";
		this.dom.borderRight.style.display = "none";
		this.dom.borderBottom.style.display = "none";
		this.dom.borderLeft.style.display = "none";

		this.s.drag.dragging = false;

		clearInterval( this.s.screen.interval );

		var cells = [];
		var table = this.dom.table;
		var coordsStart = this._fnTargetCoords( this.s.drag.startTd );
		var coordsEnd = this._fnTargetCoords( this.s.drag.endTd );
		var columnIndex = function ( visIdx ) {
			return that.s.dt.oApi._fnVisibleToColumnIndex( that.s.dt, visIdx );
		};

		// xxx - urgh - there must be a way of reducing this...
		if ( coordsStart.y <= coordsEnd.y ) {
			for ( i=coordsStart.y ; i<=coordsEnd.y ; i++ ) {
				if ( coordsStart.x <= coordsEnd.x ) {
					for ( j=coordsStart.x ; j<=coordsEnd.x ; j++ ) {
						cells.push( {
							node:   $('tbody>tr:eq('+i+')>td:eq('+j+')', table)[0],
							x:      j - coordsStart.x,
							y:      i - coordsStart.y,
							colIdx: columnIndex( j )
						} );
					}
				}
				else {
					for ( j=coordsStart.x ; j>=coordsEnd.x ; j-- ) {
						cells.push( {
							node:   $('tbody>tr:eq('+i+')>td:eq('+j+')', table)[0],
							x:      j - coordsStart.x,
							y:      i - coordsStart.y,
							colIdx: columnIndex( j )
						} );
					}
				}
			}
		}
		else {
			for ( i=coordsStart.y ; i>=coordsEnd.y ; i-- ) {
				if ( coordsStart.x <= coordsEnd.x ) {
					for ( j=coordsStart.x ; j<=coordsEnd.x ; j++ ) {
						cells.push( {
							node:   $('tbody>tr:eq('+i+')>td:eq('+j+')', table)[0],
							x:      j - coordsStart.x,
							y:      i - coordsStart.y,
							colIdx: columnIndex( j )
						} );
					}
				}
				else {
					for ( j=coordsStart.x ; j>=coordsEnd.x ; j-- ) {
						cells.push( {
							node:   $('tbody>tr:eq('+i+')>td:eq('+j+')', table)[0],
							x:      coordsStart.x - j,
							y:      coordsStart.y - i,
							colIdx: columnIndex( j )
						} );
					}
				}
			}
		}

		// An auto-fill requires 2 or more cells
		if ( cells.length <= 1 ) {
			return;
		}

		var edited = [];
		var previous;

		for ( i=0, iLen=cells.length ; i<iLen ; i++ ) {
			var cell      = cells[i];
			var column    = this.s.columns[ cell.colIdx ];
			var read      = column.read.call( column, cell.node );
			var stepValue = column.step.call( column, cell.node, read, previous, i, cell.x, cell.y );

			column.write.call( column, cell.node, stepValue );

			previous = stepValue;
			edited.push( {
				cell:     cell,
				colIdx:   cell.colIdx,
				newValue: stepValue,
				oldValue: read
			} );
		}

		if ( this.c.complete !== null ) {
			this.c.complete.call( this, edited );
		}

		// In 1.10 we can do a static draw
		if ( DataTable.Api ) {
			new DataTable.Api( this.s.dt ).draw( false );
		}
		else {
			this.s.dt.oInstance.fnDraw();
		}
	},


	/**
	 * Display the drag handle on mouse over cell
	 *  @method  _fnFillerDisplay
	 *  @param   {Object} e Event object
	 *  @returns void
	 */
	"_fnFillerDisplay": function (e)
	{
		var filler = this.dom.filler;

		/* Don't display automatically when dragging */
		if ( this.s.drag.dragging)
		{
			return;
		}

		/* Check that we are allowed to AutoFill this column or not */
		var nTd = (e.target.nodeName.toLowerCase() == 'td') ? e.target : $(e.target).parents('td')[0];
		var iX = this._fnTargetCoords(nTd).column;
		if ( !this.s.columns[iX].enable )
		{
			filler.style.display = "none";
			return;
		}

		if (e.type == 'mouseover')
		{
			this.dom.currentTarget = nTd;
			this._fnFillerPosition( nTd );

			filler.style.display = "block";
		}
		else if ( !e.relatedTarget || !e.relatedTarget.className.match(/AutoFill/) )
		{
			filler.style.display = "none";
		}
	},


	/**
	 * Position the filler icon over a cell
	 *  @method  _fnFillerPosition
	 *  @param   {Node} nTd Cell to position filler icon over
	 *  @returns void
	 */
	"_fnFillerPosition": function ( nTd )
	{
		var offset = $(nTd).offset();
		var filler = this.dom.filler;
		filler.style.top = (offset.top - (this.s.filler.height / 2)-1 + $(nTd).outerHeight())+"px";
		filler.style.left = (offset.left - (this.s.filler.width / 2)-1 + $(nTd).outerWidth())+"px";
	}
};


// Alias for access
DataTable.AutoFill = AutoFill;
DataTable.AutoFill = AutoFill;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * AutoFill version
 *  @constant  version
 *  @type      String
 *  @default   See code
 */
AutoFill.version = "1.2.1";


/**
 * AutoFill defaults
 *  @namespace
 */
AutoFill.defaults = {
	/**
	 * Mode for dragging (restrict to y-axis only, x-axis only, either one or none):
	 *
	 *  * `y`      - y-axis only (default)
	 *  * `x`      - x-axis only
	 *  * `either` - either one, but not both axis at the same time
	 *  * `both`   - multiple cells allowed
	 *
	 * @type {string}
	 * @default `y`
	 */
	mode: 'y',

	complete: null,

	/**
	 * Column definition defaults
	 *  @namespace
	 */
	column: {
		/**
		 * If AutoFill should be enabled on this column
		 *
		 * @type {boolean}
		 * @default true
		 */
		enable: true,

		/**
		 * Allow automatic increment / decrement on this column if a number
		 * is found.
		 *
		 * @type {boolean}
		 * @default true
		 */
		increment: true,

		/**
		 * Cell read function
		 *
		 * Default function will simply read the value from the HTML of the
		 * cell.
		 *
		 * @type   {function}
		 * @param  {node} cell `th` / `td` element to read the value from
		 * @return {string}    Data that has been read
		 */
		read: function ( cell ) {
			return $(cell).html();
		},

		/**
		 * Cell write function
		 *
		 * Default function will simply write to the HTML and tell the DataTable
		 * to update.
		 *
		 * @type   {function}
		 * @param  {node} cell `th` / `td` element to write the value to
		 * @return {string}    Data two write
		 */
		write: function ( cell, val ) {
			var table = $(cell).parents('table');
			if ( DataTable.Api ) {
				// 1.10
				table.DataTable().cell( cell ).data( val );
			}
			else {
				// 1.9
				var dt = table.dataTable();
				var pos = dt.fnGetPosition( cell );
				dt.fnUpdate( val, pos[0], pos[2], false );
			}
		},

		/**
		 * Step function. This provides the ability to customise how the values
		 * are incremented.
		 *
		 * @param  {node} cell `th` / `td` element that is being operated upon
		 * @param  {string} read Cell value from `read` function
		 * @param  {string} last Value of the previous cell
		 * @param  {integer} i Loop counter
		 * @param  {integer} x Cell x-position in the current auto-fill. The
		 *   starting cell is coordinate 0 regardless of its physical position
		 *   in the DataTable.
		 * @param  {integer} y Cell y-position in the current auto-fill. The
		 *   starting cell is coordinate 0 regardless of its physical position
		 *   in the DataTable.
		 * @return {string} Value to write
		 */
		step: function ( cell, read, last, i, x, y ) {
			// Increment a number if it is found
			var re = /(\-?\d+)/;
			var match = this.increment && last ? last.match(re) : null;
			if ( match ) {
				return last.replace( re, parseInt(match[1],10) + (x<0 || y<0 ? -1 : 1) );
			}
			return last === undefined ?
				read :
				last;
		}
	}
};

return AutoFill;
};


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery && !jQuery.fn.dataTable.AutoFill ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


}(window, document));





(function($){$.fn.editable=function(target,options){if('disable'==target){$(this).data('disabled.editable',true);return;}
if('enable'==target){$(this).data('disabled.editable',false);return;}
if('destroy'==target){$(this).unbind($(this).data('event.editable')).removeData('disabled.editable').removeData('event.editable');return;}
var settings=$.extend({},$.fn.editable.defaults,{target:target},options);var plugin=$.editable.types[settings.type].plugin||function(){};var submit=$.editable.types[settings.type].submit||function(){};var buttons=$.editable.types[settings.type].buttons||$.editable.types['defaults'].buttons;var content=$.editable.types[settings.type].content||$.editable.types['defaults'].content;var element=$.editable.types[settings.type].element||$.editable.types['defaults'].element;var reset=$.editable.types[settings.type].reset||$.editable.types['defaults'].reset;var callback=settings.callback||function(){};var onedit=settings.onedit||function(){};var onsubmit=settings.onsubmit||function(){};var onreset=settings.onreset||function(){};var onerror=settings.onerror||reset;if(settings.tooltip){$(this).attr('title',settings.tooltip);}
settings.autowidth='auto'==settings.width;settings.autoheight='auto'==settings.height;return this.each(function(){var self=this;var savedwidth=$(self).width();var savedheight=$(self).height();$(this).data('event.editable',settings.event);if(!$.trim($(this).html())){$(this).html(settings.placeholder);}
$(this).bind(settings.event,function(e){if(true===$(this).data('disabled.editable')){return;}
if(self.editing){return;}
if(false===onedit.apply(this,[settings,self])){return;}
e.preventDefault();e.stopPropagation();if(settings.tooltip){$(self).removeAttr('title');}
if(0==$(self).width()){settings.width=savedwidth;settings.height=savedheight;}else{if(settings.width!='none'){settings.width=settings.autowidth?$(self).width():settings.width;}
if(settings.height!='none'){settings.height=settings.autoheight?$(self).height():settings.height;}}
if($(this).html().toLowerCase().replace(/(;|")/g,'')==settings.placeholder.toLowerCase().replace(/(;|")/g,'')){$(this).html('');}
self.editing=true;self.revert=$(self).html();$(self).html('');var form=$('<form />');if(settings.cssclass){if('inherit'==settings.cssclass){form.attr('class',$(self).attr('class'));}else{form.attr('class',settings.cssclass);}}
if(settings.style){if('inherit'==settings.style){form.attr('style',$(self).attr('style'));form.css('display',$(self).css('display'));}else{form.attr('style',settings.style);}}
var input=element.apply(form,[settings,self]);var input_content;if(settings.loadurl){var t=setTimeout(function(){input.disabled=true;content.apply(form,[settings.loadtext,settings,self]);},100);var loaddata={};loaddata[settings.id]=self.id;if($.isFunction(settings.loaddata)){$.extend(loaddata,settings.loaddata.apply(self,[self.revert,settings]));}else{$.extend(loaddata,settings.loaddata);}
$.ajax({type:settings.loadtype,url:settings.loadurl,data:loaddata,async:false,success:function(result){window.clearTimeout(t);input_content=result;input.disabled=false;}});}else if(settings.data){input_content=settings.data;if($.isFunction(settings.data)){input_content=settings.data.apply(self,[self.revert,settings]);}}else{input_content=self.revert;}
content.apply(form,[input_content,settings,self]);input.attr('name',settings.name);buttons.apply(form,[settings,self]);$(self).append(form);plugin.apply(form,[settings,self]);$(':input:visible:enabled:first',form).focus();if(settings.select){input.select();}
input.keydown(function(e){if(e.keyCode==27){e.preventDefault();reset.apply(form,[settings,self]);}});var t;if('cancel'==settings.onblur){input.blur(function(e){t=setTimeout(function(){reset.apply(form,[settings,self]);},500);});}else if('submit'==settings.onblur){input.blur(function(e){t=setTimeout(function(){form.submit();},200);});}else if($.isFunction(settings.onblur)){input.blur(function(e){settings.onblur.apply(self,[input.val(),settings]);});}else{input.blur(function(e){});}
form.submit(function(e){if(t){clearTimeout(t);}
e.preventDefault();if(false!==onsubmit.apply(form,[settings,self])){if(false!==submit.apply(form,[settings,self])){if($.isFunction(settings.target)){var str=settings.target.apply(self,[input.val(),settings]);$(self).html(str);self.editing=false;callback.apply(self,[self.innerHTML,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}}else{var submitdata={};submitdata[settings.name]=input.val();submitdata[settings.id]=self.id;if($.isFunction(settings.submitdata)){$.extend(submitdata,settings.submitdata.apply(self,[self.revert,settings]));}else{$.extend(submitdata,settings.submitdata);}
if('PUT'==settings.method){submitdata['_method']='put';}
$(self).html(settings.indicator);var ajaxoptions={type:'POST',data:submitdata,dataType:'html',url:settings.target,success:function(result,status){if(ajaxoptions.dataType=='html'){$(self).html(result);}
self.editing=false;callback.apply(self,[result,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}},error:function(xhr,status,error){onerror.apply(form,[settings,self,xhr]);}};$.extend(ajaxoptions,settings.ajaxoptions);$.ajax(ajaxoptions);}}}
$(self).attr('title',settings.tooltip);return false;});});this.reset=function(form){if(this.editing){if(false!==onreset.apply(form,[settings,self])){$(self).html(self.revert);self.editing=false;if(!$.trim($(self).html())){$(self).html(settings.placeholder);}
if(settings.tooltip){$(self).attr('title',settings.tooltip);}}}};});};$.editable={types:{defaults:{element:function(settings,original){var input=$('<input type="hidden"></input>');$(this).append(input);return(input);},content:function(string,settings,original){$(':input:first',this).val(string);},reset:function(settings,original){original.reset(this);},buttons:function(settings,original){var form=this;if(settings.submit){if(settings.submit.match(/>$/)){var submit=$(settings.submit).click(function(){if(submit.attr("type")!="submit"){form.submit();}});}else{var submit=$('<button type="submit" />');submit.html(settings.submit);}
$(this).append(submit);}
if(settings.cancel){if(settings.cancel.match(/>$/)){var cancel=$(settings.cancel);}else{var cancel=$('<button type="cancel" />');cancel.html(settings.cancel);}
$(this).append(cancel);$(cancel).click(function(event){if($.isFunction($.editable.types[settings.type].reset)){var reset=$.editable.types[settings.type].reset;}else{var reset=$.editable.types['defaults'].reset;}
reset.apply(form,[settings,original]);return false;});}}},text:{element:function(settings,original){var input=$('<input />');if(settings.width!='none'){input.width(settings.width);}
if(settings.height!='none'){input.height(settings.height);}
input.attr('autocomplete','off');$(this).append(input);return(input);}},textarea:{element:function(settings,original){var textarea=$('<textarea />');if(settings.rows){textarea.attr('rows',settings.rows);}else if(settings.height!="none"){textarea.height(settings.height);}
if(settings.cols){textarea.attr('cols',settings.cols);}else if(settings.width!="none"){textarea.width(settings.width);}
$(this).append(textarea);return(textarea);}},select:{element:function(settings,original){var select=$('<select />');$(this).append(select);return(select);},content:function(data,settings,original){if(String==data.constructor){eval('var json = '+data);}else{var json=data;}
for(var key in json){if(!json.hasOwnProperty(key)){continue;}
if('selected'==key){continue;}
var option=$('<option />').val(key).append(json[key]);$('select',this).append(option);}
$('select',this).children().each(function(){if($(this).val()==json['selected']||$(this).text()==$.trim(original.revert)){$(this).attr('selected','selected');}});}}},addInputType:function(name,input){$.editable.types[name]=input;}};$.fn.editable.defaults={name:'value',id:'id',type:'text',width:'auto',height:'auto',event:'click.editable',onblur:'cancel',loadtype:'GET',loadtext:'Loading...',placeholder:'Click to edit',loaddata:{},submitdata:{},ajaxoptions:{}};})(jQuery);