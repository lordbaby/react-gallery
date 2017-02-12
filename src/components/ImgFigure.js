
import React ,{ Component } from 'react';
import classNames from 'classnames';

export default class ImgFigure extends Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	/**
	 * imgFigure点击处理函数
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleClick(e){
		//中心图片则翻转 否则居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
        e.preventDefault();
	}
	getImageStyle(){
		const styleObj=this.props.arrange.pos||{};
		if(this.props.arrange.rotate){
			const prefixArr= ['MozTransform','MsTransform','WebkitTransform','transform'];
			prefixArr.forEach((val)=>{
				styleObj[val]=`rotate(${this.props.arrange.rotate}deg)`;
			});
		}
		if(this.props.arrange.isCenter){
			styleObj.zIndex=11;
		}

		return styleObj;

	}
	render(){
		
		const styleObj=this.getImageStyle();

		const figureClass=classNames({
			'img-figure':true,
			'is-inverse':this.props.arrange.isInverse
		});

		const data=this.props.data;

		return (
			<figure className={figureClass} style={styleObj} onClick={this.handleClick}> 
				<img src={data.imageUrl} alt={data.title} style={{'width':'300px','height':'200px'}}/>
				<figcaption>
					<h2 className="img-title">{data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>{data.desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}