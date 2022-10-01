const MAIN_OBJ = {
	init: function () {
		console.log("start");
		if (this.isProductPage()) {
			let handle = this.getHandle(),
				// allLiObj = this.allLiObj(),
				allLiObj = this.allLiObj(),
				defaultImageId = document.querySelector(".form__input.no-js option[selected = selected] ");
			if (defaultImageId) {
				defaultImageId = document.querySelector(".form__input.no-js option[selected = selected] ").value;
			} else {
				let urlParms = new URLSearchParams(window.location.search);
				defaultImageId = urlParms.get("variants");
			}
			console.log(allLiObj);
			getResponse = async () => {
				let responseData = await this.fetchResponse(handle);
				let dataObj = this.productDataObject(responseData.product);
				console.log(dataObj);
​
				/** for mobile set  */
				/**if innerwidth is less than 9985px */
				if (window.innerWidth < "985") {
					console.log("opned with mobile view");
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId);
					this.setDataMediaIndex();
					this.onChangeVarientSelector(dataObj, allLiObj);
​
					this.transformCalculations();
				} else {
					console.log("opened with pc view");
					/** now usimg default id add variant images */
					this.addVarientWiseImages(dataObj, allLiObj, defaultImageId);
​
					/**now on change varient selector */
					this.onChangeVarientSelector(dataObj, allLiObj);
				}
			};
			getResponse();
		}
	},
​
	setDataMediaIndex: function () {
		document.querySelectorAll(".gallery__image-wrapper").forEach((imgTag, index) => {
			imgTag.setAttribute("aria-hidden", true);
		});
		document.querySelectorAll(".gallery__image-wrapper img").forEach((imgTag, index) => {
			imgTag.setAttribute("data-media-index", index + 1);
		});
	},
​
	transformCalculations: function () {
		let index = document.querySelector(".gallery__image-wrapper--scale :not(aria-hidden).is-active");
		if (index) {
			index = index.getAttribute("data-media-index");
		} else {
		}
		let lengthOfElements = document.querySelectorAll(".gallery__strip div").length;
		let targetDiv = document.querySelector(".gallery-indicator__count");
​
		this.setDataMediaIndex();
		// targetDiv.setAttribute("aria-label", `Item ${index} of ${lengthOfElements} `);
		targetDiv.removeAttribute("aria-label");
		targetDiv.setAttribute("aria-label", `Item ${index} of ${lengthOfElements}`);
		document.querySelector(".gallery-indicator__count").innerText = ` ${index} of ${lengthOfElements}`;
		document.querySelectorAll(".gallery-indicator button ").forEach((btn) => {
			btn.addEventListener("click", () => {
				console.log("hello");
​
				let index = document.querySelector(".gallery__image-wrapper--scale :not(aria-hidden).is-active");
				if (index) {
					index = index.getAttribute("data-media-index");
				}
​
				let lengthOfElements = document.querySelectorAll(".gallery__strip div").length;
				let targetDiv = document.querySelector(".gallery-indicator__count");
				// targetDiv.setAttribute("aria-label", `Item ${index} of ${lengthOfElements} `);
				targetDiv.removeAttribute("aria-label");
				targetDiv.setAttribute("aria-label", `Item ${index} of ${lengthOfElements}`);
				document.querySelector(".gallery-indicator__count").innerText = ` ${index} of ${lengthOfElements}`;
​
				if (lengthOfElements == index) {
					document.querySelector("[data-media-arrow-next]").disabled = true;
				} else if (index == 1) {
					document.querySelector(".gallery-indicator__arrow--previous").disabled = true;
				} else if (index > 1 && index < lengthOfElements) {
					document.querySelector("[data-media-arrow-next]").disabled = false;
					document.querySelector(".gallery-indicator__arrow--previous").disabled = false;
				}
			});
		});
​
		document.querySelector(".data-media-current");
	},
​
	onChangeVarientSelector: function (dataObj, allLiObj) {
		document.querySelector(".product-form__select").addEventListener("change", () => {
			console.log("change");
			let defaultImageId = document.querySelector("[data-product-master-select]").value;
			this.addVarientWiseImages(dataObj, allLiObj, defaultImageId);
			// this.transformCalculations();
			this.setDataMediaIndex();
		});
	},
	addVarientWiseImages: function (dataObj, allLiObj, defaultImageId) {
		let srcOfId = dataObj.allSrcObj[defaultImageId];
		let filteredLiArr = [],
			commonSrcArr = [];
		/** if srcOfId array is undefined */
		if (srcOfId == undefined) {
			this.emptyTargetDiv();
			this.insertSelectedDiv(allLiObj.liDiv);
		} else {
			/**find selectedLi div using aray includes method */
​
			allLiObj.divSrc.forEach((src, index) => {
				src = src.split("_503x503").join("");
				if (srcOfId.includes(src)) {
					filteredLiArr.push(allLiObj.liDiv[index]);
				}
				if (dataObj.commonSrc.includes(src)) {
					commonSrcArr.push(allLiObj.liDiv[index]);
				}
			});
​
			/**flat both main and commonSrc array */
			filteredLiArr.push(commonSrcArr);
			let flattenLiArray = filteredLiArr.flat();
​
			console.log(flattenLiArray);
			/**change data media lebel */
			this.dataMediaLabelAndAreaLabel(flattenLiArray);
			/**insert flaten array to target div */
			this.insertSelectedDiv(flattenLiArray);
		}
		// console.log(srcOfId);
	},

	dataMediaLabelAndAreaLabel: function (flattenLiArray) {
		let arrayLength = flattenLiArray.length;
		// console.log(flattenLiArray);
		flattenLiArray.forEach((element, index) => {
			// element.removeAttribute("data-media-label");
			element.setAttribute("data-media-label", `${index + 1} of ${arrayLength} `);
			element.setAttribute("aria-label", `${index + 1} of ${arrayLength} `);
			console.log(element.getAttribute("data-media-label"));
		});
	},
	insertSelectedDiv: function (flattenLiArray) {
		this.emptyTargetDiv();
		flattenLiArray.forEach((div) => {
			document.querySelector(".gallery__strip").insertAdjacentElement("beforeend", div);
		});
		if (document.querySelector(".gallery__strip").style.transform) {
			document.querySelector(".gallery__strip").style.transform = "translateX(0%)";
		}
	},
	emptyTargetDiv: function () {
		document.querySelectorAll(".gallery__image-wrapper").forEach((eachDiv) => {
			eachDiv.remove();
		});
	},
	allLiObj: function () {
		let allDivObj = {};
		let filterSrc = []
		allDivObj["liDiv"] = Array.from(document.querySelectorAll(".gallery__strip div"));
		console.log(allDivObj);
		document.querySelectorAll(".gallery__image-wrapper img").forEach((imgElement) => {
			// console.log(imgElement);
			if (imgElement.src == "") {
				/**covnvert into src instead of data-src and them push into the array  */
				let filteredUrl = imgElement.getAttribute("data-src").split("//").join("https://").split("?")[0];
				imgElement.setAttribute("src", filteredUrl);
				filterSrc.push(imgElement.src);
			} else {
				let src = imgElement.src.split("?")[0];
				filterSrc.push(src);
			}
		});
		allDivObj["divSrc"] = filterSrc;
		return allDivObj;
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