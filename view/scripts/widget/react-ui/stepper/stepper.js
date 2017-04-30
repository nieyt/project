const DISABLED = 'disabled';
const SYMBOL = 'Symbol';
class ReactStepper extends React.Component{
    constructor(...args) {
        super(...args);
        this.state = {
            value: 0,
            min: null,
            max: Number.MAX_VALUE,
            step: 1,
            subtractClassName: 'Symbol',
            addClassName: 'Symbol',
            valueClassName: '',
            onChange:()=>{

            }
        }
    }
    componentWillMount(){

    }
    componentWillReceiveProps(nextProps){
        Object.assign(this.state,nextProps);
    }
    componentDidMount(){
        this.initClassName();
    }
    initClassName(){
        let subtractClassName = SYMBOL;
        let addClassName = SYMBOL;
        if(this.props.value === this.state.min){
            subtractClassName = `${SYMBOL} ${DISABLED}`;
        }
        if(this.props.value === this.state.max){
            addClassName = `${SYMBOL} ${DISABLED}`;
        }
        this.setState({subtractClassName,addClassName})
    }
    triggerClick(flag){
        this[`method${flag}`]().then(()=>{
            let ret = this.state.onChange(this.state.value);
            var addClassName,subtractClassName;
            if(ret === false){
                if(flag === 'Add'){
                    addClassName = SYMBOL;
                    this.setState({
                        value: this.props.value,
                        addClassName
                    });
                }
                if(flag === 'Subtract'){
                    subtractClassName = SYMBOL;
                    this.setState({
                        value: this.props.value,
                        subtractClassName
                    });
                }
            }
        });
    }
    methodSubtract(){
        const SUBTRACT = 'Substract';
        return new Promise((resolve,reject)=>{
            if(this.state.min === null || this.props.value > this.state.min){
                this.setState({
                    value : this.state.value - this.state.step
                },()=>{
                    this.updateClassName(resolve,this.state.min,SUBTRACT);
                });
            }else{
                resolve(this.state.value);
            }
        })
    }
    methodAdd(){
        const ADD = 'Add';
        return new Promise((resolve,reject)=>{
            if(this.props.value < this.state.max){
                this.setState({
                    value : this.props.value + this.state.step
                },()=>{
                    this.updateClassName(resolve,this.state.max,ADD);
                });
            }else{
                resolve(this.state.value);
            }
        });
    }
    updateClassName(resolve,referenceValue,flag){
        let addClassName,valueClassName,subtractClassName= '';
        resolve(this.state.value);
        if(flag === 'Add'){
            if(this.props.value + 1 != referenceValue){
                addClassName = subtractClassName = SYMBOL;
            }else{
                addClassName = `${SYMBOL} ${DISABLED}`;
                subtractClassName = SYMBOL;
                valueClassName = DISABLED;
            }
        }else{
            if(this.props.value - 1 != referenceValue){
                addClassName = subtractClassName = SYMBOL;
            }else{
                subtractClassName = `${SYMBOL} ${DISABLED}`;
                addClassName = SYMBOL;
                valueClassName = DISABLED;
            }
        }
        this.setState({
            addClassName,
            valueClassName,
            subtractClassName
        })
    }
    render(){
        return (
            <div class="numOfRoom">
                <ins className={this.state.subtractClassName} onClick={this.triggerClick.bind(this,'Subtract')}>-</ins>
                <ins>{this.props.value}</ins>
                <ins className={this.state.addClassName} onClick={this.triggerClick.bind(this,'Add')}>+</ins>
            </div>
        )
    }
}

export default ReactStepper