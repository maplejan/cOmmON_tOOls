//一个乱七八糟的公共方法库

function CommonTools() {
    var _self = this;

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

    _self.ajax = {
        //JSONP方法
        JSONP: function(url, callback) {
            window.callbackJSONP = function(data) {
                window.valueJSONP = data;
                delete window.callbackJSONP;
            }
            var script = document.createElement("script");
            script.className = "jsonp_" + Math.random()*1E20;
            script.src = url + "&callback=window.callbackJSONP";
            document.body.appendChild(script);
            script.onload = function() {
                callback(window.valueJSONP);
                script.parentNode.removeChild(script);
                delete window.valueJSONP;
            };
            script.onerror = function() {
                console.log("接口异常！")
            }
        }
    };

    _self.css = {
        //translate3d css方法
        translate3d: function(elem, x, y, z) {
            var str = "translate3d(" + x + "," + y + "," + z + ")";
            elem.style.WebkitTransform = str;
            elem.style.MozTransform = str;
            elem.style.OTransform = "translate(" + x + "," + y + ")"; //Opera 12.5- unsupported 3D
            elem.style.transform = str;
            return elem;
        },
        //transition css方法
        transition: function(elem, cssProperty, duration, funStr, delay) {
            var str = cssProperty + " " + duration + "s " + funStr + " " + delay + "s ",
                time = (duration + delay) * 1000;
            elem.style.WebkitTransition = "-webkit-" + str;
            elem.style.MozTransition = "-moz-" + str;
            elem.style.OTransition = "-o-" + str;
            elem.style.transition = str;
            setTimeout(function() {
                elem.style.WebkitTransition = "";
                elem.style.MozTransition = "";
                elem.style.OTransition = "";
                elem.style.transition = "";
            }, time)
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

