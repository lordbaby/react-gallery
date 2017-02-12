require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ImageFigure from './ImgFigure';
import ControllerUnits from './ControllerUnit';

import {getRangeRandom,get30DegRandom} from '../util/util';

//图片文件数据
let imageDatas=require('../data/imageData.json');


//let yeomanImage = require('../images/yeoman.png');

/**
 * 重新包装图片文件数据，添加图片的路径信息
 * @param  {[type]} 图片文件信息
 * @return {[type]} 包含图片路径的数据                     
 */
imageDatas=(function(imageDataArr){
	for(let i = 0 ,j = imageDatas.length; i < j; i++){
		let imageObj      =imageDatas[i];
		imageObj.imageUrl =require('../images/'+imageObj.fileName);
		imageDataArr[i]   =imageObj;
	}

	return imageDataArr;
})(imageDatas);


class AppComponent extends React.Component {
	constructor(props){
		super(props);
		this.Constant={
			//中心图片位置
			centerPos:{
				left:0,
				right:0
			},
			// 左扇区，xy的临界值
			leftSection:{
				x:[0,0],
				y:[0,0]
			},
			// 右扇区，xy的临界值
			rightSection:{
				x:[0,0],
				y:[0,0]
			},
			// 上扇区，xy的临界值
			topSection:{
				x:[0,0],
				y:[0,0]
			}
		};
		//imgsArr存放每张图片的位置信息，旋转角度信息等等
		this.state={
			imgsArr:[
				/*{
					pos:{left:0,top:0},
					rotate:0,			//旋转角度
					isInverse:false,	//是否是正反面
					isCenter:false 		//是否居中
				}*/
			]
		};

	}
	/**
	 * 重新布局所有图片
	 * @param  {[type]} centerIndex 居中图片的索引
	 * @return {[type]}             [description]
	 */
	rearrange(centerIndex){
		let {imgsArr}= this.state;
		let {centerPos,leftSection,rightSection,topSection}=this.Constant;

		//居中的图片
		let centerImgArr=imgsArr.splice(centerIndex,1);
		centerImgArr[0]={
			pos:centerPos,
			rotate:0,
			isCenter:true
		};
		/**
		 * 1.获取需要布局上扇区的图片数量，0个或者1个，50%概率
		 * 2.获取一个布局到上扇区图片的索引值（范围是0-14或者0-15）
		 */
		let top=[];
		let topNum=Math.floor(Math.random()*2); //0 or 1
		let topIndex=Math.floor(Math.random()*(imgsArr.length-topNum));
		top=imgsArr.splice(topIndex,topNum);
		//布局上扇区的图片信息
		top.forEach((val,index) =>{
			top[index]={
				pos:{
					top:getRangeRandom(topSection.y[0],topSection.y[1]),
					left:getRangeRandom(topSection.x[0],topSection.x[1])
				},
				rotate:get30DegRandom(),
				isCenter:false
			}
		});
		//布局左右两侧扇区图片信息
		for(let i=0,len=imgsArr.length,mid=len/2;i<len;i++){
			//这里只去x的临界范围，因为左右扇区的y范围一样
			let xRang= i<mid?leftSection.x:rightSection.x;
			imgsArr[i]={
				pos:{
					top:getRangeRandom(leftSection.y[0],leftSection.y[1]),
					left:getRangeRandom(xRang[0],xRang[1])
				},
				rotate:get30DegRandom(),
				isCenter:false
			};
		}

		//将上和中扇区splice出去的元素插回 state
		if(top&&top[0]){
			imgsArr.splice(topIndex,0,top[0]);
		}
		imgsArr.splice(centerIndex,0,centerImgArr[0]);
		this.setState({imgsArr});
	}
	/**
	 * 居中索引为index的图片
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	center(index){
		this.rearrange(index)
	}
	inverse(index){
		const {imgsArr} =this.state;
		imgsArr[index].isInverse=!imgsArr[index].isInverse;
		this.setState({imgsArr});
	}
	componentDidMount(){

		//舞台大小
		var stageDOM     =ReactDOM.findDOMNode(this.refs.stage),
			stageW       =stageDOM.scrollWidth,
			stageH       =stageDOM.scrollHeight,
			halfstageW   =Math.ceil(stageW/2),
			halfstageH   =Math.ceil(stageH/2);
		//imageFigure大小
		var imgFigureDOM =ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW         =imgFigureDOM.scrollWidth,
			imgH         =imgFigureDOM.scrollHeight,
			halfImgW     =Math.ceil(imgW/2),
			halfImgH     =Math.ceil(imgH/2);
		// 计算中心图片坐标
		this.Constant.centerPos={
			left:halfstageW-halfImgW,
			top:halfstageH-halfImgH
		}

		// 计算左扇区的临界值
		this.Constant.leftSection.x[0]  =-halfImgW;
		this.Constant.leftSection.x[1]  =halfstageW-3*halfImgW;
		this.Constant.leftSection.y[0]  =-halfImgH;
		this.Constant.leftSection.y[1]  =stageH-halfImgH;
		// 计算右扇区的临界值
		this.Constant.rightSection.x[0] =halfstageW+halfImgW;
		this.Constant.rightSection.x[1] =stageW-halfImgW;
		this.Constant.rightSection.y[0] =this.Constant.leftSection.y[0];
		this.Constant.rightSection.y[1] =this.Constant.leftSection.y[1];
		// 计算上扇区临界值
		this.Constant.topSection.y[0]   =-halfImgH;
		this.Constant.topSection.y[1]   =halfstageH-halfImgH*3;
		this.Constant.topSection.x[0]   =halfstageW-imgW; //中轴线往左一个图片宽度
		this.Constant.topSection.x[1]   =halfstageW;	   //中轴线（注意left值是以左边为准）
		
		this.rearrange(0);
	}

	render() {

	  	const controllerUnits =[],
	  			imgFigures    =[];

	  	imageDatas.forEach((val,index) =>{
	  		if(!this.state.imgsArr[index]){
	  			this.state.imgsArr[index]={
	  				pos:{
	  					left:0,
	  					top:0
	  				},
	  				rotate:0,
	  				isInverse:false,
	  				isCenter:false
	  			}
	  		}
	  		let commonProps ={
	  			key:index,
	  			arrange:this.state.imgsArr[index],
	  			inverse:this.inverse.bind(this,index),
	  			center:this.center.bind(this,index)
	  		}
	  		imgFigures.push(<ImageFigure data={val} {...commonProps} ref={'imgFigure'+index} />);
			controllerUnits.push(<ControllerUnits {...commonProps} />)
	  	});
	    return (
	      <section className="stage" ref="stage">
	      	<section className="img-sec">
	      		{imgFigures}
	      	</section>
	      	<nav className="controller-nav">
	      		{controllerUnits}
	      	</nav>
	      </section>
	    );
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
