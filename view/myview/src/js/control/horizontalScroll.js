/**
 * Created by Alan(000058) on 2017/03/31.
 * Email: 1480801@qq.com
 */
class horizontalScroll {
    constructor(...props) {
        this.prev = '.prev';
        this.next = '.next';
        this.switchNumber = 0;
        this.nowLeft = 0;
        $.extend(this, ...props);
        this.init();
        this.bindHandle();
    }

    init() {
        this.wrapWidth = this.wrap.outerWidth();
        this.ul = this.wrap.find('ul');
        this.list = this.ul.find('li');
        this.itemWidth = this.list.outerWidth(true);
        this.ul.width(this.itemWidth * this.list.size());
        this.switchNumber = this.viewNumber = Math.ceil(this.wrapWidth / this.itemWidth);
        this.prev.addClass('end');
    }

    bindHandle() {
        this.prev.on('click', () => {
            if (this.nowLeft >= 0) {
                this.prev.addClass('end');
                return;
            }
            --this.switchNumber;
            this.nowLeft += this.itemWidth;
            this.next.removeClass('end');
            this.ul.animate({marginLeft: this.nowLeft});
        });
        this.next.on('click', () => {
            if (this.switchNumber >= this.list.length) {
                this.next.addClass('end');
                return;
            }
            ++this.switchNumber;
            this.nowLeft -= this.itemWidth;
            this.prev.removeClass('end');
            this.ul.animate({marginLeft: this.nowLeft});
        });
    }
}
export default horizontalScroll;