const MAIN_OBJ = {
	init: function () {
		console.log("start");
		if (this.isProductPage()) {
			let handle = this.getHandle(),
			liElements = this.allLiElements(),
			defaultImageId = document.querySelector(".product-single__variants [selected]");
			if (defaultImageId) {
				defaultImageId = document.querySelector(".product-single__variants [selected=selected]").value;
			}
			getResponse = async () => {
				let responseData = await this.fetchResponse(handle);
				let dataObj = this.productDataObject(responseData.product);
				console.log(dataObj);

				/** arrange VarientWiseImages  */
				this.addVarientWiseImages(dataObj, defaultImageId, liElements);

				/** on changing Varient Selector */
				this.onChangeVarient(dataObj, liElements);
			};
			// getResponse();
		}
	},
	addVarientWiseImages: function (dataObj, defaultImageId, liElements) {
		let selectdDivArr = [],
			selectedCommonSrcArr = [],
			srcOfRespectedId = dataObj.allSrcObj[defaultImageId]; // get srcArray of respectedId

		/** case when srcOfRespectedId is undefined or null || all images case */
		if (srcOfRespectedId == undefined) {
			this.removeImages();
			liElements.allLiElem.forEach((liDiv) => {
				document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", liDiv);
			});
		} else {
			/** find index and take li div of that index and push into array */
			liElements.allImgOfLi.forEach((imgSrc, index) => {
				imgSrc = imgSrc.split("_grande").join("");
				if (srcOfRespectedId.includes(imgSrc)) {
					selectdDivArr.push(liElements.allLiElem[index]);
				}
				if (dataObj.commonSrc.includes(imgSrc)) {
					selectedCommonSrcArr.push(liElements.allLiElem[index]);
				}
			});

			/**push commonsrc array into another and then flat main  array  */
			selectdDivArr.push(selectedCommonSrcArr);
			let flattenLiArray = selectdDivArr.flat();

			/**first empty target ul div  then append images to that div*/
			this.removeImages();
			this.insertImagesToTargetDiv(flattenLiArray);
		}
	},
	onChangeVarient: function (dataObj, allImagesDiv) {
		/** bind event on target varient selector and get id of image and call addVarientWiseImage function */
		document.querySelectorAll(".single-option-selector").forEach((selector) => {
			selector.addEventListener("change", () => {
				console.log("chnge event ");
				const urlParams = new URLSearchParams(window.location.search);
				let imageId = urlParams.get("variant");
				this.addVarientWiseImages(dataObj, imageId, allImagesDiv);
			});
		});
	},
	insertImagesToTargetDiv: function (srcArr) {
		/** loop over the array and append one by one to target  */
		srcArr.forEach((src) => {
			document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", src);
		});
	},
	removeImages: function () {
		/** remove images from target  */
		document.querySelectorAll(".product-single__thumbnails li").forEach((eachLi) => {
			eachLi.remove();
		});
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
	allLiElements: function () {
		let liObj = {},
			filterSrcArr = [];
		Array.from(document.querySelectorAll(".product-single__thumbnails li img")).forEach((eachLi) => {
			filterSrcArr.push(eachLi.src.split("?")[0]);
		});
		console.log(filterSrcArr);
		liObj["allImgOfLi"] = filterSrcArr;
		liObj["allLiElem"] = document.querySelectorAll(".product-single__thumbnails li");

		return liObj;
	},

};
(function () {
	MAIN_OBJ.init();
})();
/**document.querySelectorAll('.selector-wrapper select').forEach((eachNode)=>{eachNode.addEventListener('change', ()=>{console.log(event.target)})})
 */
