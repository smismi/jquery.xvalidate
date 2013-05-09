(function ($) {


	//инициализацичя плагина


	$.fn.xvalidate = function (options) {

		var validState = false;  // большой флаг состояние формы
		console.log("load")


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
		var error = "error";

		var _index = {}

		// пробугаемся при ините - поля облагораживаем подсказками и прочей чепухой
		//ищем все поля которые учасствуют в валидации

		jQuery.each(options.fields, function (key, val) {


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


//время сабмита
		$(this).on("submit", function () {

			console.log("submit")

			//
			if (validator(options.fields)) {
				console.log("client false")

				return false;
			} else {

				console.log("client true")


				$.ajax({
					url: "data.json",
					dataType: "json",
					data: $(this).serialize(),
					success: function (data) {

						if (data.error || data.status == 'error') {


							jQuery.each(data.error, function (key, val) {


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


							var obj = data.error;

							jQuery.each(obj, function (key, val) {
								valArray = val.split(",");

								jQuery.each(valArray, function (i, val) {
									var val = val.trim();

									_index[key].tooltip.list[val].el.show();
									_index[key].tooltip.el.show();


									_index[key].field.el.addClass(error);


									console.log("оп ошибочка server");

								});


							});


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


		validator = function (obj) {


			validState = false;


			//по всем интересующим нас полям
			jQuery.each(obj, function (key, val) {

				//                //собрали в переменные DOM-объекты
				//                var _field = _form.find("input[name='" + key + "']");
				//                var _error_text = _field.parent().find("i.error_text");

				// сняли классы оштбок и убрали подсказки
				_index[key].field.el.removeClass(error);
				_index[key].tooltip.el.hide()


				//                _field.removeClass(error);
				//                _error_text.hide();


				// разобрали строку с типами валидации по запятым
				valArray = val.split(",");

				//и для каждого
				jQuery.each(valArray, function (i, val) {
					var val = val.trim();
					//                    var real_val = options.pattern[val]

					// посмотрели что возвращает check
					// check принимает [тип валидации, текущее значение поля]

					_index[key].tooltip.list[val].el.hide();


					if (!check(val, _index[key].field.el)) {

						// тут пусть будет вторая поверка не напортачили ли мы с указанием как валидировать поля


						// если вернуло false


						_index[key].tooltip.list[val].el.show();
						_index[key].tooltip.el.show();


						_index[key].field.el.addClass(error);


						console.log("оп ошибочка")

						validState = true;
					}
					;


				})


			})

			return validState;
		}


		// функция проверки - можно дописывать свои

		check = function (validator, field) {
			switch (validator) {
				case "empty" :

//                     var _emptyReg = /^\s*$/;
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
//                     alert(1);


			}
		}
	}

})(jQuery);