import baseApp from 'baseApp';
import rest from './rest';              // 休息日表
import festival from './festival';      // 节假日表
import './calendar.css';
const ON = 'On';
let base = new baseApp;
class ReactCalendar extends React.Component{
    constructor(...args) {
        super(...args);
        this.params = {
            defaultValue: new Date,                     // 默认值
            festivals:festival,                         // 节假日
            rest: rest,                                 // 休息日
            //price:null,
            onChange:function(){},
            minDate:null,
            maxDate:null,
            disabled:false,
            exceptions:null,
            panel:new Date
        }
        this.params = Object.assign({},this.params,this.props);
        this.state= {
            panel: this.props.defaultValue || this.props.panel || this.params.panel,
            price: 0,
            number:30,
            exceptions:null,
            selectDay:!!this.props.defaultValue && new Date(this.props.defaultValue.getFullYear(),this.props.defaultValue.getMonth(),this.props.defaultValue.getDate())
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            selectDay:!!nextProps.defaultValue && new Date(nextProps.defaultValue.getFullYear(),nextProps.defaultValue.getMonth(),nextProps.defaultValue.getDate()),
            panel: nextProps.defaultValue || this.props.panel || this.state.panel
        });
    }
    componentWillMount(){
        this.updateNumber(this.state.panel);
    }
    changeMonth(flag,className){
        if(className.indexOf(ON) === -1){
            return;
        }
        let panel = this.state.panel;
        let date = flag === 0 ? base.getPreMonth(panel) : base.getNextMonth(panel);
        this.setState({
            panel:date
        });
        this.updateNumber(date);
    }
    /*
    * 计算当月共有多少天
    * */
    updateNumber(date){
        var number = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
        this.setState({number});
    }
    triggerClick(now){
        let key = base.formatDate(now,'yyyy/MM/dd').format;
        this.setState({
            selectDay: now,
            price:this.props.price ? this.props.price[key] : undefined
        },()=>{
            this.props.onChange({
                date:now,
                price:this.state.price
            });
        });
    }
    renderCalendarList(){
        var li = [];
        let panel = this.state.panel;
        let start = new Date(panel.getFullYear(),panel.getMonth(),1).getDay();
        let selectDay = this.state.selectDay;
        let disabledClass = this.props.disabled ? ['dateGray']:[''];
        li.push(new Array(start).fill(<li></li>));
        if(this.props.minDate){
            this.props.minDate.setHours(0);
            this.props.minDate.setMinutes(0);
            this.props.minDate.setSeconds(0);
        }
        if(this.props.maxDate){
            this.props.maxDate.setHours(23);
            this.props.maxDate.setMinutes(59);
            this.props.maxDate.setSeconds(59);
        }
        for(let i =0;i<this.state.number;i++){
            let now = new Date(panel.getFullYear(),panel.getMonth(),i+1);
            var className = [disabledClass];
            if(this.props.exceptions && this.props.exceptions.length){
                for(var j in this.props.exceptions){
                    this.props.exceptions[j].setHours(0);
                    this.props.exceptions[j].getMinutes(0);
                    this.props.exceptions[j].getMinutes(0);
                    if(now.getTime() == this.props.exceptions[j].getTime()){
                        className = [];
                        break;
                    }
                }
            }
            // 检查是否已有置灰样式
            let hasGrayClass = className.indexOf('dateGray') > -1;
            // 区间判断

            if(this.props.minDate && now < this.props.minDate && !hasGrayClass){
                className = className.concat(['dateGray'])
            }

            if(this.props.maxDate && now > this.props.maxDate && !hasGrayClass){
                className = className.concat(['dateGray'])
            }
            if(selectDay && now.getTime() == selectDay.getTime()){
                className.push('dataChecked');
            }
            className = className.join(' ');
            let needBindEvent = className.indexOf('dateGray') > -1 ? false : true;
            li.push(<li className={className} onClick={needBindEvent && this.triggerClick.bind(this,now)}>{this.renderCalendarContent(now,i)}</li>);
        }
        return li;
    }
    /*
    * 渲染日历框中的内容
    * @param now : 日历框的当前时间
    * @ i 比日历框的当前数字
    * */
    renderCalendarContent(now,i){
        let ar = [];
        let key = base.formatDate(now,'yyyy/MM/dd').format;
        let fesKey = base.formatDate(now,'MM/dd').format;
        // 休息
        if(this.params.rest[key]){
            ar.push(<i class="dateRest">休</i>);
        }
        // 节假日
        if(base.formatDate(new Date,'yyyy/MM/dd').format == key){
            ar.push(<span>今天</span>);
        }else if(this.params.festivals[fesKey] ||this.params.festivals[key]){
            let fes = this.params.festivals[fesKey] || this.params.festivals[key]
            ar.push(<span>{fes}</span>);
        }else{
            ar.push(<span>{i+1}</span>);
        }
        // 价格
        if(this.props.price && this.props.price[key]){
            if(this.props.price[key] == '实时计价'){
                ar.push(<i>{this.props.price[key]}</i>);
            }else{
                ar.push(<i>¥{this.props.price[key]}起</i>);
            }

        }
        return ar;
    }
    /*
    * 控制上个月、下个月的按钮样式
    * @param panelDate Date: 当前面板的日历
    * @param flag Number : 0代表左
    * */
    // 控制左右切换月的按钮样式
    updateBtn(panelDate,flag){
        let arClassName = [];
        let on = '';
        if(flag === 0){ // 左
            arClassName.push('dateUpPage');
            if(this.props.minDate){
                on  = new Date(this.props.minDate.getFullYear(),this.props.minDate.getMonth() + 1,1) <= new Date(panelDate.getFullYear(),panelDate.getMonth(),1) ? ON : '';
            }else{
                on = ON
            }
            arClassName.push(on);
        }else{
            arClassName.push('dateNextPage');
            if(this.props.maxDate){
                on  = new Date(this.props.maxDate.getFullYear(),this.props.maxDate.getMonth() - 1,1) >= new Date(panelDate.getFullYear(),panelDate.getMonth(),1) ? ON : '';
            }else{
                on = ON
            }
            arClassName.push(on);
        }
        return arClassName
    }
    render() {
        let li = this.renderCalendarList();                             // li 里的内容
        let leftClass = this.updateBtn(this.state.panel,0).join(' ');   // 左侧按钮样式
        let rightClass = this.updateBtn(this.state.panel,1).join(' ');  // 右侧按钮样式
        return (
            <div>
                <div class="dateWrap">
                    <ul class="dateWeek">
                        <li>日</li>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                    </ul>
                    <div class="dateMonth">
                        <i class={leftClass} onClick={this.changeMonth.bind(this,0,leftClass)}></i>
                        <span class="dateMonthText">
                            <span class="dateMonthText">{base.formatDate(this.state.panel,'yyyy年MM月').format}</span>
                        </span>
                        <i class={rightClass} onClick={this.changeMonth.bind(this,1,rightClass)}></i>
                    </div>
                    <ul class="dateDayList">
                        {li}
                    </ul>
                </div>
            </div>
        )
    }
}

export default ReactCalendar