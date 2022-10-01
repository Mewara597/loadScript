const MAIN_OBJ = {
    init: function () {
        console.log("start");
        if (this.isProductPage()) {

            let allImagesDiv = Array.from(document.querySelectorAll('.product-single__thumbnails li')),
                handle = this.getHandle(),
                defaultImageId = document.querySelector('.product-single__variants [selected]').value;
                if(defaultImageId){
                    defaultImageId = document.querySelector('.product-single__variants [selected=selected]').value;
                }

                console.log(defaultImageId);
            getResponse = async () => {
                let responseData = await this.fetchResponse(handle);
                let dataObj = this.productDataObject(responseData.product);
                console.log(dataObj);


                /** arrange VarientWiseImages  */
                this.addVarientWiseImages(dataObj, defaultImageId, allImagesDiv);

                /** on changing Varient Selector */
                this.onChangeVarient(dataObj, allImagesDiv);

            };
            getResponse();
        }
    },
    removeImages: function () {
        /** remove images from target  */
        document.querySelectorAll('.product-single__thumbnails li').forEach(eachLi => {
            eachLi.remove();
        })
    },
    addVarientWiseImages: function (dataObj, defaultImageId, allImagesDiv) {
        let selectdDivArr = []
        let srcOfRespectedId = dataObj.allSrcObj[defaultImageId] // get srcArray of respectedId
        
        /** case when srcOfRespectedId is undefined or null || all images case */
            if(srcOfRespectedId ==  undefined) {
                this.removeImages();
                allImagesDiv.forEach(liDiv=>{
                    document.querySelector('.product-single__thumbnails').insertAdjacentElement('beforeend',liDiv);
                })
            }else{            
            
            /** find index and take li div of that index and push into array */
            srcOfRespectedId.forEach((srcOfImg) => {
                selectdDivArr.push(allImagesDiv[dataObj.allSrcArr.indexOf(srcOfImg)]);
            });

            /** find same div for common src and push into selectedArray */
            dataObj.commonSrc.forEach((commonImages) => {
                selectdDivArr.push(allImagesDiv[dataObj.allSrcArr.indexOf(commonImages)]);
            });

            /**first empty target ul div  then append images to that div*/
            this.removeImages();
            this.insertImagesToTargetDiv(selectdDivArr)
        }
    },   
    insertImagesToTargetDiv: function (srcArr) {
        /** loop over the array and append one by one to target  */
        srcArr.forEach(src => {
            document.querySelector('.product-single__thumbnails').insertAdjacentElement('beforeend', src)

        })
    },
    onChangeVarient: function (dataObj, allImagesDiv) {
        /** bind event on target varient selector and get id of image and call addVarientWiseImage function */
        document.querySelectorAll('.single-option-selector').forEach((selector)=>{
            selector.addEventListener('change', () => {
                console.log('hello');
                const urlParams = new URLSearchParams(window.location.search);
                let imageId = urlParams.get("variant");
                this.addVarientWiseImages(dataObj, imageId, allImagesDiv)
            })
        })
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