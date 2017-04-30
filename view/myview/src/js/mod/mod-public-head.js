/**
 * Created by 孙爱祥 on 2016/4/14.
 */
//让ie9以下的浏览器支持html标签
import 'es5';
!function (e) {
    function t(e) {
        if ("[object Function]" != Object.prototype.toString.call(e))throw"callback is not function"
    }
    function a(e) {
        if ("[object Array]" != Object.prototype.toString.call(e))throw"param is not string list"
    }
    e.AsyncLock = function (e, n, i, r) {
        "function" == typeof n && (r = i, i = n, n = []), a(e), a(n), t(i), this.lockList = e, this.callback = i, this.arguments = n, this.thisObj = r || null
    }, AsyncLock.prototype.Unlock = function (e) {
        for (var t = 0; t < this.lockList.length; t++)this.lockList[t] === e && this.lockList.splice(t, 1);
        0 == this.lockList.length && null != this.callback && (this.callback.apply(this.thisObj, this.arguments), this.callback = null)
    }, AsyncLock.prototype.getLock = function () {
        return this.lockList
    }, AsyncLock.prototype.run = function (e, n, i) {
        if ("function" == typeof e && (i = n, n = e, e = []), a(e), t(n), 0 == this.lockList.length)n.apply(i, e); else {
            var r = this.callback;
            this.callback = function () {
                r.apply(this, arguments), n.apply(i, e)
            }
        }
    }
}(window), function () {
    for (var e = "abbr|address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|menuitem|nav|progress|ruby|section|summary|time|video|fieldset|dir".split("|"), t = 0; t < e.length; t++)document.createElement(e[t])
};
!function () {
    try
    {
        'undefined' == typeof(document.body.style.maxHeight) && ($("body").prepend("<div id='ie6_tips' class='blue font14'>您的浏览器版本过低，推荐您升级您的浏览器，升级后可享受更好的体验。<input type='button' class='button big' value='立即升级>' style='width:150px;' onclick=location.href='http://www.ceair.com/explore_update.html' /></div>"),$("#ie6_tips").slideDown())
    }catch(e){

    }
}();
var Login = function () {
    function e(e, t) {
        return t = t || {}, r.call(t, "membership") && (e += "&membership=" + t.membership), e
    }

    function t(e) {
        var t = new AsyncLock(["user", "loginMode", "loginCheck"], [], function () {
            this.username = i.username, this.mobileNo = i.mobileNo, this.tier = i.tier, this.serverTime = n.server, this.localTime = n.local, this.LoginCheck = o.LoginCheck, this.LoginMode = o.LoginMode, this.ipPosition = o.ipPosition
        }, this);
        this.asyn = t, e = e || {}, this.local = e.local || "zh_CN";
        var i = {}, n = {}, o = {};
        $.getLoginMode = function (e) {
            o.LoginMode = e, t.Unlock("loginMode")
        }, $.getUser = function (e) {
            i = e, n.server = e.time || n.server, n.local = new Date, t.Unlock("user"), -1 == c.indexOf(location.host) && (o.LoginCheck = "" != e.username, t.Unlock("loginCheck"))
        }, $.fullLoginCheck = function (e) {
            o.LoginMode = e.loginModel || "";
            var a = new Date(e.time);
            n.server = a.valueOf() ? a : new Date, n.local = new Date, o.tier = i.tier = e.tier || "", o.mobileNo = i.mobileNo = e.mobileNo || "", o.username = i.username = e.username || "", o.LoginCheck = i.LoginCheck = "true" == e.message, o.ipPosition = "" == e.ipPosition ? "SHA" : e.ipPosition, t.Unlock("loginCheck"), t.Unlock("loginMode"), t.Unlock("user")
        };
        var a = function () {
            $.getScript(h.fullLoginCheck)
        };
        return a()
    }

    var i = '<iframe id="centerWindow" frameborder="0" style="z-index:1000;position:fixed;left:{{left}}px;top:{{top}}px;border-radius: 5px; box-shadow: 0 0 10px #666;" height="{{height}}px" width="{{width}}px" src="{{src}}"></iframe>', n = '<div id="divMask" style="z-index:999;position:fixed;left:0;top:0;width:{{width}}px;height:{{height}}px;opacity:0.4;-moz-opacity:0.4;filter:alpha(opacity=40);background:#000;"></div>', o = "https://passport.ceair.com/cesso/login.html?redirectUrl={{redirectUrl}}&ltv={{LoginMode}}&local={{local}}", a = '<div id="popClose" style="left:{{left}}px;top:{{top}}px;z-index:1001;position:fixed; width:20px;height:20px;line-height:18px;text-align:center;font-weight:bold;cursor: pointer;font-size:14px;font-family:arial;">X</div>', c = c || "http://www.ceair.com";
    t.callbackList = {};
    var r = Object.prototype.hasOwnProperty, s = function () {
        var e = n.replace("{{width}}", $(window).width()).replace("{{height}}", $(window).height());
        $("body").append(e)
    }, l = function (e, t, n) {
        var o = ($(window).width() - t) / 2, a = ($(window).height() - n) / 2, c = i.replace("{{left}}", o.toString()).replace("{{top}}", a.toString()).replace("{{height}}", n).replace("{{width}}", t).replace("{{src}}", e);
        $("body").append(c)
    }, u = function () {
        var e = $(window).width() / 2 + 280, t = $(window).height() / 2 - 143, i = a.replace("{{left}}", e).replace("{{top}}", t);
        $("body").append(i), $("#popClose").click(function () {
            $("#centerWindow,#popClose,#divMask").remove(), $.isFunction(window.loginClose) && window.loginClose()
        })
    };
    $(window).resize(function () {
        var e = $(window).width(), t = $(window).height(), i = $("#centerWindow").height(), n = $("#centerWindow").width();
        $("#centerWindow").css({
            top: (t - i) / 2 + "px",
            left: (e - n) / 2 + "px"
        }), $("#popClose").css({top: t / 2 - 139 + "px", left: e / 2 + 275 + "px"}), $("#divMask").width(e).height(t)
    });
    var p = function (e, t, i) {
        s(), l(e, t, i), u()
    }, h = {
        userInfo: c + "/member/auth!getUserInfo.shtml?_=" + Math.random(),
        LoginMode: c + "/member/auth!getLoginMode.shtml?_=" + Math.random(),
        LoginCheck: c + "/member/auth!loginCheck.shtml?_=" + Math.random(),
        fullLoginCheck: c + "/member/auth!fullLoginCheck.shtml?_=" + Math.random(),
        quitLogin: c + "/member/auth!logout.shtml?_=" + Math.random(),
        login_popup: "https://passport.ceair.com/cesso/login_popup.html?{{callback}}&site=1&isAlert=1&ltv={{LoginMode}}&redirectUrl={{redirectUrl}}&local={{local}}&&_toDo=top.Login.callbackList.{{callback}}()"
    };
    return t.prototype.popupLogin = function (i, n) {
        this.asyn.run([i], function (i) {
            var o = this;
            if (this.LoginCheck)return "function" == typeof i ? i() : null;
            var a = "callback" + Math.ceil(1e3 * Math.random()), c = h.login_popup.replace("{{LoginMode}}", this.LoginMode).replace("{{redirectUrl}}", "http://" + location.host + "/LoginCallback.html?" + a).replace("{{local}}", this.local).replace("{{callback}}", a);
            c = e(c, n), t.callbackList[a] = function () {
                $("#centerWindow,#popClose,#divMask").remove(), i.call(o)
            }, p(c, 610, 300)
        }, this)
    }, t.prototype.quit = function (e) {
        $.getScript(h.quitLogin, e)
    }, t.prototype.getUserName = function (e) {
        this.asyn.run([e], function (e) {
            e(this.username)
        }, this)
    }, t.prototype.getMobileNo = function (e) {
        this.asyn.run([e], function (e) {
            e(this.mobileNo)
        }, this)
    }, t.prototype.getTier = function (e) {
        this.asyn.run([e], function (e) {
            e(this.tier)
        }, this)
    }, t.prototype.getLoginCheck = function (e) {
        this.asyn.run([e], function (e) {
            e(this.LoginCheck)
        }, this)
    }, t.prototype.getServerTime = function (e) {
        this.asyn.run([e], function (e) {
            var t = new Date, i = t - this.localTime;
            e(new Date(this.serverTime.valueOf() + i))
        }, this)
    }, t.prototype.getLoginURL = function (t, i) {
        this.asyn.run([t], function (t) {
            var n = o.replace("{{redirectUrl}}", encodeURIComponent(location.href)).replace("{{LoginMode}}", this.LoginMode).replace("{{local}}", this.local);
            n = e(n, i), t(n)
        }, this)
    }, t.prototype.getIpPosition = function (e) {
        this.asyn.run([e], function (e) {
            e(this.ipPosition)
        }, this)
    }, t
}(), login = new Login;
!function () {
    function e() {
        $("#header").on("click.login", "#m_quit", function () {
            login.quit(function () {
                window.location.href = "http://www.ceair.com/"
            })
        })
    }

    var t = '<figure class="myceair"><span><a href="http://www.ceair.com/myceair/">{{.name}}</a> | <a href="javascript:void(0)" id="m_quit">退出</a></span></figure>', i = '<figure class="myceair"><span><a href="{{.loginUrl}}" id="login">登录</a> | <a href="http://easternmiles.ceair.com/mpf/#/sign/register" target="_blank" id="register">注册</a></span></figure>';
    login.getLoginCheck(function (n) {
        var o;
        n ? (o = t.replace("{{.name}}", login.username), $("#header .myceair").replaceWith(o), e()) : login.getLoginURL(function (e) {
            o = i.replace("{{.loginUrl}}", e), $("#header .myceair").replaceWith(o)
        })
    })
}(), function () {
    function e() {
        $("a").on("mouseover", function () {
            var e = this.href;
            -1 == e.indexOf(".ceair.com") && -1 != e.indexOf("http") && $(this).attr("target", "_blank")
        })
    }

    function t() {
        $('input[type="text"]:enabled:visible').on("focus", function () {
            $(this).select()
        })
    }

    function i() {
        for (var e = 0, t = ["ceair.com", "ce-air.com", "95530.com", "flychinaeastern.com", "shanghai-air.com", "cu-air.com", "chinaeastern.com", "flychinaeastern.us", "travelsky.com", "172.20.32.200", "172.25.100.50"], i = "您现在可能访问到了假冒东航官网的钓鱼网站，请访问东航官方域名www.ceair.com", n = 0; n < t.length && -1 == location.host.indexOf(t[n]); n++)e++;
        return e == t.length ? (alert(i, function () {
            location.href = "http://www.ceair.com"
        }), !1) : void 0
    }

    function n() {
        $("#float-box .erweima").on("mouseover", function () {
            $(this).find("em").fadeIn("normal")
        }), $("#float-box .erweima").on("mouseleave", function () {
            $(this).find("em").fadeOut("normal")
        })
    }

    var o = function () {
        return function (e) {
            login.getServerTime(function (t) {
                e.now = new Date(t).valueOf(), e.start = new Date(e.start).valueOf(), e.end = new Date(e.end).valueOf(), e.start < e.now && e.now < e.end ? e.doSomething() : e.now > e.end && e.cancel()
            })
        }
    }();
    o({
        start: "2015/11/06 00:00:00", end: "2015/11/12 00:00:00", doSomething: function () {
            $("#header .logo h2").append("<div class='ewm-clk'></div>")
        }, cancel: function () {
            $("#header .ewm-clk").remove()
        }
    }), e(), t(), i(), n()
}(), function (e) {
    function t(t) {
        var i = this, n = e.trim(i.val());
        return n == t ? !1 : ("" == n ? (i.addClass(o), i.val(t)) : i.removeClass(o), !0)
    }

    function i(t) {
        var i = this, n = e.trim(i.val());
        return n != t && n.length > 0 ? !1 : (i.is("." + o) && i.val("").removeClass(o), !0)
    }

    function n(e) {
        var n = this;
        n.on("blur." + o, function () {
            t.call(n, e)
        }), n.on("focus." + o, function () {
            i.call(n, e)
        })
    }

    var o = "contentTips";
    e.fn.prompt = function (i) {
        var a = e(this);
        if (!a.is("input[type=text]"))throw"这不是一个输入框！";
        e.trim(a.val()) == i ? a.addClass(o) : t.call(this, i), n.call(this, i)
    }
}(jQuery), function () {
    var e, t = new AsyncLock(["city"], new Function), i = {
        QUNAR_IPS: "QUNAR_IPS",
        SINA_IPS: "SINA_IPS"
    }, n = i.SINA_IPS, o = !0;
    window.ips = {
        success: function (i) {
            e = i, t.Unlock("city")
        }
    }, window.IPS = function (a, c) {
        if (1 == o) {
            switch (n) {
                case i.QUNAR_IPS:
                    $.getScript("http://ws.qunar.com/ips.jcp?callback=ips.success");
                    break;
                case i.SINA_IPS:
                    $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function () {
                        window.ips.success({city: window.remote_ip_info.city})
                    });
                    break;
                default:
                    window.ips.success({city: "上海"})
            }
            o = !1
        }
        t.run(function () {
            if ("[object Function]" == Object.prototype.toString.call(a))a(e.city); else {
                var t = a.filter("title", e.city);
                c(1 == t.length ? t[0] : t[0])
            }
        })
    }
}();
var mvc_config = {
    fn_map: {
        dnDateSelectCalendar: "/resource2/js/disney/j.dnDateSelectCalendar.js",
        dnDateSelectInit: "/resource2/js/disney/j.dnDateSelectInit.js",
        dnProductSelectMvc: "/resource2/js/disney/j.dnProductSelectMvc.js",
        dnHome: "/resource2/js/disney/j.dnHome.js",
        dnHotSearch: "/resource2/js/disney/j.dnHotSearch.js",
        dnPromo: "/resource2/js/disney/j.dnPromo.js",
        paySuccess: "/resource3/js/PaySuccess/j.mvc.PaySuccess.js",
        orderStatus: "/resource3/js/PaySuccess/j.mvc.orderStatus.js",
        talentGift: "/resource3/js/PaySuccess/j.mvc.talentGift.js",
        meals: "/resource3/js/PaySuccess/j.mvc.meals.js",
        cuss: "/resource3/js/PaySuccess/j.mvc.cuss.js",
        asr: "/resource3/js/PaySuccess/j.mvc.asr.js",
        airportService: "/resource3/js/PaySuccess/j.mvc.airportList.js",
        flightList: "/resource4/js/server/j.mvc.flightList.js",
        myInfoCenter: "/resource3/js/myceair/j.myinfoCenter.js",
        JSONView: "http://www.ceair.com/resource4/js/public/base/json.view.js",
        advertisement: "http://www.ceair.com/resource3/js/public/widget/j.advertisement.mvc.min.js",
        memberInfo: "/resource4/js/myceair/memberInfo.js",
        couponSearch: "/resource4/js/myceair/couponSearch.js",
        tpInfo: "/resource4/js/taopiao/tpInfo.js",
        overview: "/resource4/js/myceair/overview.js",
        memberInfoEdit: "/resource4/js/myceair/memberInfoEdit.js",
        errorInfo: "/resource4/js/myceair/errorInfo.js"
    }
}, _cemvc = _cemvc || [];
!function () {
    function e() {
        var e = 0, i = !1;
        this.queue = [], this.param_queue = {}, this.fn = {}, this.loadingFnFlag = {}, this.setAsync = function (e) {
            i = e
        }, this.push = function () {
            var i = this, n = arguments[0];
            e = t.call(i.queue, n), i.start()
        }, this.start = function () {
            var e = this, t = this.queue;
            if (0 == t.length)return !1;
            try {
                for (var i = 0; i < t.length; i++) {
                    var n = t[i], o = n[0], a = n[1], c = n[2];
                    e.run(o, a, c)
                }
                t = e.queue = []
            } catch (r) {
                t = e.queue = []
            }
        };
        var n = function (e) {
            var t = mvc_config.fn_map, i = document.createElement("script");
            i.async = !0, i.type = "text/javascript", i.src = t[e] + "?_=" + Math.random(), document.getElementsByTagName("body")[0].appendChild(i)
        };
        this.run = function (e, t, i) {
            var o = this;
            if ("string" != typeof e)return !1;
            var a = i || function () {
                };
            o.fn[e] ? (a(o.fn[e].call(this, t)), console.log(e + " is defined")) : o.loadingFnFlag[e] ? o.param_queue[e].push({
                queue: t,
                callback: a
            }) : (o.loadingFnFlag[e] = !0, o.param_queue[e] = o.param_queue[e] || [], o.param_queue[e].push({
                queue: t,
                callback: a
            }), n(e))
        }, this.runOrderList = function (e) {
            for (var t = 0, i = _cemvc.param_queue[e].length; i > t; t++) {
                var n = _cemvc.param_queue[e].shift();
                n.callback(_cemvc.fn[e].call(this, n.queue))
            }
        }
    }

    var t = Array.prototype.push;
    if ("[object Array]" == Object.prototype.toString.call(_cemvc) || "undefined" == typeof _cemvc) {
        var i = new e;
        i.queue = "undefined" == typeof _cemvc ? [] : _cemvc, _cemvc = i, _cemvc.start()
    }
}(), function () {
    var e = function (e) {
        var t = document.createElement("script");
        t.async = !0, t.type = "text/javascript", t.src = e, document.getElementsByTagName("body")[0].appendChild(t)
    };
    $("[id*=filter-]").length > 0 && e("http://www.ceair.com/resource3/js/siteserver/advertiseData.js")
}(), function () {
    var e = {
        menu_0: "home",
        booking: "flight",
        flight: "flight",
        fh: "flight",
        car: "flight",
        taopiao: "flight",
        pnr: "flight",
        flight2014: "flight",
        myceair: "myceair",
        order: "myceair",
        apply: "myceair",
        member: "myceair",
        talent: "myceair",
        coupon: "myceair",
        guide: "guide",
        guide2: "guide",
        aoc: "selfservice",
        server: "selfservice"
    }, t = "home", i = new RegExp("//"), n = location.href.replace(i, "");
    if (i = new RegExp("\\/[^/]+(?=\\/|\\.)"), !n.match(i))return $("#header nav ul.menu").find("li[id='home']").addClass(""), !1;
    t = n.match(i)[0].replace("/", "");
    var o = e[t];
    $("#header nav ul.menu").find("li[id='" + o + "']").addClass("current")
}(), function () {
    var e = $("#header .menu"), t = $("#header nav li, #header menu article"), i = $("#header");
    i.on("mouseover", "nav li", function () {
        var t = $(this).attr("data-rel");
        $(this).addClass("active"), e.addClass("hover"), i.find("nav li").removeClass("active"), i.find("menu article").removeClass("active1"), i.find("menu article#" + t).addClass("active1")
    }), i.on("mouseover", "menu article", function () {
        var t = $(this).attr("id");
        $(this).addClass("active"), e.addClass("hover"), i.find("nav li").removeClass("active"), i.find("nav li[data-rel='" + t + "']").addClass("active")
    }),$("#header section").on("mouseout", function () {
        t.removeClass("active1"); e.removeClass("hover");e.find('li').removeClass('active');}),
        $("#header menu").on("mouseleave", function () {
        t.removeClass("active1"); e.removeClass("hover");e.find('li').removeClass('active');}),
        i.on("mouseleave", function () {
            t.removeClass("active1"); e.removeClass("hover");e.find('li').removeClass('active');})
        /* $("body>:not(#header),#header section").on("mouseover", function () {
        t.removeClass("active1"); e.removeClass("hover");})*/
    ,$("[id='linkHolidayOrder']").on("click", function () {
        window.open("http://vacations.ceair.com/vacation/user/orderList.htm")
    }), $("header .menu a[href*=http],header menu a[href*=http]").click(function () {
        window._gaq = window._gaq || [], window._gaq.push(["_trackEvent", "click header menu", login.LoginCheck + "|" + ($.cookie("passportId") || "New USER"), this.innerText])
    })
}(),function () {
    var e = {
        cn: '<option value="http://www.ceair.com/">简体中文</option>',
        en: '<option value="http://en.ceair.com/">English</option>',
        tw: '<option value="http://tw.ceair.com/">繁体中文 </option>',
        hk1: '<option value="http://ck.ceair.com/">繁体中文</option>',
        hk2: '<option value="http://hk.ceair.com/">English</option>',
        jp: '<option value="http://jp.ceair.com/">日语</option>',
        kr: '<option value="http://kr.ceair.com/">한국어</option>',
        ca: '<option value="http://ca.ceair.com/">English</option>',
        au: '<option value="http://au.ceair.com/">English</option>',
        uk: '<option value="http://uk.ceair.com/">English</option>',
        us: '<option value="http://us.ceair.com/">English</option>',
        fr: '<option value="http://fr.ceair.com/">Français</option>',
        de: '<option value="http://de.ceair.com/">Deutsch</option>',
        it: '<option value="http://it.ceair.com/">Italiano</option>',
        ru: '<option value="http://ru.ceair.com/">Русский</option>',
        sg: '<option value="http://sg.ceair.com/">English</option>',
        ph: '<option value="http://ph.ceair.com/">English</option>'
    }, t = {
        cn: ["cn", "en"],
        tw: ["tw"],
        hk1: ["hk1", "hk2"],
        jp: ["jp"],
        kr: ["kr"],
        ca: ["ca"],
        au: ["au"],
        uk: ["uk"],
        us: ["us"],
        fr: ["fr"],
        de: ["de"],
        it: ["it"],
        ru: ["ru"],
        sg: ["sg"],
        ph: ["ph"]
    };
    $("header #language select[name=country]").change(function () {
        var i = $(this).attr("value"), n = $('header #language select[name="language"]'), o = n.attr("region");
        if (i == o)return !1;
        var a, c = "";
        for (a in t[i])c += e[t[i][a]];
        n.html(c), n.attr("region", i)
    }), $('header #language input[name="confirm"]').click(function () {
        window.open($('header #language select[name="language"]').val())
    }), $("header #language").click(function (e) {
        $(this).addClass("active"), e.stopPropagation(), $("body").on("click.language", ":not(#language)", function () {
            $("header #language").removeClass("active"), $("body").off("click.language")
        })
    })
}(), function () {
    function e(e) {
        return e.replace(/<|>/g, function (e) {
            switch (e) {
                case"<":
                    return "&lt;";
                case">":
                    return "&gt;"
            }
        })
    }

    function t() {
        var t = $("#" + l), i = $("#" + s);
        0 != t.length && t.remove(), 0 != i.length && i.remove();
        var n = {
            title: this.escape ? e(this.title) : this.title,
            message: this.escape ? e(this.message) : this.message,
            type: c[this.type] || c.information,
            cancel: "undefined" != typeof this.cancel ? r : ""
        }, o = jsonView(n, u);
        $("body").append(o);
        var a, p, h = $(window).height(), d = $(window).width();
        t = $("#" + l), i = $("#" + s), a = h / 3, p = (d - i.width()) / 2, i.css({
            top: a,
            left: p
        }), t.css("filter", "alpha(opacity=40)").fadeIn(400, function () {
            i.show(0, function () {
                i.find(".ico").animate({left: "10px"}, 360, function () {
                    i.find(".text").animate({opacity: "1"}, 240)
                })
            })
        })
    }

    function i() {
        var e = $("#" + s), t = this;
        e.find("#okay").click(function () {
            0 != t.confirm(this) && t.close()
        }), e.find("#cancel").click(function () {
            0 != t.cancel() && t.close()
        }), e.find(".close").click(function () {
            t.close()
        }), e.find(".title").mousedown(function (e) {
            var t = $("#" + s), i = t.offset();
            i.top -= $(window).scrollTop();
            var n = {x: e.pageX, y: e.pageY};
            $("body").on("mousemove." + s, function (e) {
                t.css({top: i.top - n.y + e.pageY, left: i.left - n.x + e.pageX})
            }), $("body").mouseup(function () {
                $("body").off("mousemove." + s)
            })
        })
    }

    function n() {
        $("#" + s).fadeOut(200, function () {
            $("#" + l).fadeOut(200, function () {
                $("#" + s).remove(), $("#" + l).remove()
            })
        })
    }

    function o(e) {
        try {
            _gaq.push(["_trackEvent", "alert", login.LoginCheck + "|" + ($.cookie("passportId") || "New USER"), e])
        } catch (t) {
        }
    }

    function a(e, a, c, r, s, l) {
        if ("undefined" != typeof s && "[object Function]" !== Object.prototype.toString.call(s))throw"回调函数类型不是一个Function!";
        if ("undefined" != typeof l && "[object Function]" !== Object.prototype.toString.call(l))throw"回调函数类型不是一个Function!";
        r = "undefined" == typeof r || r, this.title = e || document.title, this.message = a || "", this.type = c, this.escape = r, this.cancel = l, this.method = {
            show: t,
            close: n,
            bind: i,
            confirm: s || new Function,
            cancel: l || new Function,
            trackEvent: o
        }
    }

    var c = {
        yes: "blue_yes",
        question: "blue_question",
        information: "blue_i",
        error: "red_no",
        alert: "red_alert"
    }, r = "<input type='button' id='cancel' class='button gray' value='取 消' />", s = "MessageBox", l = s + "-Shield", u = '<div id="' + l + '"></div>                                          <div id="' + s + '">                                            <div class="title {{.type}}">                                                <div class="ico"></div>                                                  <div class="text" onselectstart="return false">{{.title}}</div>        <div class="close"></div>                                            </div>                                                                   <div class="content {{.type}}">                                                        <b>{{.message}}</b>                                                      <span>                                                                       <input type="button" id="okay" class="button" value="确 定">                {{.cancel}}                                                          </span>                                                              </div>                                                               </div>                                                                   ';
    a.prototype.show = function () {
        return this.method.trackEvent(this.message), this.method.show.apply(this, arguments)
    }, a.prototype.close = function () {
        return this.method.close.apply(this, arguments)
    }, a.prototype.bind = function () {
        return this.method.bind.apply(this, arguments)
    }, a.prototype.confirm = function () {
        return this.method.confirm.apply(this, arguments)
    }, a.prototype.cancel = function () {
        return this.method.cancel.apply(this, arguments)
    }, window.MessageBox = function (e, t, i, n, o, c, r) {
        var s = new a(e, t, i, n, o, c);
        return 1 != r && (s.show(), s.bind()), s
    }, window.MessageBox.yes = "yes", window.MessageBox.question = "question", window.MessageBox.information = "information", window.MessageBox.error = "error", window.MessageBox.alert = "alert"
}(), function () {
    var e = new function () {
        var e = {
            CNY: "￥",
            USA: "$",
            POINT: '<img src="/resource2/images/icon_point.gif" />',
            JF: '<img src="/resource2/images/icon_point.gif" />',
            DJF: '<img src="/resource2/images/icon_point.gif" />',
            MJF: '<img src="/resource2/images/icon_point.gif" />'
        };
        this.price = function (e) {
            return e = (e + "").split(".")[0], e.split("").reverse().join("").replace(/\d{3}/g, "$&,").replace(/,$/, "").split("").reverse().join("")
        }, this.currency = function (t) {
            return e[t] || ""
        }, this.curr_price = function (e, t) {
            var i = this.currency(e), n = this.price(t);
            return i + " " + n
        }
    };
    window.PriceOut = e
}(), function () {
    function e(e) {
        var n = $(e);
        if (!n.is("select"))throw n + "无法将一个不是select选择器的模块转换成iSelect样式！";
        var o = {
            id: "_I_SELECT_ID_" + i++,
            name: n.attr("name"),
            def_display: n.find("option:selected").text(),
            def_value: n.val(),
            "class": n.attr("class"),
            style: (n.attr("style") || "").replace('"', ""),
            option: []
        };
        return n.find("option").each(function () {
            o.option.push({display: this.text, value: this.value})
        }), n.replaceWith(jsonView(o, t)), $("#" + o.id)
    }

    var t = '<figure class="i-select" id={{.id}}><input type="text" class="input display {{.class}}" style="{{.style}}" value="{{.def_display}}" readonly/><input type="hidden" name="{{.name}}" value="{{.def_value}}"/><ol><json:for select=".option"><li data-value="{{.value}}">{{.display}}</li></json:for></ol></figure>', i = 0;
    $.fn.iSelect = function (t) {
        $(this).each(function () {
            var i, n, o = e(this);
            o.find("input.display").click(function () {
                $("figure.i-select").css("z-index", 9), o.css("z-index", 10);
                var e = o.find("input[type='hidden']").val();
                o.find("li").removeClass("active"), o.find("li[data-value=" + e + "]").addClass("active"), o.find("ol").slideDown("fast")
            }), o.on("blur", function () {
                var e = $(this);
                setTimeout(function () {
                    e.find("ol").slideUp("normal")
                }, 100)
            }), o.find("li").click(function () {
                i = (this.textContent || this.innerText) + (t ? " " + t : ""), n = this.dataset && this.dataset.value || $(this).attr("data-value"), o.find("input.display").val(i), o.find("input[type=hidden]").val(n), o.find("ol").hide()
            })
        })
    }, $("label.i-radio").on("click", function () {
        var e = $(this).find("input[type=radio]").attr("name");
        $("input[type='radio'][name='" + e + "']").removeAttr("checked"), $("input[type='radio'][name='" + e + "']").parents("label").removeClass("checked"), $(this).find("input[type=radio]").attr("checked", !0), $(this).addClass("checked")
    }), $("label.i-checkbox").on("click", function () {
        var e = $(this).find("input[type=checkbox]");
        e.is(":checked") ? (e.removeAttr("checked"), $(this).removeClass("checked")) : (e.attr("checked", !0), $(this).addClass("checked"))
    })
}();