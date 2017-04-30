//配置部分
//ajax请求池
export const __webState = window.cdnBasePath?"ol":"debug";//根据页面是否存在cdnBasePath来判断是否是测试或线上环境，以及测试环境
export var API={
    baseUrl:__webState=="ol"?"/":"http://dev.ceair.com/",
    //酒店接口
    travel:{
        GetProductDatePrice:'api/Product/GetProductDatePrice',//获取产品日期价格
        SubmitProductBooking: 'api/Product/SubmitProductBooking', //提交预定订单信息
        Keyword:'api/Hotel/SearchHotelSelector',//修改酒店 筛选项
        GetDynamicHotelList:'api/Hotel/GetDynamicHotelList', //静态产品的动态酒店
        GetDynamicMoreRoomList:'api/Hotel/GetDynamicHotelMoreRoomList', //静态产品的动态酒店获取更多房型
        GetSegmentHotelListByKey:'api/Product/GetSegmentHotelListByKey',//静态产品的静态酒店
        GetHotelList:'api/Product/GetHotelList',//动态产品
        GetDynamicHotelMoreRoomList:'api/Product/GetDynamicHotelMoreRoomList', //动态产品获取更多房型
        GetProductResourceItems:'api/Product/GetProductResourceItems',
        list:{
            GetSearchProductFilter:'api/product/GetSearchProductFilter',
            GetSearchProductList:'api/product/GetSearchProductList'
        },
        ticket:{
            GetAirPlaneTicketListByKey:"api/Product/GetAirPlaneTicketListByKey",//静态产品静态机票接口
            GetDepartureFightList:"api/Flight/GetDepartureFightList",//请求静态产品动态去程航班列表接口
            GetReturnTripFlightList:"api/Flight/GetReturnTripFlightList",//请求静态产品动态返程航班列表接口
            GetGoFightList:"api/ProductApi/GetGoFightList",//请求动态产品动态去程接口
            GetBackFightList:"api/ProductApi/GetBackFightList",//请求动态产品动态返程接口
            SubmitProductResourceChange:"api/Product/SubmitProductResourceChange",//请求提交静态产品接口
            SearchProductList:"api/ProductApi/SearchProductList",//请求提交动态产品接口
        }
    },
    //City API List
    city:{
        GetHotCityList:'api/City/GetHotCityList'
    },
    //ProductAPIList
    product:{
        detail: 'api/Product/GetProductDetails',
        IndexMarketProduct:'api/Market/GetMarketProducts', //首页推荐产品
        SearchProductList: 'api/Product/SearchProductList', //首GetDepartureCityList页动态搜索机+酒产品
        GetIndexProductList: 'api/Product/GetIndexProductList', //获取推荐产品列表
        Booking: 'api/Product/Booking',							//获取用户预订信息
        ProductList: 'api/Product/GetStaticProductList',  //获取首页产品列表
        GetGoFightList: 'api/Product/GetGoFightList', //根据航班搜索条件获取航班去程列表
        GetBackFightList: 'api/Product/GetBackFightList', //根据航班搜索条件获取航班返程列表
        GetProductDatePrice: 'api/Product/GetProductDatePrice',//获取产品日期价格
        SubmitSelectedProduct: 'api/Product/SubmitSelectedProduct', //动态提交选择的产品
        SearchProductListByKey: 'api/Product/SearchProductListByKey', //动态提交选择的产品根据key
        GetRoomIsSellOut: 'api/Product/GetRoomIsSellOut', //判断房间是否有余量
        GetTicketPrice: 'api/Product/GetTicketPrice', //获取门票的价格
        SubmitProductBooking: 'api/Product/SubmitProductBooking', //提交预定订单信息
        SubmitProductResourceChange: 'api/Product/SubmitProductResourceChange', //提交产品资源更改
        GetDepartureCityList: 'api/City/GetDepartureCityList',  //出发城市
        GetDestinationCityList: 'api/City/GetDestinationCityList',  //到达城市
        GetTravelCityListByFuzzyQuery: 'api/city/GetTravelCityListByFuzzyQuery',  //模糊查询
        GetCityInfoListByCountryID: 'api/City/GetCityInfoListByCountryID',  //根据国家获得城市 用于匹配模糊查询
        GetProductDepCityList: 'api/City/GetProductDepCityList',   //国家接口 用户模糊匹配  guojiajiekou
        GetProductResourcePrice:'api/Product/GetProductResourcePrice',   //获取门票产品资源价格
        GetTransferList:'api/DDTransfer/GetTransferList',   //滴滴接送机列表
        GetRideTypeList:'api/DDTransfer/GetRideTypeList',    //获取运力类型列表
        SubmitTransferInfo:'api/DDTransfer/SubmitTransferInfo',	//提交接送机信息
        GetDynamicDefaultFlight:'api/Flight/GetDynamicDefaultFlight',//静态产品获取动态机票默认航班
        GetDepartureFightList:'api/Flight/GetDepartureFightList', //获取动态去程机票列表
        GetReturnTripFlightList:'api/Flight/GetReturnTripFlightList',//获取动态返程机票列表
        GetDynamicDefaultHotel:'api/Hotel/GetDynamicDefaultHotel',//获取静态产品动态酒店默认酒店
        Keyword:'/api/Hotel/SearchHotelSelector',//修改酒店 筛选项
        GetDynamicHotelList:'api/Hotel/GetDynamicHotelList', //静态产品的动态酒店
        GetDynamicMoreRoomList:'api/Hotel/GetDynamicHotelMoreRoomList', //静态产品的动态酒店获取更多房型
        GetSegmentHotelListByKey:'api/Product/GetSegmentHotelListByKey',//静态产品的静态酒店
        GetHotelList:'api/Product/GetHotelList',//动态产品
        GetDynamicHotelMoreRoomList:'api/Product/GetDynamicHotelMoreRoomList', //动态产品获取更多房型
        GetProductResourceItems:'api/Product/GetProductResourceItems',
        GetProductRelation:'api/Product/GetProductRelation'//获得产品关联
    }
};
export const URL={
    //获取url各种参数
    parseUrl:function(url){
        let r = {
            protocol: /([^\/]+:)\/\/(.*)/i,
            host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
            port: /\:?([^\/]*)(\/?.*)/,
            pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
        };
        let tmp, res = {},p;
        res["href"] = url;
        for (p in r) {
            tmp = r[p].exec(url);
            res[p] = tmp[1];
            url = tmp[2];
            if (url === "") {
                url = "/";
            }
            if (p === "pathname") {
                res["pathname"] = tmp[1];
                res["search"] = tmp[2];
                res["hash"] = tmp[3];
            }
        }
        return res;
    },
    //获取url参数
    parse_url:function(url){
        var pattern = /(\w+)=([^\#&]*)/ig;
        var parames = {};
        url.replace(pattern, function(attr, key, value){
            parames[key] = decodeURI(value);
        });
        return parames;
    }
};
let urlHost = URL.parseUrl(window.location),urlOrigin = urlHost.protocol +"//"  +urlHost.host+":" +urlHost.port;
export const _CONFIG_ = {
    airCityJson:__webState=="ol"?window.cdnBasePath+"/json/airCity.json":urlOrigin+ "/travel/pc/dest/json/airCity.json",
    debug:{     //本地调试地址
        HOST_URL: urlOrigin + "/travel/pc/dest/",//静态资源地址
        index:'//www.ceair.com',
        travelIndex:urlOrigin+"/travel/pc/dest/index.html",//首页
        resource:"//localhost:10130/PC",//静态资源地址
        imgUrl:"//localhost:10130/PC/images",//图片路径前一段
        login:"https://passport.ceair.com/cesso/login.html?redirectUrl=",//登陆地址
        ordersList:urlOrigin+"/travel/pc/dest/orderList.html",//订单列表页
        ordersDetail:urlOrigin+"/travel/pc/dest/orderDetail.html",//订单详情页
        travelList:urlOrigin+"/travel/pc/dest/List.html",//酒店列表页
        SelectProduct_URL:urlOrigin+"/travel/pc/dest/selectProduct.html",//动态查询产品页面
        travelDetail:urlOrigin+"/travel/pc/dest/detail.html",//酒店详情页
        fillOrder:urlOrigin+"/travel/pc/dest/fillOrders.html",//填写订单页
        success:urlOrigin+"/travel/pc/dest/success.html",//支付成功页
        modifyTicket:urlOrigin+"/travel/pc/dest/ticket.html",//修改机票页面
        modifyHotel:urlOrigin+"/travel/pc/dest/modifyHotel.html",//修改机票页面
        ProductFill_URL:urlOrigin+"/travel/pc/dest/productFillInfro.html",//修改机票页面
        transfer_URL:urlOrigin+"/travel/pc/dest/transfer.html",//接送机
    },
    ol: { //发布环境地址配置
        HOST_URL:window.cdnBasePath+"/",//静态资源地址
        index:'//www.ceair.com',
        travelIndex:urlOrigin+"/Index",//首页
        resource:"//192.168.1.150:10130/PC",//静态资源地址
        imgUrl:"//192.168.1.150:10130/PC/images",//图片路径前一段
        login:"https://passport.ceair.com/cesso/login.html?redirectUrl=",//登陆地址
        ordersList:urlOrigin+"/OrderList",//订单列表页
        ordersDetail:urlOrigin+"/OrderDetail",//订单详情页
        hotelList:urlOrigin+"/List",//酒店列表页
        hotelDetail:urlOrigin+"/",//酒店详情页
        SelectProduct_URL:"/DynamicProduct",//动态查询产品页面
        success:urlOrigin+"/Success",//支付成功页
        staticDetail:"true",//产品详情页是否静态化
        travelList:urlOrigin+"/list",//产品列表
        travelDetail:urlOrigin+"/detail/",//产品详情页
        modifyTicket:urlOrigin+"/ticketlist",//修改机票页面
        modifyHotel:urlOrigin+"/hotellist",//修改酒店
        transfer_URL:"/TransportList",//接送机
        ProductFill_URL:urlOrigin+"/orderfill",//酒店填写订单页
    }
};