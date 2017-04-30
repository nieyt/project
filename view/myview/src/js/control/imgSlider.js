/**
 * Created by Alan(000058) on 2017/03/30.
 * Email: 1480801@qq.com
 */
class imgSlider {
    constructor(...props){
        this.imgList = '.imgList';
        this.imgBtn = 'imgBtn';
        this.next = '.next';
        this.prev = '.prev';
        this.delay = 3000;
        this.showIndex = 0;
        $.extend(this, ...props);
        this.init();
        this.bindHandle();
    }
    init(){
        let wrap = this.wrap;
        this.imgList = wrap.find(this.imgList);
        this.next = wrap.find(this.next);
        this.prev = wrap.find(this.prev);
        this.imgList.children('li').eq(0).show().siblings().hide();

        this.imgBtn = $("<ul>",{"class":this.imgBtn});
        this.imgList.children('li').each((index)=>{
            let li = $("<li>");
            if(!index){
                li.addClass("hover");
            }
            this.imgBtn.append(li);
        });
        this.imgList.after(this.imgBtn);
        this.delay && this.auto();
        // $(window).on('resize',()=>{
        // }).resize();
    }

    bindHandle(){
        let _this = this;
        this.next.on('click',()=> {
            let nextIndex = this.showIndex == this.imgList.children('li').length - 1 ? 0 : this.showIndex+1;
            this.play(nextIndex);
            this.showIndex = nextIndex;
        });
        this.prev.on('click',()=> {
            let nextIndex = this.showIndex == 0 ? this.imgList.children('li').length - 1 : this.showIndex-1;
            this.play(nextIndex);
            this.showIndex = nextIndex;
        });
        this.imgBtn.children('li').on('click',function () {
            let nextIndex = $(this).index();
            _this.play(nextIndex);
            _this.showIndex = nextIndex;
        });
    }

    auto(){
        setInterval(()=>{
            let nextIndex = this.showIndex == this.imgList.children('li').length - 1 ? 0 : this.showIndex+1;
            this.play(nextIndex);
            this.showIndex = nextIndex;
        },this.delay);
    }

    play(nextIndex){
        this.imgList.children('li').eq(this.showIndex).stop(true,false).animate({opacity:0},1000,function(){
            $(this).hide();
        });
        this.imgBtn.children('li').eq(nextIndex).addClass("hover").siblings().removeAttr('class');
        this.imgList.children('li').eq(nextIndex).stop(true,true).css({opacity:0}).show().animate({opacity:1},1000);
    }
}
export default imgSlider;