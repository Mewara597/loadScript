const MAIN_OBJ = {
	init: function () {
		console.log("start");
		if (this.isProductPage()) {
			let handle = this.getHandle(),
				allLiElements = this.allLiDiv(),
				defaultImageId = document.querySelector(".product-form input[name=id]").value;
			console.log(allLiElements);
			getResponse = async () => {
				let responseData = await this.fetchResponse(handle);
				let dataObj = this.productDataObject(responseData.product);
				console.log(dataObj);
				/**make clone of div where ul is stored and add class to both cloned and original div */
				this.duplicateElement();
				/**function to exract li div from allDivArray and insert them to the target div */
				this.addImagesVarientWise(dataObj, allLiElements, defaultImageId);
				/** on changing selector value find id and call addImagesVarientWise function */
				this.onchangeVarientSelector(dataObj, allLiElements);
			};
			getResponse();
		}
	},
	duplicateElement: function () {
		// document.querySelector(".product__media-wrapper");
		let originalDiv = document.querySelector(".product__media-wrapper");
		let cloneDiv = originalDiv.cloneNode(true);
		cloneDiv.classList.add("clone-div");
		originalDiv.insertAdjacentElement("beforebegin", cloneDiv);
		document.querySelector(".product__media-wrapper:not(.clone-div)").classList.add("original-div");
		document.querySelector(".product__media-wrapper.clone-div").style.display = "none";
	},
	onchangeVarientSelector: function (dataObj, allLiElements) {
		document.querySelectorAll(".product-form__input label").forEach((input) => {
			input.addEventListener("click", (event) => {
				console.log("event ");
				console.log(event.target.classList);
				setTimeout(() => {
					const urlParams = new URLSearchParams(window.location.search);
					let prevId = [],
						imageId = urlParams.get("variant");
					prevId.push(imageId);
					if (imageId != prevId[0]) {
						console.log(imageId);
						this.addImagesVarientWise(dataObj, allLiElements, imageId);
					} else {
						this.addImagesVarientWise(dataObj, allLiElements, prevId[0]);
					}
					if (prevId.length == 3) {
						prevId = [];
					}
				}, 100);
			});
		});
	},
	addImagesVarientWise: function (dataObj, allLiElements, defaultImageId) {
		let srcOfRespectedId = dataObj.allSrcObj[defaultImageId];
		let selectedLiArr = [],
			selectedCommonSrcArr = [];

		/**check whether src array is undefined or not is yes then insert all images to the array */
		if (srcOfRespectedId == undefined) {
			this.emptyTargetDiv();
			// product__media-item--variant​
			allLiElements.allLiDiv.forEach((liDiv) => {
				liDiv.classList.remove("product__media-item--variant");
				document.querySelector(".product__media-wrapper.original-div .product__media-list").insertAdjacentElement("beforeend", liDiv);
			});
		} else {
			/** find index and extract respected Li from allLi div */
			allLiElements.allLiImg.forEach((imgSrc, index) => {
				if (srcOfRespectedId.includes(imgSrc)) {
					selectedLiArr.push(allLiElements.allLiDiv[index]);
				}
				if (dataObj.commonSrc.includes(imgSrc)) {
					selectedCommonSrcArr.push(allLiElements.allLiDiv[index]);
				}
			});

			/**flat selected array */
			selectedLiArr.push(selectedCommonSrcArr);
			let flattenLiArray = selectedLiArr.flat();
			/** add selected li to the target div */
			this.insertSelectedDiv(flattenLiArray);
		}
	},
	insertSelectedDiv: function (selectedLiArr) {
		/**empty target div  */
		this.emptyTargetDiv();
		selectedLiArr.forEach((div) => {
			document.querySelector(".product__media-wrapper.original-div .product__media-list").insertAdjacentElement("beforeend", div);
		});
	},
	emptyTargetDiv: function () {
		/**check whether div has element or not  */
		if (document.querySelectorAll(".product__media-wrapper.original-div .product__media-list li")) {
			document.querySelectorAll(".product__media-wrapper.original-div .product__media-list li").forEach((liDiv) => {
				liDiv.remove();
			});
		}
	},
	allLiDiv: function () {
		let srcAndLiObj = {},
			filterSrcArr = [];
		// document.querySelector(".product__media-item.is-active").classList.remove("is-active");
		document.querySelectorAll(".product--large.original-div .product__media-item--variant").forEach((element) => {
			element.classList.remove("product__media-item--variant");
		});

		/**filter src and update*/
		Array.from(document.querySelectorAll(".product__media-list li div img")).forEach((eachLi) => {
			filterSrcArr.push(eachLi.src.split("?")[0]);
		});
		srcAndLiObj["allLiImg"] = filterSrcArr;
		srcAndLiObj["allLiDiv"] = Array.from(document.querySelectorAll(".product__media-list li"));
		return srcAndLiObj;
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