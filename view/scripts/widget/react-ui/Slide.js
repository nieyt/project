
class Slide extends React.Component{
    constructor(...args) {
        super(...args);
        this.state = {
            currentStepLength: 0
        }
    }

    componentDidMount(){
        var scroll = this.refs.scroll;
        this.init();
        scroll.addEventListener("touchstart",this.start);
        scroll.addEventListener("touchmove",this.move);
        scroll.addEventListener("touchend",this.end);
    }

    init(){
        //Slide总长度
        this.countWidth = this.refs.scroll.offsetWidth;
        //跟着point走的根基线
        this.baseLine = this.refs.baseLine;
        this.marginLeft = parseInt(this.refs.scroll.getBoundingClientRect().left);

        //设置默认值
        var calcV = parseInt(this.props.defaultValue/this.props.max*100);
        var moveX = (calcV/100*this.countWidth);
        //根基线百分比设置
        this.baseLine.style.width = (calcV+1)+"%";
        this.refs.point.style.webkitTransform = `translate3d(${moveX}px,0,0)`;


    }

    startMove=(moveX)=>{
        var calcV = parseInt(moveX/this.countWidth*100);
        var steplength = this.setStep(this.props.max,calcV);
        calcV = steplength/this.props.max*100;
        moveX = (calcV/100*this.countWidth);
        //根基线百分比设置
        this.baseLine.style.width = (calcV+1)+"%";
        this.refs.point.style.webkitTransform = `translate3d(${moveX}px,0,0)`;
    }

    //控制步长
    setStep=(max,calcV)=>{
        //步长算法: 取整(进度百分比*最大值/步长刻度)*步长刻度
        var  steplength  = parseInt(parseInt(calcV/100*max)/this.props.steplength)*this.props.steplength;
        if(max == parseInt(calcV/100*max)){
            steplength = max;
        }
        this.state.currentStepLength = steplength
        return steplength;
    }

    start=ev=>{
        ev.preventDefault();
        var e = ev.changedTouches[0];
        var moveX = -this.marginLeft+e.pageX;
        this.startMove(moveX);

    }

    move=ev=>{
        ev.preventDefault();
        var e = ev.changedTouches[0];
        var moveX = -this.marginLeft+e.pageX;
        //滑动边界设置
        if(moveX < 0){
            moveX = 0;
        }else if(moveX > this.countWidth ){
            moveX = this.refs.scroll.offsetWidth;
        }
        this.startMove(moveX);
        this.props.moveHandle && this.props.moveHandle(this.props.max-this.state.currentStepLength,this.state.currentStepLength,this.refs.scrollWarp);
    }

    end=()=>{
        this.props.changeHandle && this.props.changeHandle(this.props.max-this.state.currentStepLength,this.state.currentStepLength,this.refs.scrollWarp);
    }

    render(){
        return (
            <div className="price" ref="scrollWarp">
                <div className="scrollWarp" ref="scroll">
                    <div className="scroll">
                        <div className="bar" ref="point">
                            <div className="barInner"></div>
                        </div>
                        <div ref="baseLine" className="mask"></div>
                     </div>
                 </div>
                {this.props.children}
            </div>




        )
    }
}


export default Slide;
