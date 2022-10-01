const MAIN_OBJ = {
	init: function () {
		// !window.location.pathname.split("/").includes("products") ? ((handle = this.getHandle()), this.getResponse(handle)) : false;
		if (!window.location.pathname.split("/").includes("products")) return false;
		let handle = this.getHandle();
		this.getResponse(handle);
		this.jZoom();
	},

	/** add your logic here */
	getResponse: async function (handle) {
		console.log('this is response functions');
		let responseData = await this.fetchResponse(handle),
			dataObj = this.productDataObject(responseData.product);
		let allDivObj = this.allElimentObj()
		let variantId = document.querySelector('.no-js [selected]')
		variantId ? variantId = variantId.value : variantId = new URLSearchParams(window.location.search).get('variant')
		console.log(variantId);
		this.getVariantImage(dataObj, variantId, allDivObj)
		this.onchangeVarientSelector(dataObj, allDivObj)
	
	},

	getVariantImage: function (dataObj, variantId, allDivObj) {
		let srcOfRespectedImg = dataObj.allSrcObj[variantId],
			selectedDiv = [],
			selectorToAdd = ".product-thumbs.thumbs-slider", selectorToRemove = ".product-thumbs div";
					srcOfRespectedImg.push(dataObj.commonSrc);
					srcOfRespectedImg = srcOfRespectedImg.flat();

		if(srcOfRespectedImg == undefined ){
			this.insertImagesToTargetDiv(selectorToRemove, selectorToAdd, allDivObj.allDivArr);
		}else{
			srcOfRespectedImg.forEach(imgSrc=>{
				dataObj.allSrcArr.includes(imgSrc) ? selectedDiv.push(allDivObj.allDivArr[dataObj.allSrcArr.indexOf(imgSrc)])
				: console.log("src did not match")
			})			
			this.insertImagesToTargetDiv(selectorToRemove, selectorToAdd, selectedDiv);
		}
	},
	onchangeVarientSelector: function (dataObj, allDivObj) {
		
		document.querySelector('.selector-wrapper').addEventListener('change',()=>{
			console.log('change')
			let variantId = new URLSearchParams(window.location.search).get('variant')
			variantId ? console.log(variantId) : variantId=  document.querySelector('.no-js [selected]').value;
			this.getVariantImage(dataObj, variantId, allDivObj);
		})
		
		
	},


	allElimentObj: function () {
		let allElimentObj = {}, allDivArr;
		document.querySelector('.thumbs-slider') ? allDivArr = Array.from(document.querySelectorAll('.thumbs-slider div')) : console.log('selector undefined or not exist ')
		allElimentObj['allDivArr'] = allDivArr
		return allElimentObj
	},

	 jZoom: function() {
		$main_img_link = $('.product-main-image a');
		$main_img_link.trigger('zoom.destroy');
		$main_img_link.addClass('image-zoom').zoom({
		  url: $('img', this).attr('data-zoom')
		});
	  },

	/**static function same for all themes */
	insertImagesToTargetDiv: function (selectorToRemove, selectorToAdd, selectedDiv) {
		document.querySelectorAll(selectorToRemove).forEach((div) => {
			div.remove();
		}); //remove
		selectedDiv.forEach((div) => {
			document.querySelector(selectorToAdd).insertAdjacentElement("beforeend", div);
		}); //insert
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