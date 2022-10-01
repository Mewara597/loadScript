const MAIN_OBJ = {
	/**declare your all variables inside the function and return an object of all variable  */

	global_var: {
		show_soldout: false,
		limit: 5,
		all_proucts_handle: [
			"women-jacketsingle-product-1",
			"ave-del-cielo-acrilico",
			"shoes",
			"apple-iphone-11-128gb-white-includes-earpods-power-adapter",
			"arista-variant-images-test",
			"leather-cover",
			"the-hoxton-clutch-in-plastic-4",
			"color_box",
		],
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
		MAIN_OBJ.global_var.all_proucts_handle.map((handle) => url_array.push(`https://afzal-test-shop.myshopify.com/products/${handle}.js`));

		return Promise.all(url_array.map((url) => fetch(url)))
			.then((response) => Promise.all(response.map((result) => result.json())))
			.then((data_obj) => data_obj);
	},

	/**use json array of multiple given handles */
	get_json_obj: async function () {
		let json_obj = await MAIN_OBJ.fetch_handle_response(MAIN_OBJ.global_var.all_proucts_handle),
			required_div_arr = [];

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

		MAIN_OBJ.on_mouseOver();
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
							<select id ='single_option_selector_${each_response_obj.id}'  class ='variant_selector' onChange='${MAIN_OBJ.changeSrc(each_response_obj)}'> 
							${each_response_obj.variants.map((obj) => `<option value = ${obj.id} > ${obj.title} </option>`).join("")}</select>
						</div>`,
		};
		variant_image_block = {
			checkbox: `<div class ='checkbox_${each_response_obj.id}'>
							<input type="checkbox" id='checkbox_${each_response_obj.id}' name='checkbox_${each_response_obj.id}' value="product">
							<label for="checkbox_${each_response_obj.id}"> </label>
						</div> `,

			feature_image: `<div class='featured_image'  > 
									<button type="button" style="display:none;" >quick view</button>
									<img src ='${featured_image}' onmouseover='MAIN_OBJ.on_mouseOver()' width='100px' height='100px' >
								</div>`,
		};

		let product_div = `<div class='${each_response_obj.handle}' style="margin-top: 5px; border: 2px solid black; display: flex;">
								<div class='image_div' style="margin-right: 10px">
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

	/** this function is called inside change featured image and src is updating in this function */
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
	changeSrc: function (json_ob) {
		console.log('hello');
		
	},

	on_mouseOver: function (){
		console.log('mouse upr aagya');
			let show_quick_view_btn  = document.querySelector('.featured_image button').style.display = ''
	},
};
(function () {
	MAIN_OBJ.init();
})();