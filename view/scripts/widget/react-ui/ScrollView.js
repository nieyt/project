import IScroll from "./IScroll";

// 切记:  scrollView的子类item的每一项中的元素中, 内部元素最少要有一项设置高度
// 切记:  scorllView层本身要设定高度, 否则iscroll不会触发滚动
class ScrollView extends React.Component{
    constructor(...args) {
        super(...args);
        this.state={
            scroll:null,
            updatLine:this.props.updataLine,
            scrollStatus:0,  //滚动状态,  0:正常滚动,  1:数据加载中
            loading:null,
            loadingContent:"正在加载中..."
        };
    }

    componentDidMount(){
        let wrapper = this.refs.scrollView;

        //根据传参不同, 加载不同的scroll组件
        //onDownReresh
        //onUpReresh

        let updataLine = this.props.updataLine || 0;

        this.state.scroll = new IScroll(wrapper,{
            probeType: 3,      //滚动密度,1,2,3 值越大,CPU性能消耗越大, 滚动触发的回调越频繁
            mouseWheel: false  //是否监听鼠标滚轮事件
        })
        var self = this;
        if(this.props.onDownReresh){
            this.state.scroll.on("scroll",function(){
                if(this.y <= self.state.scroll.maxScrollY){

                    if(self.state.scrollStatus == 0){
                        self.state.loadingContent = "正在加载中..."
                        //开始加载
                        self.props.onDownReresh();
                        self.state.scrollStatus = 1;
                    };
                }
            });
        }
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }

    componentDidUpdate(){
        this.state.scroll.refresh();
        this.state.updatLine += this.state.scroll.maxScrollY;
        this.state.scrollStatus = 0;
        this.state.loadingContent = "加载完成"

    }


    render(){
        if(this.props.isLoading){
            this.state.loading = <div className={this.props.loadingClass} >{this.state.loadingContent}</div>

        }

        return (
            <div ref="scrollView" className={this.props.className}   >
                <div>
                    {this.props.children}
                    {this.state.loading}
                </div>
            </div>
        )
    }
}


export default ScrollView;
