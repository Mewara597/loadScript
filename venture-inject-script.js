const MAIN_OBJ = {
    init: function () {
        console.log("start");
        if (this.isProductPage()) { 
            let allImagesDiv = Array.from(document.querySelectorAll(".product-single__thumbnail-item")),
                handle = this.getHandle();
            getResponse = async () => {
                let responseData = await this.fetchResponse(handle);
                let dataObj = this.productDataObject(responseData.product);
                console.log(dataObj);
                /**store slick settings into a variable  */
                let slickOptions = this.getOptionAndUnslick();
                /**  now all images are in (.product-single__thumbnails)  this div
                 * first remove all images from the div
                 * second append images varient wise in same div on default load
                 * third append images on changing Selector
                 * call sllick on same class where it was earlier
                 */
                /**step first */
                this.removeImages();
                /** second append images Varient wise on default load*/
                idOfDefaultImage = document.querySelector(".product-form__variants [selected=selected]").value;
                this.addImegsVarientWise(allImagesDiv, idOfDefaultImage, dataObj);
                /** third insert images on change Varient
                 * bind event on selector
                 * 1. if there are elements in div remove them div
                 * 2. get changed id
                 * 3. remove elements if in target div
                 * 4. insert them
                 * 5. all wala case
                 */
                this.onChangeVarient(allImagesDiv, dataObj);
                /** call slick here on same class */
                // if (!$(".product-single__thumbnails").hasClass("slick-initialized")) {
                // slickOptions.adaptiveHeight = true;
                this.setOptionAndIntSlick(slickOptions);
                // }
            };
            getResponse();
        }
    },
    getOptionAndUnslick: function () {
        let slickOptions = $(".product-single__thumbnails").slick("getSlick").options; // yha slick initialized tha phle se hi
        console.log(slickOptions);
        if ($(".product-single__thumbnails").hasClass("slick-initialized")) {
            $(".product-single__thumbnails").slick("unslick"); // remove slick from the class where it was initialized
        }
        return slickOptions;
    },
    setOptionAndIntSlick: function (slickOptions) {
        $(".product-single__thumbnails").slick(slickOptions);
    },
    removeImages: function () {
        let targetDiv = document.querySelectorAll(".product-single__thumbnails div");
        if (targetDiv.length > 0)
            targetDiv.forEach((removableDiv) => {
                removableDiv.remove();
            });
    },
    addImegsVarientWise: function (allImagesDiv, idOfDefaultImage, dataObj) {
        let srcOfRespectedId = dataObj.allSrcObj[idOfDefaultImage],
            selectdDivArr = [];
        console.log(srcOfRespectedId);
        /**here we handel if ID has src array or  undefined
         * if undefined then then append all images
         * else append selected
         * when user clicks on all images
         */
        if (srcOfRespectedId == undefined) {
            /** first empty target div  */
            /** now loop over allDiv and insert them into target div */
            allImagesDiv.forEach((divToInsert) => {
                document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", divToInsert);
            });
            document.querySelector(".product-single__thumbnails .is-active").classList.remove("is-active");
        } else {
            /** find selected varient div from all div and push them into an array  */
            srcOfRespectedId.forEach((srcOfImg) => {
                selectdDivArr.push(allImagesDiv[dataObj.allSrcArr.indexOf(srcOfImg)]);
            });
            /** find common varient div from all div and push them into selectedDiv array  */
            dataObj.commonSrc.forEach((commonImages) => {
                selectdDivArr.push(allImagesDiv[dataObj.allSrcArr.indexOf(commonImages)]);
            });
            /** now insert images to the div  */
            this.appendSelectedDiv(selectdDivArr);
        }
    },
    appendSelectedDiv: function (selectdDivArr) {
        selectdDivArr.forEach((arrDiv) => {
            document.querySelector(".product-single__thumbnails").insertAdjacentElement("beforeend", arrDiv);
        });
    },
    onChangeVarient: function (allImagesDiv, dataObj) {
        /**get current id from new url
         * remove div's from target div
         *  call addImegsVarientWise image function and pass parameters   */
        // document.querySelector(".single-option-selector").addEventListener("change", (eventHandler) => {
        //  this.logicForVarienChange(allImagesDiv, dataObj);
        // });
        if (document.querySelectorAll(".selector-wrapper select").length > 0) {
            document.querySelectorAll(".selector-wrapper select").forEach((eachNode) => {
                eachNode.addEventListener("change", () => {
                    this.logicForVarienChange(allImagesDiv, dataObj);
                });
            });
        }
    },
    logicForVarienChange: function (allImagesDiv, dataObj) {
        let slickOptions = this.getOptionAndUnslick();
        const urlParams = new URLSearchParams(window.location.search);
        let idOfDefaultImage = urlParams.get("variant");
        this.removeImages();
        this.addImegsVarientWise(allImagesDiv, idOfDefaultImage, dataObj);
        this.setOptionAndIntSlick(slickOptions);
        this.showActiveThumb();
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
        let data = await fetch(`https://sidharth-test-shop.myshopify.com/products/${handle}.json`);
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
    showActiveThumb: function () {
        document.querySelectorAll(".slick-track div")[0].classList.add("is-active");
    },
};
(function () {
    MAIN_OBJ.init();
})();
/**document.querySelectorAll('.selector-wrapper select').forEach((eachNode)=>{eachNode.addEventListener('change', ()=>{console.log(event.target)})})
 */