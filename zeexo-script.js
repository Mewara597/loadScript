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
			variantId = document.querySelector('#product-select-7641412370667')
		variantId ? variantId = variantId.value : variantId = new URLSearchParams(window.location.search).get('variant');

		let slickOptionsObj = this.unslickAndGetSlickOptions(),
			allDivObj = this.allLiObj(),
			allLargeImagesDivArr = this.allDivObjForLargeImages(),
			allDivObjArray = [allDivObj, allLargeImagesDivArr]
		this.getVarianImages(dataObj, variantId, allDivObjArray, slickOptionsObj);

		setTimeout(() => {
			this.onChangeVarientSelector(dataObj, allDivObjArray)
		}, 2000);

		$(".slider-thumbs-00").slick(slickOptionsObj.slickOptions);
		$(".slider-for-00").slick(slickOptionsObj.largeImage_options);
	},
	getVarianImages: function (dataObj, variantId, allDivObjArray, slickOptionsObj) {
		let srcOfRespectedImg = dataObj.allSrcObj[variantId],
		 selectorToAdd = [".product-image-inner .slider-thumbs-00", '.slider-for-00.slider-for-01'],
			selectorToRemove = [".product-image-inner .slider-thumbs-00 div", '.slider-for-00.slider-for-01 div'];
		if (srcOfRespectedImg == undefined) {
			allDivObjArray.forEach((eachObj, index) => {
				this.insertImagesToTargetDiv(selectorToRemove[index], selectorToAdd[index], eachObj.allDivArr)
			})
			$(".slider-thumbs-00").slick(slickOptionsObj.slickOptions);
			$(".slider-for-00").slick(slickOptionsObj.largeImage_options);
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
			$(".slider-thumbs-00").slick(slickOptionsObj.slickOptions);
			$(".slider-for-00").slick(slickOptionsObj.largeImage_options);
		}
	},
	onChangeVarientSelector: function (dataObj, allDivObjArray) {
		document.querySelector('.selector-wrapper select').addEventListener('change', () => {
			setTimeout(() => {
				let variantId = new URLSearchParams(window.location.search).get('variant'),
					slickOptionsObj = this.unslickAndGetSlickOptions()
				this.getVarianImages(dataObj, variantId, allDivObjArray, slickOptionsObj)
				console.log(variantId);
			}, 300);
		})
	},
	allLiObj: function () {
		let allLiObj = {},
			allDivArr = Array.from(document.querySelectorAll('.product-image-inner .slider-thumbs-00 div'))
		allLiObj['allDivArr'] = allDivArr;
		console.log(allLiObj);
		return allLiObj;
	},
	allDivObjForLargeImages: function () {
		let allLiObj = {},
			allDivArr = Array.from(document.querySelectorAll('.slider-for-00 div'))
		allLiObj['allDivArr'] = allDivArr;
		console.log(allLiObj);
		return allLiObj;
	},
	unslickAndGetSlickOptions: function () {
		let slickOptionsObj = {}
		slickOptionsObj['slickOptions'] = $(".slider-thumbs-00").slick("getSlick").options,
			slickOptionsObj['largeImage_options'] = $('.slider-for-00').slick('getSlick').options;
		$(".slider-thumbs-00").hasClass("slick-initialized") ?
			$(".slider-thumbs-00").slick("unslick") && $(".slider-for-00").slick("unslick") : console.log("Slick is not initialised `on slider-thumbs-00` ") // remove slick from the class where it was initialized
		return slickOptionsObj;
	},

	/**static function same for all themes */
	insertImagesToTargetDiv: function (selectorToRemove, selectorToAdd, selectedDiv) {
		document.querySelectorAll(selectorToRemove).forEach((div) => {
			div.remove();
		}); //remove​
		// selectorToAdd.forEach((addedSelector)=>{
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