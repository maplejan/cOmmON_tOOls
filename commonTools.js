//一个乱七八糟&无视IE系列的公共方法库

function CommonTools() {
    var _self = this;

    _self.vendor = function() {
        var obj = {
                webkit: "webkitTransform",
                Moz: "MozTransition",
                O: "OTransform"
            },
            style = document.body.style;
        for(key in obj) {
            if(obj[key] in style) {
                return [key, "-" + key.toLowerCase() + "-"];
            }
        }
    }();

    //陀螺仪支持检测
    _self.supportsOrientationChange = window.onorientationchange === null ? true : false;
    _self.orientationEventName = _self.supportsOrientationChange ? 'orientationchange' : 'resize';

    //touch事件支持检测
    _self.isTouch = 'ontouchstart' in window;
    _self.startEvent = "touchstart";
    _self.moveEvent = "touchmove";
    _self.endEvent = "touchend";
    if(!_self.isTouch) {
        _self.startEvent = "mousedown";
        _self.moveEvent = "mousemove";
        _self.endEvent = "mouseup";
    }

    //IOS检测
    _self.isMobileSafari = navigator.userAgent.match(/(ipad|iphone|ipod).*mobile.*Safari/i);
    //是否UC浏览器
    _self.isUC = navigator.appVersion.indexOf("UC") != -1;

    _self.ajax = {
        JSONP: function(url, success, error) {
            var callbackName = "callbackJSONP" + Math.random()*1E20,
                script = document.createElement("script");
            window[callbackName] = function(data) {
                window.valueJSONP = data;
                delete window[callbackName];
            }
            script.className = "jsonp_" + Math.random()*1E20;
            script.src = url + "&cb=window." + callbackName + "&__=" + Math.random();
            document.body.appendChild(script);
            script.onload = function() {
                success(window.valueJSONP);
                script.parentNode.removeChild(script);
                delete window.valueJSONP;
            };
            script.onerror = function() {
                error();
            }
        },

        getJSON: function(url, success, error) {
            var xhr = new XMLHttpRequest();
            url += (url.indexOf("?") > -1 ? "&" : "?") + "__=" + Math.random();
            function stateChange() {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        result = JSON.parse(xhr.responseText);
                        success(result);
                    } else {
                        error();
                    }
                }
            }
            xhr.onreadystatechange = stateChange;
            xhr.open("get", url, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.send();
        }
    };

    _self.css = {
        //设置transform css方法
        transform: function(elem, str) {
            elem.style[_self.vendor[0] + "Transform"] = str;
            return elem;
        },

        //设置transition css方法
        transition: function(elem) {
            var str = "";
            if(arguments.length > 1) {
                str = [].slice.call(arguments, 1).join(",");
            }
            elem.style[_self.vendor[0] + "Transition"] = str;
            return elem;
        }
    };

    //通用方法
    _self.fn = {
        removeElement: function(elem) {
            return elem.parentNode != null ? elem.parentNode.removeChild(elem) : false;
        },

        addClass: function(elem, name){
            var cls = elem.className,
                classList = [];
            name = name.split(/\s+/g);
            for(var i = 0, l = name.length; i < l; i++) {
                if (cls.indexOf(name[i]) == -1) {
                    classList.push(name[i]);
                }
            }
            classList.length && (elem.className += (cls ? " " : "") + classList.join(" "))
            return elem;
        },

        removeClass: function(elem, name){
            if (name === undefined) {
                elem.className = '';
                return elem;
            }
            var classList = elem.className;
            name = name.split(/\s+/g);
            for(var i = 0, l = name.length; i < l; i++) {
                var regx = new RegExp('(^|\\s)' + name[i] + '(\\s|$)');
                classList = classList.replace(regx, " ");
            }
            elem.className = classList.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
            return elem;
        }

    };

    _self.event = {
        //获取事件 touch/mouse 的位置
        client: function(e, path) {
            var str = "client" + path;
            if(_self.isTouch) {
                _self.client = function(e, path) {
                    var str = "client" + path;
                    return e.targetTouches[0][str];
                }
                return e.targetTouches[0][str];
            } else {
                _self.client = function(e, path) {
                    var str = "client" + path;
                    return e[str];
                }
                return e[str];
            }
        }
    };

    //扩展对象方法
    _self.extend = function(target){
        [].slice.call(arguments, 1).forEach(function(source) {
            for (key in source)
                if (source[key] !== undefined)
                    target[key] = source[key]
        });
        return target;
    };

    _self.extend(_self.extend, {
        tipBox: function(url) {//IOS弹窗提示方法
            var num = parseInt(localStorage.getItem("isFirst"));
            num = isNaN(num) ? 0 : num;
            if(_self.isMobileSafari && num < 3) {
                var tipBoxDom = document.createElement("div"),
                    img = document.createElement("img");
                tipBoxDom.className = "tipBox";
                tipBoxDom.appendChild(img);
                tipBoxDom.onclick = function() {
                    _self.transition(tipBoxDom, "opacity", 0.5, "ease", 0);
                    tipBoxDom.style.opacity = 0;
                    setTimeout(function() {
                        tipBoxDom.parentNode.removeChild(tipBoxDom);
                        localStorage.setItem("isFirst", ++num);
                    }, 500)
                }
                img.src = url;
                img.onload = function() {
                    document.body.appendChild(tipBoxDom);
                }
            }
        }
    });

}

