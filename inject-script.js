const MAIN_OBJ = {
	/**declare your all variables inside the function and return an object of all variable  */

	/**"women-jacketsingle-product-1",
			"ave-del-cielo-acrilico",
			"shoes",
			"apple-iphone-11-128gb-white-includes-earpods-power-adapter",
			"arista-variant-images-test",
			"leather-cover",
			"the-hoxton-clutch-in-plastic-4", */

	// hello world
	global_var: {
		show_soldout: false,
		limit: 5,
		all_proucts_handle: ["color_box", "a-product-for-via"],
		sequence_of_prod_div: ["checkbox", "title", "price", "feature_image", "selector"],
	},

	init: function () {
		// !window.location.pathname.split("/").includes("products") ? ((handle = this.getHandle()), this.getResponse(handle)) : false;
		if (!window.location.pathname.split("/").includes("products")) return false;

		MAIN_OBJ.create_and_insert_spiceBlockDiv(); //1

		MAIN_OBJ.fetch_handle_response(); //2

		MAIN_OBJ.get_json_obj(); //3
	},
	/** add your logic here */
	create_and_insert_spiceBlockDiv: function () {
		let spiceBlock_div = `<div class='spice_block'></div>`;
		document.querySelector(".product-form").insertAdjacentHTML("beforeend", spiceBlock_div);
	},

	/**fetch  response of handles*/
	fetch_handle_response: function () {
		let url_array = [];
		MAIN_OBJ.global_var.all_proucts_handle.map((handle) => url_array.push(`https://spicegems-28.myshopify.com/products/${handle}.js`));

		return Promise.all(url_array.map((url) => fetch(url)))
			.then((response) => Promise.all(response.map((result) => result.json())))
			.then((data_obj) => data_obj);
	},

	/**use json array of multiple given handles */
	get_json_obj: async function () {
		let json_obj = await MAIN_OBJ.fetch_handle_response(MAIN_OBJ.global_var.all_proucts_handle),
			required_div_arr = [],
			json_obj_with_id = {};

		json_obj.forEach((each_obj, index) => {
			json_obj_with_id[each_obj.id] = json_obj[index];
		});

		console.log(json_obj_with_id);

		/**get array of divs which are ready to insert */
		json_obj.forEach((each_response_obj) => {
			MAIN_OBJ.global_var.show_soldout
				? required_div_arr.push(MAIN_OBJ.create_div_to_show(each_response_obj))
				: each_response_obj.available
				? required_div_arr.push(MAIN_OBJ.create_div_to_show(each_response_obj))
				: console.log(`${each_response_obj.handle} product is soldOut`);
		});

		/** filter array with limit */
		required_div_arr.length > MAIN_OBJ.global_var.limit
			? required_div_arr.splice(MAIN_OBJ.global_var.limit, required_div_arr.length - MAIN_OBJ.global_var.limit)
			: console.log(`div_array has ${required_div_arr.length} element`);

		/** insert filtered array */
		required_div_arr.map((prod_div) => {
			document.querySelector(".spice_block").insertAdjacentHTML("beforeend", prod_div);
		});

		MAIN_OBJ.default_featured_image(json_obj);

		MAIN_OBJ.change_featured_image_on_event(json_obj);

		MAIN_OBJ.open_modal(json_obj_with_id);

		// MAIN_OBJ.on_mouseOver(json_obj_with_id);
	},

	/**create div for each Json Obj */
	create_div_to_show: function (each_response_obj) {
		console.log(each_response_obj);

		let first_available_price = each_response_obj.variants.find((obj) => obj.available),
			featured_image = each_response_obj.featured_image;
		featured_image
			? console.log("featured image found")
			: (featured_image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpN4PyRQO8oBuhiveHS9F2iBJH-gpNkeDWvSPChDLb&s");
		first_available_price ? (first_available_price = first_available_price.price) : (first_available_price = each_response_obj.price);

		let prod_detail_block = {
			title: `<div class ='prod_detail_${each_response_obj.id}' id='${each_response_obj.id}'>
						<p class ='prod_title'> Title : ${each_response_obj.title} </p>
					</div>`,

			price: `<div class = 'prod_price_${each_response_obj.id}' id ='${each_response_obj.id}' > 
						<p class ='prod_price'> Price : ${first_available_price} </p>
						</div>`,

			selector: `<div class= selector_wrapper>
							<label for= 'single_option_selector_${each_response_obj.id}'> choose option </label>
							<select id ='single_option_selector_${each_response_obj.id}'  class ='variant_selector' '> 
							${each_response_obj.variants.map((obj) => `<option value = ${obj.id} > ${obj.title} </option>`).join("")}</select>
						</div>`,
		};
		variant_image_block = {
			va: each_response_obj,
			checkbox: `<div class ='checkbox_${each_response_obj.id}'>
							<input type="checkbox" id='checkbox_${each_response_obj.id}' name='checkbox_${each_response_obj.id}' value="product">
							<label for="checkbox_${each_response_obj.id}"> </label>
						</div> `,

			feature_image: `<div class='featured_image' onmouseover = "MAIN_OBJ.mouse_over(this)" onmouseout = "MAIN_OBJ.mouse_out(this)" > 
								<img id= '${each_response_obj.id}' src ='${featured_image}' " width='100px' height='100px'  >
								<div id='quick-view-${each_response_obj.id}' value='${each_response_obj.id}' style="display: none; 
								position: relative; top: -60px; background: rgb(229, 218, 172);
								cursor: pointer; border: 2px solid rgba(117, 85, 85, 0.36); border-radius: 27px;"> quick view</div>
								
							</div>`,
		};

		let product_div = `<div class='${each_response_obj.handle}' style="margin-top: 5px; border: 2px solid black; height:165px; display: flex;">
								<div class='image_div' style="margin-right: 10px;">
									${MAIN_OBJ.global_var.sequence_of_prod_div.map((seq_elem) => variant_image_block[seq_elem]).join("")}								
								</div>
								<div class = 'product_details-content-div'  style="margin-left: 20px; margin-right: 20px">
									${MAIN_OBJ.global_var.sequence_of_prod_div.map((seq_elem) => prod_detail_block[seq_elem]).join("")}
								</div>
								
							</div>`;

		return product_div;
	},

	/** add featured image at default load */
	default_featured_image: function (json_obj) {
		document.querySelectorAll(".selector_wrapper select").forEach((selector) => {
			MAIN_OBJ.change_img_src(json_obj, selector.value);
		});
	},

	/**change_featured_image_on_ changing variant selector  */
	change_featured_image_on_event: function (json_obj) {
		document.querySelectorAll(".variant_selector").forEach((selector) => {
			selector.addEventListener("change", (event) => {
				MAIN_OBJ.change_img_src(json_obj, event.target.value);
			});
		});
	},

	/** this function is called inside chcurrentTargetange featured image and src is updating in this function */
	change_img_src: function (json_obj, value_of_opt) {
		let got_id = false;
		// let featured_image_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpN4PyRQO8oBuhiveHS9F2iBJH-gpNkeDWvSPChDLb&s";

		json_obj.forEach((json_ob) => {
			json_ob.variants.forEach((each_var) => {
				each_var.id == value_of_opt
					? each_var.featured_image
						? ((document.querySelector(`.${json_ob.handle} img`).src = each_var.featured_image.src),
						  console.log(value_of_opt),
						  (got_id = true))
						: ((document.querySelector(`.${json_ob.handle} img`).src = json_ob.featured_image),
						  console.log(value_of_opt),
						  (got_id = true))
					: "";
			});
		});
	},

	mouse_over: function (obj) {
		const x = obj.querySelector("img");
		document.querySelector(`#quick-view-${x.id}`).style.display = "block";
	},

	mouse_out: function (obj) {
		const x = obj.querySelector("img");
		document.querySelector(`#quick-view-${x.id}`).style.display = "none";
	},

	open_modal: function (json_obj_with_id) {
		document.querySelectorAll("[id^='quick-view-']").forEach((button) => {
			button.addEventListener("click", (event) => {
				let object_id = event.currentTarget.id.split("-")[2];
				MAIN_OBJ.create_modal(object_id, json_obj_with_id);
				document.querySelector(".show-modal").style.visibility = "visible";
				// document.querySelector(".shopify-section").style.visibility = "hidden";

				MAIN_OBJ.close_modal();
				MAIN_OBJ._set_slider();
				MAIN_OBJ.change_feature_image_on_click();
			});
			// console.log((button.disabled = true));
		});
	},

	close_modal: function () {
		document.querySelector(".close-button").addEventListener("click", () => {
			document.querySelector(".show-modal").remove();
			document.querySelector(".shopify-section").style.visibility = "visible";
		});
	},

	create_modal: function (object_id, json_obj_with_id) {
		let each_response_obj = json_obj_with_id[object_id];
		console.log(each_response_obj);

		let modal_div = `<div class="show-modal" style = 'position: fixed;left: 0;top: 0;width: 100%;height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 1;
		visibility: hidden;
		transform: scale(1.0);
		transition: visibility 0s linear 5s, opacity 0.25s 0s, transform 0.25s;'>
		<div class="modal-content" style=' position: absolute;top: 37%;left: 50%;transform: translate(-50%, -50%);background-color: white;padding: 1rem 1.5rem;width: 35rem;border-radius: 0.5rem;'>
			<span class="close-button" style="float: right;width: 1.5rem;line-height: 1.5rem;text-align: center;cursor: pointer;border-radius: 0.25rem;background-color: lightgray;">&times;</span>
			<div class='product-detail-div' style="display: flex;">
				<div class='right-content-div' style='208px'>
					<div class = 'main-image-div' >	
					<img src='${each_response_obj.featured_image}' style='height:67px; width:80px'>
					</div>
					<div class ='variant-image-div' > 	

						<section class="slider-wrapper" style='margin:1rem;  overflow:hidden;'>
								<p class="slide-arrow" id="slide-arrow-prev" style='position: absolute;left:10px; padding-left:.25rem;
								display: flex; top: -4%;bottom: 0;margin: auto;height: 11rem;font-size: 3rem;cursor: pointer;'>&#8249;</p>
							
								<p class="slide-arrow" id="slide-arrow-next" style='position: absolute;padding-left:75rem;
								display: flex;top: -4%;bottom: 0;margin: auto;height: 11rem;
								font-size: 3rem;padding: 0;cursor: pointer;margin-left: 176px;'>&#8250;	</p>

							<ul class='slides-container' id='slides-container' style='	height: calc(22vh - 2rem);
							width: 334%;
							display: flex;
							list-style: none;
							margin: 0;
							padding: 0;
							overflow: hidden;
							scroll-behavior: smooth;
							flex-wrap: nowrap;
							margin-right: -19px;scroll-behavior: smooth;

							'>
									${each_response_obj.images
										.map(
											(img_src, index) =>
												`<li class='slide' media-index=${index} style='width:100%; height:100%; flex:1 0 10%;'> <img  src=${img_src} media-index=${index} style='height:60px;width: 50px;padding: 2px;'> </li>`
										)
										.join("")}
							</ul>
						</section>
					
					</div>
			
				</div>
				<div class='left-content-div'>
					<div class='product-detail' >
						<div class='product-description-div' style="overflow: overlay;height: 172px;width: 250px; margin-left:20px">
							<span>
								<b>description</b>: ${each_response_obj.description}
							</span>
							
						</div>
						<div class='price-description-div' style="margin-top: 10px;width: 248px;">
						<b><span>${each_response_obj.handle}</span></b>
						<br><br>
								<span class='price' style='display: flex;flex-direction: row;'> <mark style="margin-right: 10px; color:red;"><b> RS: ${
									each_response_obj.price
								}<b> </mark> ${
			each_response_obj.compare_at_price == null ? " " : ` <del> RS: ${each_response_obj.compare_at_price}</del>`
		} </span>
						</div>
					</div>
				
					<div class='cart-btn-div' style="padding-top: 24px;width: 192px;">
						<button class='add-cart-btn' style="width: 249px;background-color: aliceblue;">Add to cart</button>
						<button class='buy-product-btn' style="width: 249px;background-color: black;color:white">Buy it now</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;

		// console.log(document.querySelector(`.${each_response_obj.handle}`));
		document.querySelector(`.${each_response_obj.handle}`).insertAdjacentHTML("beforeend", modal_div);

		// document.querySelector(`#modal-id-${json_obj.id} .main-image-div img`).src = json_obj.featured_image;
		// document.querySelector(`#modal-id-${json_obj.id} .modal-right .product-description`).innerHTML = `description: ${json_obj.description}`;
	},

	change_feature_image_on_click: function () {
		document.querySelector(".slides-container").addEventListener("click", (event) => {
			// event.target.src;
			event.target.src ? document.querySelector(".main-image-div img").src = event.target.src : console.log('click at image '); 
			;
		});
	},

	show_border_on_selected: function () {
		document.querySelectorAll(".variant-image-div img").forEach((each_img) => {
			each_img.style.border = "" ? "" : (each_img.style.border = "");
		});
	},

	_set_slider: function () {
		document.querySelector("#slide-arrow-next").addEventListener("click", (event) => {
			// console.log(event.target);
			let slide_width = 3*(document.querySelector(".slide").clientWidth);
			document.querySelector(".slides-container").scrollLeft += slide_width;
		});
		document.querySelector("#slide-arrow-prev").addEventListener("click", (event) => {
			let slide_width = 3*(document.querySelector(".slide").clientWidth);
			document.querySelector(".slides-container").scrollLeft -= slide_width;
		});
	},

};
(function () {
	MAIN_OBJ.init();
})();