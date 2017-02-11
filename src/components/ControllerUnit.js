import React ,{ Component} from 'react';
import classNames from 'classnames';

export default class ControllerUnit extends Component{
	handleClick(e){
 		if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
	}

	render(){
		const spanClass=classNames({
			'controller-unit':true,
			'is-center':this.props.arrange.isCenter,
			'is-inverse':this.props.arrange.isInverse
		})
		return (
			<span className={spanClass} onClick={this.handleClick.bind(this)}></span>
		);
	}
}