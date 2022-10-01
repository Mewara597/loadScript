const MAIN_OBJ = {
	init: function () {
		console.log("working..");
		let isProductPage = this.isProductPage();
		if (isProductPage) {
			let allLiDiv = document.querySelectorAll(".product-single__thumbnails li"),
			idOfImg = document.querySelector(".product-form__variants [selected=selected]").value;
			handle = this.getHandle();
			getResponse = async () => {
				let responseData = await this.fetchResponse(handle);
				let dataObj = this.productDataObject(responseData.product);
				this.addImagesOfRespectiveId(idOfImg, dataObj, allLiDiv);
				document.querySelector(".product-form__input").addEventListener("change", (eventHandler) => {
					const urlParams = new URLSearchParams(window.location.search);
					idOfImg = urlParams.get("variant");
					this.addImagesOfRespectiveId(idOfImg, dataObj, allLiDiv);
				});
			};
			getResponse();
		}
	},
	addImagesOfRespectiveId: function (idOfImg, dataObj, allLiDiv) {
		let srcToAdd = dataObj.allSrcObj[idOfImg];
		if (srcToAdd) {
			this.logicForAddImages(dataObj, allLiDiv, srcToAdd);
			this.showActiveThumb();
		} else {
			allLiDiv.forEach((eachLiElement) => {
				document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", eachLiElement);
			});
		}
	},
	logicForAddImages: function (dataObj, allLiDiv, srcToAdd) {
		document.querySelectorAll(".product-single__thumbnails li").forEach((eachLiElement) => {
			eachLiElement.remove();
		});
		let liDivArr = Array.from(allLiDiv),
		 indexOfSrcInLi = dataObj.allSrcArr.indexOf(srcToAdd[0]),
		 neededLisToAdd = liDivArr.slice(indexOfSrcInLi, indexOfSrcInLi + srcToAdd.length),
		 indexOfCommonSrc = dataObj.allSrcArr.indexOf(dataObj.commonSrc[0]),
		 sliceCommnSrc = liDivArr.slice(indexOfCommonSrc, indexOfCommonSrc + dataObj.commonSrc.length);
		neededLisToAdd.concat(sliceCommnSrc).forEach((liToAdd) => {
			document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", liToAdd);
		});
		this.showActiveThumb();
	},
	isProductPage: function () {
		if (window.location.pathname.split("/").includes("products")) return true;
		 else return false;
	},
	getHandle: function () {
		let handelArr = window.location.pathname.split("/");
		return handelArr[handelArr.indexOf("products") + 1];
	},
	fetchResponse: async function (handle) {
		let data = await fetch(`https://sidharth-test-shop.myshopify.com/products/${handle}.json`);
		return await data.json();
	},
	productDataObject: function (data) {
		let allSrcObj = {}, idArr = [],commonSrc = [],allSrcArr = [];
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
	showActiveThumb: function (){ // changing the class to active-thumb at first time load 
		document.querySelectorAll('.product-single__thumbnails li a')[0].classList.add('active-thumb')
	}
};
(function () {
	MAIN_OBJ.init();
})();