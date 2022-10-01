const MAIN_OBJ = {
	init: function () {
		console.log("start");
		if (!this.isProductPage()) return false;
		let handle = this.getHandle();
		//  defaultVariantId = document.querySelector(`.grid__item select [selected = selected]`).value,
		// allLiObj = this.allLiElements()
		// console.log(allLiObj);

		this.getResponse(handle);
	},
	getResponse: async (handle) => {
		let responseData = await this.fetchResponse(handle);
		let dataObj = this.productDataObject(responseData.product),
			defaultVariantId = document.querySelector(`.grid__item select [selected = selected]`).value,
			allLiObj = this.allLiElements();

		/** arrange VarientWiseImages  */
		this.addImagesVarientWise(dataObj, allLiObj, defaultVariantId);

		/** on changing Varient Selector */
		this.onChangeVariantSelector(dataObj, allLiObj);
	},

    /**  */
	addImagesVarientWise: function (dataObj, allLiObj, defaultVariantId) {
		let srcOfId = dataObj.allSrcObj[defaultVariantId];
		commonDivArr = [];

		if (srcOfId == undefined) {
			document.querySelectorAll(".product__photo").forEach((divSrc) => {
				divSrc.style.display = "";
			});
		} else {
			let variantDivArr = [],
				commonSrcArray = [];
			document.querySelector(".product").classList.remove("grid--uniform");

			/** add property of display none to all div
			 * 1. loop over the allSrc and match if any src of srcArrOfId and src of commonSrc mathes or not
			 * 1. if they match create two array or main and common div and push div to respective array
			 * 3. now merget both array and flat them
			 * 4. *shift array by index one*- to remove head div
			 * 5. now loop over the divArr and check if display is none then remove and insert div to target
			 */

			dataObj.allSrcArr.forEach((prodSrc, index) => {
				if (allLiObj.liDivs[index]) {
					allLiObj.liDivs[index].style.display = "none";
				}
				if (srcOfId.includes(prodSrc)) {
					variantDivArr.push(allLiObj.liDivs[index - 1]);
					console.log("MAIN", index);
				}
				if (dataObj.commonSrc.includes(prodSrc)) {
					commonSrcArray.push(allLiObj.liDivs[index]);
					console.log("common", index);
				}
			});

			variantDivArr.push(commonSrcArray);
			let prodDivArr = variantDivArr.flat();
			prodDivArr.shift();
			prodDivArr.forEach((srcDiv) => {
				if (srcDiv.style.display == "none") {
					srcDiv.style.display = "";
				}
				document.querySelector(".product").insertAdjacentElement("beforeend", srcDiv);
			});
			document.querySelector(".product__photo").style.display = "";
		}
	},
	onChangeVariantSelector: function (dataObj, allLiObj) {
		document.querySelector(".single-option-selector").addEventListener("change", () => {
			setTimeout(() => {
				console.log("chnge event ");
				const urlParams = new URLSearchParams(window.location.search);
				let imageId = urlParams.get("variant");
				this.addImagesVarientWise(dataObj, allLiObj, imageId);
			}, 1000);
		});
	},
	allLiElements: function () {
		let liObj = {};
		// filterSrcArr = [];
		let liDivs = Array.from(document.querySelectorAll(".product__photo:not(.medium-up--hide)"));

		// if (document.querySelector(".product__photo--variant-wrapper:not(.hide) img")) {
		//     document.querySelector(".product__photo--variant-wrapper:not(.hide) img").src;
		// }
		liDivs.shift();
		liObj["liDivs"] = liDivs;
		console.log(liDivs);
		console.log();
		return liObj;
	},

	/**static function same for all themes */
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
