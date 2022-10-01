const MAIN_OBJ = {
	init: function () {
		console.log("start");
		if (this.isProductPage()) {
			let handle = this.getHandle(),
				allLiObj = this.allLiObj(),
				defaultImageId = document.querySelector('.product-single__variants option[selected="selected"]');
			if (defaultImageId) {
				defaultImageId = document.querySelector('.product-single__variants option[selected="selected"]').value
			} else {
				let urlParms = new URLSearchParams(window.location.search);
				defaultImageId = urlParms.get("variant");
			}

			getResponse = async () => {
				let responseData = await this.fetchResponse(handle);
				let dataObj = this.productDataObject(responseData.product);
				console.log(defaultImageId);
				console.log(allLiObj);
				console.log(dataObj);


				/** for mobile set  */
				if (window.innerWidth < 985) {
					console.log('do something');
					let options = this.getOptionAndUnslick()
					console.log(options);
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId)
					this.onChangeForSlick(dataObj, allLiObj)
					this.setOptionAndIntSlick(options)
				} else {
					console.log("do some some something");
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId)

					this.OnchangeSelector(dataObj, allLiObj)
				}

			};
			getResponse();
		}
	},

	/**theme specific code here */

	addVarientWiseImages: function (dataObj, allLiObj, defaultImageId) {
		let srcOfId = dataObj.allSrcObj[defaultImageId];
		let filteredLiArr = [],
			commonSrcArr = [];
		console.log(srcOfId);

		if (srcOfId == undefined) {
			this.removeImages();
			this.insertImagesToTargetDiv(allLiObj.liDiv)

		} else {
			allLiObj.divSrc.forEach((srcOfDiv, index) => {
				srcOfDiv = srcOfDiv.split('_300x300').join('');
				if (srcOfId.includes(srcOfDiv)) {
					filteredLiArr.push(allLiObj.liDiv[index])
				}
				if (dataObj.commonSrc.includes(srcOfDiv)) {
					commonSrcArr.push(allLiObj.liDiv[index])
				}
			})

			/**push common srcDiv into filter Li and flat it  */
			filteredLiArr.push(commonSrcArr)
			let flattenArr = filteredLiArr.flat()
			this.insertImagesToTargetDiv(flattenArr)
			console.log(flattenArr);
		}
		// return filteredLiArr;
	},

	OnchangeSelector: function (dataObj, allLiObj) {
		// if (document.querySelectorAll('.radio-wrapper select').length != 0) {
			document.querySelectorAll('.single-option-selector__radio').forEach(selector => {
				selector.addEventListener('change', (event) => {
					console.log(event);
					setTimeout(() => {
						let urlParms = new URLSearchParams(window.location.search);
						let defaultImageId = urlParms.get("variant");
						console.log(defaultImageId);
						this.addVarientWiseImages(dataObj, allLiObj, defaultImageId)
					}, 100);
				})
			})
		// }
		document.querySelectorAll('.single-option-radio label').forEach((btnlabel) => {
			btnlabel.addEventListener('click', (event) => {
				console.log('hello');
				setTimeout(() => {
					let urlParms = new URLSearchParams(window.location.search);
					let defaultImageId = urlParms.get("variant");
					console.log(defaultImageId);
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId)
				}, 100);
			})
		})
	},

	onChangeForSlick: function (dataObj, allLiObj) {
		document.querySelectorAll('.single-option-radio label').forEach((btnlabel) => {
			btnlabel.addEventListener('click', (event) => {
				console.log('hello');
				setTimeout(() => {
					let options = this.getOptionAndUnslick()
					let urlParms = new URLSearchParams(window.location.search);
					let defaultImageId = urlParms.get("variant");
					console.log(defaultImageId);
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId)
					this.setOptionAndIntSlick(options)
				}, 100);
			})
		})
	},

	insertImagesToTargetDiv: function (filteredLiArr) {
		this.removeImages();
		if (document.querySelector('.slick-track')) {
			filteredLiArr.forEach(divElem => {
				document.querySelector('.slick-track').insertAdjacentElement('beforeend', divElem)

			})
		}
		filteredLiArr.forEach(divElem => {
			document.querySelector('.product-single__media-group').insertAdjacentElement('beforeend', divElem)

		})
	},

	removeImages: function () {
		document.querySelectorAll('.product-single__media-flex-wrapper').forEach(element => {
			element.remove();
		});
		// document.querySelectorAll('.product__photo').forEach((div)=>{
		// 	div.remove();
		// })
	},






	/////////////////////////////////
	allLiObj: function () {
		let allDivObj = {};
		let filterSrc = [];
		// allDivObj['thumbImageDiv'] = document.querySelector('.product__photo--variant-wrapper:not(.hide)')
		allDivObj["liDiv"] = Array.from(document.querySelectorAll(`.product-single__media-flex-wrapper`))
		document.querySelectorAll(`.product-single__media img`).forEach((imgElement) => {
			// console.log(imgElement.src);
			if (imgElement.src == "") {
				let filteredUrl = imgElement.getAttribute("data-src").split("//").join("https://").split("?")[0];
				imgElement.setAttribute("src", filteredUrl);
				filterSrc.push(imgElement.src);
			} else {
				let src = imgElement.src.split("?")[0];
				// imgElement.setAttribute("src", src);
				filterSrc.push(src);
			}
		});
		allDivObj["divSrc"] = filterSrc;
		console.log(allDivObj);
		return allDivObj;
	},
	getOptionAndUnslick: function () {
		let slickOptions = $('.product-single__media-group ').slick("getSlick").options
			; // yha slick initialized tha phle se hi
		console.log(slickOptions);
		if ($(".product-single__media-group").hasClass("slick-initialized")) {
			$(".product-single__media-group").slick("unslick"); // remove slick from the class where it was initialized
		}
		return slickOptions;
	},
	setOptionAndIntSlick: function (slickOptions) {
		$(".product-single__media-group").slick(slickOptions);
	},
	isProductPage: function () {
		if (window.location.pathname.split("/").includes("products")) {
			return true;
		} else {
			return false;
		}
	},
	getHandle: function () {
		let handelArr = window.location.pathname.split("/");
		return handelArr[handelArr.indexOf("products") + 1];
	},
	fetchResponse: async function (handle) {
		console.log(handle);
		let data = await fetch(`https://test-products-14.myshopify.com/products/${handle}.json`);
		let respObj = await data.json();
		return respObj;
	},
	productDataObject: function (data) {
		let allSrcObj = {};
		let idArr = [];
		let commonSrc = [],
			allSrcArr = [];
		data.images.forEach((element) => {
			let filteredSrc = element.src.split("?")[0];
			allSrcArr.push(filteredSrc);
			if (element.variant_ids.length == 0 && Object.keys(allSrcObj).length == 0) {
				commonSrc.push(filteredSrc);
			}
			if (element.variant_ids.length > 0) {
				idArr = [];
				element.variant_ids.forEach((id) => {
					allSrcObj[id] = [filteredSrc];
					idArr.push(id);
				});
			}
			if (element.variant_ids.length == 0) {
				idArr.forEach((id) => {
					allSrcObj[id].push(filteredSrc);
				});
			}
		});
		let objOfResults = {
			allSrcObj: allSrcObj,
			commonSrc: commonSrc,
			allSrcArr: allSrcArr,
		};
		return objOfResults;
	},
};
(function () {
	MAIN_OBJ.init();
})();

/**document.querySelectorAll('.selector-wrapper select').forEach((eachNode)=>{eachNode.addEventListener('change', ()=>{console.log(event.target)})})
 */