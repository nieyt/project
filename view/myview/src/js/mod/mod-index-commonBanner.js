/**
 * Created by Alan(000058) on 2017/04/06.
 * Email: 1480801@qq.com
 */
class commonBanner {
    constructor(...props) {
        $.extend(this, ...props);
        this.loading = new AjaxLoading();
        this.noData = new noDataShow();
        this.init();
    }

    init() {
        let that = this;
        this.wrap.each(function (index, obj) {
            $(obj).find('.moreProduce [data-TagID]').on('click', function () {
                let tid = $(this).attr("data-TagID");
                $(this).addClass('on').siblings().removeAttr('class');
                that.loadPro(tid, $(obj).find('.productList'));
            }).eq(0).trigger('click');
        });
    }

    loadPro(TagID, list) {
        // console.log(TagID, list);
        let that = this;
        list.empty();
        $.ajax({
            url: that.api,
            data: {productTagID: TagID},
            beforeSend(){
                that.loading.open({"maskClass": "hide", target: list});
            },
            success(data){
                let html = [];
                $.each(data.Data.MarketProducts, function (index, item) {
                    html.push(that.disposeDom(item));
                });
                if (!html.length) {
                    list.empty();
                    that.loading.open({isLoading: false, target: list, "content": "没有找到相关推荐"});
                } else {
                    list.html(html);
                    $('[data-src]',list).lazyload();
                }
            }
        });
    }

    disposeDom(item) {
        let dom_item = $("<li>"),
            dom_link = $("<a>", {"class": "p_img_box", "target": "_blank"}).attr("href", item.Url),
            tag_cls = "";
        //typeBlue自由行  typeRed爆款推荐
        dom_link.html(`<div class="span type${tag_cls}">${item.Tag}</div>
                        <img src="${this.config._CONFIG_[this.config.__webState].imgUrl + "/imgDefault.png"}" data-src="${item.PictureUrl}">
                        <p class="title">${item.Name}</p>
                        <p class="priceMod"><span class="priceDetail"><i class="font">¥</i><i class="price">${item.Price}</i><i class="font02">／人起</i></span></p>
                    `);
        dom_item.html(dom_link);
        return dom_item;
    }

}

export default commonBanner;