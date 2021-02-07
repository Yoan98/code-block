<!--
 * @Description: 用于图片编辑
 * @Date: 2021-02-07 10:11:19
 * @LastEditors: dashuaibi
 * @LastEditTime: 2021-02-07 10:19:42
-->
<template>
	<div class="container" @touchmove.stop.prevent="">
		<movable-area class="movable-area" :style="{width: width + 'rpx', height: height * 2 + 'rpx'}">
			<movable-view :style="{width: width + 'rpx', height: height + 'rpx',position:'absolute',top: movableViewOffestTop + 'rpx'}" :direction="currentDrawType === 1 ? 'all' : 'none'" :scale="currentDrawType === 1" scale-max="1" class="movable-view" @scale="handleCanvasScale">
					<canvas class="canvas" canvas-id="myCanvas" @touchstart="handleToutchStart" @touchmove="handleToutchMove" @touchend="handleToutchEnd"></canvas>
			</movable-view>
		</movable-area>
		<div class="menu" v-show="isShowMenu">
			<div class="menu-item" @click="handleChangeType(0)">
				<image src="../../static/img/draw-line.png" :style="{transform: currentDrawType === 0 ? 'scale(1.5)' : 'scale(1.0)'}"></image>
				<div class="drawStyle" v-show="currentDrawType === 0" @click.stop=''>
					<div class="drawPoint"></div>
					<div class="drawStyle-item" @click="setCurrentLineWidth(2)">
						<div class="drawStyle-weight" :style="{width: '5px',height: '5px',backgroundColor: currentLineWidth === 2 ? 'green' : 'gray'}"></div>
					</div>
					<div class="drawStyle-item" @click="setCurrentLineWidth(4)">
						<div class="drawStyle-weight" :style="{width: '10px',height: '10px',backgroundColor: currentLineWidth === 4 ? 'green' : 'gray'}"></div>
					</div>
					<div class="drawStyle-item" @click="setCurrentLineWidth(6)">
						<div class="drawStyle-weight" :style="{width: '15px',height: '15px',backgroundColor: currentLineWidth === 6 ? 'green' : 'gray'}"></div>
					</div>
					<div class="drawStyle-item" @click="setCurrentLineColor('red')">
						<div class="drawStyle-color" :style="{backgroundColor: 'red',transform: currentLineColor === 'red' ? 'scale(1.5)' : 'scale(1.0)'}"></div>
					</div>
					<div class="drawStyle-item" @click="setCurrentLineColor('black')">
						<div class="drawStyle-color" :style="{backgroundColor: 'black',transform: currentLineColor === 'black' ? 'scale(1.5)' : 'scale(1.0)'}"></div>
					</div>
					<div class="drawStyle-item" @click="setCurrentLineColor('orange')">
						<div class="drawStyle-color" :style="{backgroundColor: 'orange',transform: currentLineColor === 'orange' ? 'scale(1.5)' : 'scale(1.0)'}"></div>
					</div>
				</div>
			</div>
			<div class="menu-item" @click="handleChangeType(1)">
				<image src="../../static/img/gesture-scale.png" :style="{width: '25px',height: '25px',transform: currentDrawType === 1 ? 'scale(1.5)' : 'scale(1.0)'}"></image>
			</div>
			<div class="menu-item" @click="handleChangeType(2)">
				<image src="../../static/img/rubber.png" :style="{transform: currentDrawType === 2 ? 'scale(1.5)' : 'scale(1.0)'}"></image>
			</div class="menu-item">
			<div @click="clear" class="menu-item">
				<u-icon name="reload" color="black" size="17"></u-icon>
			</div>
			<div @click="isShowModalSubmit = true" class="menu-item">
				<u-icon name="checkmark" color="green" size="17"></u-icon>
			</div>
			<div @click="isShowModalClose = true" class="menu-item">
				<u-icon name="close" color="red" size="15"></u-icon>
			</div>


		</div>
		<u-mask :show="true" z-index="100"></u-mask>
		<div class="edit">
			<u-icon name="edit-pen" @click="isShowMenu = !isShowMenu" size="25" :color="isShowMenu ? 'red' : 'gray'"></u-icon>
		</div>
		<u-modal :title-style="{'font-size':'18rpx','padding-top': '10rpx'}" :content-style="{'font-size':'18rpx','padding':'10rpx'}" :confirmStyle="{'font-size':'18rpx','line-height': '40rpx','height': '40rpx'}"
		 :cancelStyle="{'font-size':'18rpx','line-height': '40rpx','height': '40rpx'}" width="300"
		 :show-cancel-button="true" v-model="isShowModalClose" content="确认关闭当前编辑吗？" @cancel="isShowModalClose = false" @confirm="close"></u-modal>
		<u-modal :title-style="{'font-size':'18rpx','padding-top': '10rpx'}" :content-style="{'font-size':'18rpx','padding':'10rpx'}" :confirmStyle="{'font-size':'18rpx','line-height': '40rpx','height': '40rpx'}"
			 :cancelStyle="{'font-size':'18rpx','line-height': '40rpx','height': '40rpx'}" width="300"
			 :show-cancel-button="true" v-model="isShowModalSubmit" content="确认提交当前批注吗？" @cancel="isShowModalSubmit = false" @confirm="save"></u-modal>
		
	</div>
