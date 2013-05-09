(function ($) {


	//инициализацичя плагина


	$.fn.xvalidate = function (options) {


		var validState = false;  // большой флаг состояние формы
		var _su = null;

		// дефолты поля и паттерны
		var defaults = {
			fields: null,
			pattern: {
				ru: "",
				en: "",
				checked: {
					cssClass: "checked",
					errorText: "а с правтдами согласиться?"
				},
				num: {
					cssClass: "num",
					errorText: "тольк о цыфры пожалуйсто"
				},
				email: {
					cssClass: "email",
					errorText: "а тут нужен email"
				},
				date: {
					cssClass: "date",
					errorText: "date please"
				},
				empty: {
					cssClass: "empty",
					errorText: "должно быть заполнено"
				}
			}
		}

		// переопределяеи экстендя паттерны из вызова
		options.pattern = $.extend(defaults.pattern, options.pattern)

		// переопределяеи экстендя опции из вызова
		options = $.extend(defaults, options)

		var _form = $(this);
		var _index = {}


		var error = "error";


		if (options.fields) initDraw(options.fields);


		function initDraw(obj) {

			jQuery.each(obj, function (key, val) {


				_index[key] = {};


				var f_ = _index[key].field = {};
				var t_ = _index[key].tooltip = {};


				f_.el = _form.find("input[name='" + key + "']");
				t_.el = $("<b class='error_text'/>").insertAfter(f_.el);
				t_.list = {};

				//если у поля несколько проверок
				valArray = val.split(",");

				//для каждогй из критериев своя подсказка
				jQuery.each(valArray, function (i, val) {
					var val = val.trim();


					f_.cssClass = options.pattern[val].cssClass;
					t_.cssClass = options.pattern[val].cssClass;

					t_.list[val] = {};
					t_.list[val].text = options.pattern[val].errorText;
					t_.list[val].el = $("<i/>").addClass(t_.cssClass).html(t_.list[val].text);

					f_.el.addClass(f_.cssClass);
					t_.el.addClass(t_.cssClass).append(t_.list[val].el);


				})
			})

		}




		function validator(obj, serverErrors) {


			validState = false;


			//по всем интересующим нас полям
			jQuery.each(obj, function (key, val) {

				_index[key].field.el.removeClass(error);
				_index[key].tooltip.el.hide()

				// разобрали строку с типами валидации по запятым
				valArray = val.split(",");

				//и для каждого
				jQuery.each(valArray, function (i, val) {
					var val = val.trim();

					// посмотрели что возвращает check
					// check принимает [тип валидации, текущее значение поля]

					_index[key].tooltip.list[val].el.hide();


					if (!check(val, _index[key].field.el) || serverErrors) {

						// тут пусть будет вторая поверка не напортачили ли мы с указанием как валидировать поля
						// если вернуло false

						showErrors(key, val);

						validState = true;
					}
				})

			})
			return validState;
		}


		function showErrors(key, val) {

			_index[key].tooltip.list[val].el.show();
			_index[key].tooltip.el.show();


			_index[key].field.el.addClass(error);
		}

//время сабмита
		$(this).on("submit", function () {

			serverErrors = false;
			console.log("submit");


			console.log("client valdation");

			if (validator(options.fields)) {

				console.log("server valdation false");
				return false;
			} else {

				console.log("server valdation");
				$.ajax({
					url: "data.json",
					dataType: "json",
					data: $(this).serialize(),
					success: function (data) {

						if (data.error || data.status == 'error') {


							if (data.error) {

								options.fields = $.extend(options.fields, data.error)

								initDraw(options.fields);
							}



							obj = data.error;
							serverErrors = true;
							validator(obj, serverErrors);



							console.log("server valdation false");
						}
						else {


						}
					},
					error: function (response, textStatus) {
						console.log("fuck");
					}
				});

			}
			return false;
		})
	}





	// функция проверки - можно дописывать свои

	var check = function (_type, field) {
		switch (_type) {
			case "empty" :

				var _emptyReg = new RegExp("[0-9a-zа-я_]", 'i');
				var value = field.val();
				if (!_emptyReg.test(value)) {
					return false;
				} else {
					return true;
				}
				break;
			case "email" :
				var _emailReg = new RegExp("[0-9a-z_]+@[0-9a-z_^.]+\\.[a-z]{2,3}", 'i');
				var value = field.val();
				if (!_emailReg.test(value)) {
					return false;
				} else {
					return true;
				}
				break;
			case "num" :
				var _emailReg = new RegExp("[0-9]", 'i');
				var value = field.val();
				if (!_emailReg.test(value)) {
					return false;
				} else {
					return true;
				}
				break;
			case "date" :
				var _dateReg = new RegExp("(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\\d{4}))|((29)(\\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))", 'i');
				var value = field.val();
				if (!_dateReg.test(value)) {
					return false;
				} else {
					return true;
				}
				break;
			case "checked" :
				if (!field.is(":checked")) {
					return false;
				} else {
					return true;
				}
				break;
			default:

		}
	}

})(jQuery);