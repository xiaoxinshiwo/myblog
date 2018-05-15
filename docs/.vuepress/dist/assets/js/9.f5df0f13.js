(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{56:function(r,n,_){"use strict";_.r(n);var v=_(0),b=Object(v.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var r=this,n=r.$createElement,_=r._self._c||n;return _("div",{staticClass:"content"},[_("h1",{attrs:{id:"常见的http状态码"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#常见的http状态码","aria-hidden":"true"}},[r._v("#")]),r._v(" 常见的HTTP状态码")]),_("p",[r._v("##2开头 （请求成功）表示成功处理了请求的状态代码。")]),_("p",[r._v("200   （成功）  服务器已成功处理了请求。 通常，这表示服务器提供了请求的网页。"),_("br"),r._v("\n201   （已创建）  请求成功并且服务器创建了新的资源。"),_("br"),r._v("\n202   （已接受）  服务器已接受请求，但尚未处理。"),_("br"),r._v("\n203   （非授权信息）  服务器已成功处理了请求，但返回的信息可能来自另一来源。"),_("br"),r._v("\n204   （无内容）  服务器成功处理了请求，但没有返回任何内容。"),_("br"),r._v("\n205   （重置内容） 服务器成功处理了请求，但没有返回任何内容。"),_("br"),r._v("\n206   （部分内容）  服务器成功处理了部分 GET 请求。"),_("br")]),_("p",[r._v("##3开头 （请求被重定向）表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向。")]),_("p",[r._v("300   （多种选择）  针对请求，服务器可执行多种操作。 服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择。"),_("br"),r._v("\n301   （永久移动）  请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。"),_("br"),r._v("\n302   （临时移动）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。"),_("br"),r._v("\n303   （查看其他位置） 请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。"),_("br"),r._v("\n304   （未修改） 自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。"),_("br"),r._v("\n305   （使用代理） 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。"),_("br"),r._v("\n307   （临时重定向）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。"),_("br")]),_("p",[r._v("##4开头 （请求错误）这些状态代码表示请求可能出错，妨碍了服务器的处理。")]),_("p",[r._v("400   （错误请求） 服务器不理解请求的语法。"),_("br"),r._v("\n401   （未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。"),_("br"),r._v("\n403   （禁止） 服务器拒绝请求。"),_("br"),r._v("\n404   （未找到） 服务器找不到请求的网页。"),_("br"),r._v("\n405   （方法禁用） 禁用请求中指定的方法。"),_("br"),r._v("\n406   （不接受） 无法使用请求的内容特性响应请求的网页。"),_("br"),r._v("\n407   （需要代理授权） 此状态代码与 401（未授权）类似，但指定请求者应当授权使用代理。"),_("br"),r._v("\n408   （请求超时）  服务器等候请求时发生超时。"),_("br"),r._v("\n409   （冲突）  服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息。"),_("br"),r._v("\n410   （已删除）  如果请求的资源已永久删除，服务器就会返回此响应。"),_("br"),r._v("\n411   （需要有效长度） 服务器不接受不含有效内容长度标头字段的请求。"),_("br"),r._v("\n412   （未满足前提条件） 服务器未满足请求者在请求中设置的其中一个前提条件。"),_("br"),r._v("\n413   （请求实体过大） 服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。"),_("br"),r._v("\n414   （请求的 URI 过长） 请求的 URI（通常为网址）过长，服务器无法处理。"),_("br"),r._v("\n415   （不支持的媒体类型） 请求的格式不受请求页面的支持。"),_("br"),r._v("\n416   （请求范围不符合要求） 如果页面无法提供请求的范围，则服务器会返回此状态代码。"),_("br"),r._v('\n417   （未满足期望值） 服务器未满足"期望"请求标头字段的要求。'),_("br")]),_("p",[r._v("##5开头（服务器错误）这些状态代码表示服务器在尝试处理请求时发生内部错误。 这些错误可能是服务器本身的错误，而不是请求出错。")]),_("p",[r._v("500   （服务器内部错误）  服务器遇到错误，无法完成请求。"),_("br"),r._v("\n501   （尚未实施） 服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。"),_("br"),r._v("\n502   （错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。"),_("br"),r._v("\n503   （服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。"),_("br"),r._v("\n504   （网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求。"),_("br"),r._v("\n505   （HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。"),_("br")])])}],!1,null,null,null);n.default=b.exports}}]);