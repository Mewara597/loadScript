const MAIN_OBJ = {
	init: function () {
		// !window.location.pathname.split("/").includes("products") ? ((handle = this.getHandle()), this.getResponse(handle)) : false;
		if (!window.location.pathname.split("/").includes("products")) return false;
		let handle = this.getHandle();
		this.getResponse(handle);
	},
	/** add your logic here */
	getResponse: async function (handle) {
		let responseData = await this.fetchResponse(handle),
			dataObj = this.productDataObject(responseData.product),
			variantId = document.querySelector(`[name="id"]`)
		variantId ? variantId = variantId.value : variantId = new URLSearchParams(window.location.search).get('variant')
		setTimeout(() => {
			let slickOptionsObj = this.unslickAndGetSlickOptions(),
				allDivObjArray = [this.allLiObj(), this.allDivObjForLargeImages()]
			console.log(allDivObjArray);

			window.innerWidth > 985 ? 
			(this.getVarianImages(dataObj, variantId, allDivObjArray, slickOptionsObj),this.onChangeVarientSelector(dataObj, allDivObjArray))
			 : (this.getVarianImages(dataObj, variantId, allDivObjArray, slickOptionsObj),this.onChangeVarientSelector(dataObj, allDivObjArray));
		}, 2000);
	},
	getVarianImages: function (dataObj, variantId, allDivObjArray, slickOptionsObj) {
		let srcOfRespectedImg = dataObj.allSrcObj[variantId],
			selectorToAdd = [".thumbs_list_frame", '.product_image_list_wrapper .productMainImage'],
			selectorToRemove = [".thumbs_list_frame div", '.product_image_list_wrapper .productMainImage div'];

		if (srcOfRespectedImg == undefined) {
			// let slickOptionsObj = this.unslickAndGetSlickOptions()
			allDivObjArray.forEach((eachObj, index) => {
				this.insertImagesToTargetDiv(selectorToRemove[index], selectorToAdd[index], eachObj.allDivArr)
			})
			$(".thumbs_list_frame_7641412370667").slick(slickOptionsObj.slickOptions);
			$(".productMainImage_7641412370667").slick(slickOptionsObj.largeImage_options);
		} else {
			srcOfRespectedImg.push(dataObj.commonSrc);
			srcOfRespectedImg = srcOfRespectedImg.flat();
			allDivObjArray.forEach((allDivObj, index) => {
				let selectedDiv = []
				srcOfRespectedImg.map((imgSrc) =>
					dataObj.allSrcArr.includes(imgSrc)
						? selectedDiv.push(allDivObj.allDivArr[dataObj.allSrcArr.indexOf(imgSrc)])
						: console.log("src did not match"));
				this.insertImagesToTargetDiv(selectorToRemove[index], selectorToAdd[index], selectedDiv);
			})

			$(".thumbs_list_frame_7641412370667").slick(slickOptionsObj.slickOptions);
			$(".productMainImage_7641412370667").slick(slickOptionsObj.largeImage_options);
		}
	},
	onChangeVarientSelector: function (dataObj, allDivObjArray) {
		document.querySelectorAll('#ProductSelect_7641412370667-option-0 label').forEach((eachOption) => {
			eachOption.addEventListener('click', () => {
				console.log('hello');
				setTimeout(() => {
					let variantId = document.querySelector(`[name="id"]`).value,
						slickOptionsObj = this.unslickAndGetSlickOptions()
					this.getVarianImages(dataObj, variantId, allDivObjArray, slickOptionsObj)
					console.log(variantId);
					$(".thumbs_list_frame_7641412370667").slick(slickOptionsObj.slickOptions);
					$(".productMainImage_7641412370667").slick(slickOptionsObj.largeImage_options);
				}, 300);
			})
		})

	},
	allLiObj: function () {
		let allLiObj = {},
			allDivArr = Array.from(document.querySelectorAll('.productThumbs .thumbs_list_frame div'))
		allLiObj['allDivArr'] = allDivArr;
		console.log(allLiObj);
		return allLiObj;
	},
	allDivObjForLargeImages: function () {
		let allLiObj = {},
			allDivArr = Array.from(document.querySelectorAll('.product_image_list_wrapper .productMainImage div'))
		allLiObj['allDivArr'] = allDivArr;
		console.log(allLiObj);
		return allLiObj;
	},
	unslickAndGetSlickOptions: function () {
		let slickOptionsObj = {}
		slickOptionsObj['slickOptions'] = $(".thumbs_list_frame_7641412370667").slick("getSlick").options,
			slickOptionsObj['largeImage_options'] = $('.productMainImage_7641412370667').slick('getSlick').options;
		$(".productMainImage_7641412370667").hasClass("slick-initialized") ?
			($(".productMainImage_7641412370667").slick("unslick"), $(".thumbs_list_frame_7641412370667").slick("unslick")) : console.log("Slick is not initialised `on slider-thumbs-00` ") // remove slick from the class where it was initialized
		return slickOptionsObj;
	},

	/**static function same for all themes */
	insertImagesToTargetDiv: function (selectorToRemove, selectorToAdd, selectedDiv) {
		console.log(selectedDiv);
		document.querySelectorAll(selectorToRemove).forEach((div) => {
			div.remove();
		}); //remove

		selectedDiv.forEach((div) => {
			document.querySelector(selectorToAdd).insertAdjacentElement("beforeend", div);
		})
	},
	getHandle: function () {
		let handelArr = window.location.pathname.split("/");
		return handelArr[handelArr.indexOf("products") + 1];
	},
	fetchResponse: async function (handle) {
		console.log(handle);
		let data = await fetch(`https://spicegems-019.myshopify.com/products/${handle}.json`);
		let respObj = await data.json();
		return respObj;
	},
	productDataObject: function (data) {
		let allSrcObj = {},
			idArr = [],
			commonSrc = [],
			allSrcArr = [];
		data.images.forEach((element) => {
			let filteredSrc = element.src.split("?")[0];
			allSrcArr.push(filteredSrc);
			if (element.variant_ids.length == 0 && Object.keys(allSrcObj).length == 0) commonSrc.push(filteredSrc);
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