</template>

<script>
	import {
		BASE_URL
	} from '@/config/index.js';
	import {
		pathToBase64,
		base64ToPath
	} from '@/api/gsq-image-tools/image-tools/index.js';
	export default {
		props: ['src','width','height'],
		watch: {
			src(val, oldVal) {
				console.log(val)
				this.initBackgroundImg(val)
			}
		},
		computed:{
			movableViewOffestTop(){
				const screenHeight = this.getScreenInfo().screenHeight
				return (this.height * 2 - screenHeight) / 2
			},
		},
		mounted() {
			// 初始化画布
			this.ctx = uni.createCanvasContext('myCanvas', this);
			// 设置绘制的宽高
			const widthOffset = 70 // 此处为画布与image的宽度偏移量
			const heightOffset = 70 // 此处为画布与image的高度偏移量
			this.drawWidth = this.width + widthOffset
			this.drawHeight = this.height + heightOffset
			// 初始化背景图片
			this.initBackgroundImg(this.src)
		},
		data() {
			return {
				ctx: '', //绘图图像的实例
				points: [], //路径点集合(手势相关的)
				currentDrawType: 0, // 当前选中标绘手势 0标绘 1手势放大缩小 2 橡皮擦
				BASE_URL: BASE_URL,
				currentLineWidth: 4, // 当前标绘粗细程度 分为 2 4 6
				currentLineColor: 'red', // 当前标绘颜色为 red black orange
				scale: 1, // 当前缩放大小的比例
				isShowMenu: true, // 是否显示菜单
				isShowModalClose: false, // 是否显示modal关闭提示
				isShowModalSubmit: false, // 是否显示modal提交提示
			}
		},
		methods: {
			// 手势放大缩小
			handleCanvasScale(e) {
				// 设置当前缩放大小的比率
				this.scale = e.detail.scale
			},
			// 设置当前标绘颜色
			setCurrentLineColor(val) {
				this.currentLineColor = val
				this.ctx.strokeStyle = this.currentLineColor;
			},
			// 设置当前标绘的宽度
			setCurrentLineWidth(val) {
				this.currentLineWidth = val
				this.ctx.lineWidth = this.currentLineWidth;
			},
			// 初始化底层图片
			initBackgroundImg(src) {

				const isHttp = this.getIsHttpUrl(src)
				const x = 0
				const y = 0
				//设置画笔样式
				this.ctx.lineWidth = this.currentLineWidth
				this.ctx.lineCap = "round"
				this.ctx.lineJoin = "round"
				this.ctx.strokeStyle = this.currentLineColor
				// 判断传进来的地址是否为http
				if (isHttp) {
					this.getUrlPath(src).then((res) => {

						this.ctx.drawImage(res.path, x, y, this.drawWidth, this.drawHeight);
						this.ctx.draw()
					})
				} else {
					// 当做base64处理
					this.ctx.drawImage(src, x, y, this.drawWidth, this.drawHeight);
					this.ctx.draw()
				}
			},
			// 判断路径是否为http
			getIsHttpUrl(url) {
				const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
				return reg.test(url)
			},
			// 标绘类型切换
			handleChangeType(type) {
				this.currentDrawType = type
				if (this.currentDrawType === 0) {
					this.ctx.globalCompositeOperation = "source-over";
					this.ctx.lineWidth = this.currentLineWidth
				} else if (this.currentDrawType === 2) {
					this.ctx.globalCompositeOperation = "destination-out";
					this.ctx.lineWidth = 10
				}
			},
			// 获取屏幕宽高
			getScreenInfo() {
				let obj = null
				uni.getSystemInfo({
					success(res) {
						obj = res
					}
				})
				return obj
			},
			// 将http请求图片转成临时本地路径
			getUrlPath(src) {
				return new Promise(resolve => {
					uni.getImageInfo({
						src,
						success: function(image) {
							resolve(image)
						}
					});
				})

			},
			//清空画布
			clear() {
				this.handleChangeType(0)
				this.initBackgroundImg(this.src)
			},
			handleToutchStart(e) {
				if (!this.isShowMenu) return
				if (this.currentDrawType === 0) {
					// 手势标绘
					let startX = e.changedTouches[0].x;
					let startY = e.changedTouches[0].y;
					let startPoint = {
						X: startX,
						Y: startY
					};
					//由于uni对canvas的实现有所不同，这里需要把起点存起来
					this.points.push(startPoint); //存点		
					//每次触摸开始，开启新的路径				
					this.ctx.beginPath();
				} else if (this.currentDrawType === 2) {
					let startX = e.changedTouches[0].x;
					let startY = e.changedTouches[0].y;
					this.ctx.moveTo(startX / this.scale, startY / this.scale)
				}

			},
			handleToutchMove(e) {
				if (!this.isShowMenu) return
				if (this.currentDrawType === 0) {
					// 手势标绘
					let moveX = e.changedTouches[0].x;
					let moveY = e.changedTouches[0].y;
					let movePoint = {
						X: moveX,
						Y: moveY
					};
					this.points.push(movePoint);
					let len = this.points.length;
					if (len >= 2) {
						//绘制路径
						this.draw();
					}
				} else if (this.currentDrawType === 2) {
					this.ctx.globalCompositeOperation = "destination-out";
					let moveX = e.changedTouches[0].x;
					let moveY = e.changedTouches[0].y;
					this.ctx.arc(moveX / this.scale, moveY / this.scale, 10, 0, 2 * Math.PI);
					this.ctx.fill()
					// this.ctx.globalCompositeOperation = "destination-over";
					// this.ctx.drawImage(this.src, 0, 0, this.drawWidth, this.drawHeight);
					this.ctx.draw(true)
				}
			},
			handleToutchEnd(e) {
				if (!this.isShowMenu) return
				if (this.currentDrawType === 0) {
					// 手势标绘
					this.points = [];
					
				}else if(this.currentDrawType === 2){
					this.ctx.globalCompositeOperation = "destination-over";
					this.ctx.drawImage(this.src, 0, 0, this.drawWidth, this.drawHeight);
					this.ctx.draw(true)
				}
			},
			// 绘制线条
			draw() {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X / this.scale, point1.Y / this.scale)
				this.ctx.lineTo(point2.X / this.scale, point2.Y / this.scale)
				this.ctx.stroke()
				this.ctx.draw(true)
			},
			// 完成按钮出发
			save() {
				uni.showLoading({
					title: '上传中..'
				});
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: (res) => {
						const savedFilePath = res.tempFilePath //相对路径
						// this.transformBase64(savedFilePath)

						pathToBase64(savedFilePath)
							.then(base64 => {
								// console.log(base64)
								this.$emit('getCompleteImg', base64, "")
							})
							.catch(error => {
								uni.hideLoading()
								uni.showToast({
									title: '图片转成base64发生错误,请稍后重试',
									duration: 2000,
									icon: 'none'
								});
							})


					}
				})
			},
			transformBase64(filePath) {

				uni.showModal({
					title: '当前批注图片的上传路径',
					content: JSON.stringify(filePath),
				})

				uni.uploadFile({
					url: this.BASE_URL + "/a/sys/file/webupload/uploadPathAndBase;JSESSIONID=" + uni.getStorageSync("token"),
					name: 'file',
					filePath: filePath,
					success: (res) => {
						console.log(res)
						this.$emit('getCompleteImg', JSON.parse(res.data).body.base64, JSON.parse(res.data).body.url)
					},
					fail: (res) => {
						console.log(res)
						uni.showToast({
							title: '网路出了点问题',
							duration: 2000,
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading()
					}
				})



				// uni.uploadFile({
				// 	url: "http://192.168.20.72:9042/rsb/v1/resourceTransform/420100000000-3-0800-f3ea8e2dcce732d0b24b660859e173ed/420100000000",
				// 	name: 'file',
				// 	filePath:filePath,
				// 	header:{
				// 		// "Content-Type" : "application/form-data",
				// 		"appCredential":uni.getStorageSync("appJsonEncodeString"),
				// 		"Cookie":"wolfking.jeeplus.session.id="+uni.getStorageSync("token")+"; Path=/; Domain=59.45.6.86; HttpOnly;"
				// 	},
				// 	success:(res) => {
				// 		uni.showModal({
				// 			title:'上传图片的返回值',
				// 			content:JSON.stringify(res),
				// 		})

				// 		this.$emit('getCompleteImg', JSON.parse(res.data).body.base64, JSON.parse(res.data).body.url)
				// 	},
				// 	fail:(res) => {
				// 		console.log(res)
				// 		uni.hideLoading()
				// 		uni.showToast({
				// 		    title: '网路出了点问题',
				// 		    duration: 2000,
				// 				icon: 'none'
				// 		});
				// 	}
				// })

			},
			// 关闭按钮触发
			close() {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100000;

		.edit {
			position: absolute;
			right: 60px;
			top: 10%;
			z-index: 100000;
		}

		.menu {
			position: absolute;
			right: 60px;
			top: 50%;
			transform: translateY(-50%);
			z-index: 100000;
			padding: 10px;
			background-color: #fff;
			border-radius: 5px;

			.menu-item {
				position: relative;
				margin-bottom: 15px;
				display: flex;
				justify-content: center;
				align-items: center;

				.drawStyle {
					position: absolute;
					left: 45px;
					top: -5px;
					padding: 5px;
					background-color: #fff;
					border-radius: 5px;

					.drawPoint {
						position: absolute;
						top: 10px;
						left: -5px;
						width: 10px;
						height: 10px;
						background-color: #FFFFFF;
						transform: rotate(45deg);
					}

					.drawStyle-item {
						width: 20px;
						height: 20px;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 5px;

						.drawStyle-weight {
							border-radius: 50%;
							background-color: gray;
						}

						.drawStyle-color {
							width: 15px;
							height: 15px;
							border-radius: 2px;
						}
					}
				}

				image {
					width: 20px;
					height: 20px;
				}
			}


		}
	}

	.movable-area {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 10000;
	}

	.movable-view {
		position: absolute;
	}

	.canvas {
		width: 100%;
		height: 100%;
	}
</style>
