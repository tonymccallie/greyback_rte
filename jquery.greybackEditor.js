(function($) {
	$.fn.greybackEditor = function(options) {
		var defaults = {
			width: "100%",
			height: "100%",
			menu: [
				{'name':'Style','id':'style','type':'label','val':'Style:'},
				{'name':'Bold','id':'bold','type':'style','val':'bold'},
				{'name':'Italic','id':'italic','type':'style','val':'italic'},
				{'name':'Strikethrough','id':'strike','type':'style','val':'strikethrough'},
				{'name':'Underline','id':'underline','type':'style','val':'underline'},
				{'name':'Superscript','id':'super','type':'style','val':'superscript'},
				{'name':'Subscript','id':'sub','type':'style','val':'subscript'},
				{'name':'Format','id':'format','type':'select','val':{
					"Format":"",
					"Paragraph":"<p>",
					"Header 1":"<h1>",
					"Header 2":"<h2>",
					"Header 3":"<h3>"
				}},
				{'name':'Paragraph','id':'para','type':'label','val':'Paragraph:'},
				{'name':'Justify Left','id':'justleft','type':'command','val':'justifyLeft'},
				{'name':'Justify Right','id':'justright','type':'command','val':'justifyRight'},
				{'name':'Justify Center','id':'justcent','type':'command','val':'justifyCenter'},
				{'name':'List','id':'list','type':'label','val':'List:'},
				{'name':'Numbered List','id':'ol','type':'style','val':'insertOrderedList'},
				{'name':'Bullet List','id':'ul','type':'style','val':'insertUnorderedList'},
				{'name':'Indent','id':'indent','type':'command','val':'indent'},
				{'name':'Outdent','id':'outdent','type':'command','val':'outdent'},
				{'name':'Links','id':'links','type':'label','val':'Links:'},
				{'name':'Link','id':'link','type':'function','val':null},
				{'name':'Unlink','id':'unlink','type':'command','val':'unlink'},
				{'name':'Insert','id':'insert','type':'label','val':'Insert:'},
				{'name':'Image','id':'image','type':'function','val':null},
				{'name':'Video','id':'video','type':'function','val':null},
				{'name':'Document','id':'document','type':'function','val':null}
			]
		};
		
		var opts = $.extend(defaults,options);

		this.each(function() {
			textarea = $(this);

			var value = textarea.val();
			var editor = document.createElement('div');
			editor.contentEditable = "true";
			editor.id = textarea.attr('id')+'_greybackEditor';
			$(editor).html(value);
			$(editor).attr("class","greybackEditor");

			var controls = document.createElement('ul');
			$(controls).attr("class","greybackEditor_controls")

			$.each(opts['menu'], function(key, val) {
				var li = document.createElement('li');
				switch (val['type']) {
					case "command":
						var link = document.createElement('a');
						var text = document.createTextNode(val['name']);
						link.setAttribute('href',val['val']);
						link.setAttribute('title',val['name']);
						link.id = 'greybackEditorCommand_'+val['id'];
						$(link).click(function() {
							document.execCommand(val['val'],null,null);
							$.fn.greybackEditor.update(editor,controls,textarea);
							return false;
						})
						link.appendChild(text);
						li.appendChild(link);
						break;
					case "style":
						var link = document.createElement('a');
						var text = document.createTextNode(val['name']);
						link.setAttribute('href',val['val']);
						link.setAttribute('title',val['name']);
						link.setAttribute('class','greybackEditorCommand_style');
						link.id = 'greybackEditorCommand_'+val['id'];
						$(link).click(function() {
							document.execCommand(val['val'],null,null);
							$.fn.greybackEditor.update(editor,controls,textarea);
							if($.browser.msie) {
								$(editor).focus();
							}
							return false;
						})
						link.appendChild(text);
						li.appendChild(link);
						break;
					case "select":
						var select = document.createElement('select');
						$.each(val['val'], function(optkey, optval) {
							var option = document.createElement('option');
							option.setAttribute('value',optval);
							text = document.createTextNode(optkey);
							option.appendChild(text);
							select.appendChild(option);
						});
						$(select).change(function() {
							alert($(this).val());
							document.execCommand('formatblock',false,$(this).val());
							$.fn.greybackEditor.update(editor,controls,textarea);
							$(editor).focus();
						});
						li.appendChild(select);
						break;
					case "label":
						var text = document.createTextNode(val['val']);
						li.appendChild(text);
						break;
					case "function":
						var link = document.createElement('a');
						var text = document.createTextNode(val['name']);
						link.setAttribute('href',val['val']);
						link.id = 'greybackEditorCommand_'+val['id'];
						$(link).click(function() {
							document.execCommand(val['val'],null,null);
							$.fn.greybackEditor.update(editor,controls,textarea);
							return false;
						})
						link.appendChild(text);
						li.appendChild(link);
						break;
					default:
						debug("Unkown type "+val['type']);
						break;
				}
				controls.appendChild(li);
			});
			
			textarea.before(controls);
			textarea.before(editor);
			$(editor).focus();

			$(editor).keydown(function() {
				if(textarea.val().length == 0) {
					document.execCommand('formatblock',false,'p');
				}
			});

			$(editor).keyup(function() {
				textarea.val($(editor).html());
				$.fn.greybackEditor.update(editor,controls,textarea);
			});

			$(editor).mouseup(function() {
				$.fn.greybackEditor.update(editor,controls,textarea);
			});

			$(editor).children('IMG').dblclick(function() {
				console.log(this);
			});
		});
	};

	function debug(obj) {
		if(window.console && window.console.log) {
			console.log(obj);
		}
	}
	
	$.fn.greybackEditor.update = function(editor, controls, textarea) {
		$(controls).find('a.greybackEditorCommand_style').each(function() {
			if(document.queryCommandState($(this).attr('href'))) {
				$(this).parent('li').addClass('greybackEditor_active');
			} else {
				$(this).parent('li').removeClass('greybackEditor_active');
			}
		});
		$(editor).children('IMG').dblclick(function() {
			$.fn.greybackEditor.editImage(this);
		});
		/*
		$(editor).html($(editor).html().replace(/<em(\b[^>]*)>/gi, "<i$1>")
		.replace(/<\/em>/gi, "</i>")
		.replace(/<STRONG(\b[^>]*)>/gi, "<b$1>")
		.replace(/<\/strong>/gi, "</b>"));
		*/
		$(textarea).val($(editor).html());
	}

	$.fn.greybackEditor.editImage = function(image) {
		console.log(image);
	}

	$.fn.greybackEditor.insertImage = function(image) {
		document.execCommand('insertImage',false,image);
	}

	$.fn.greybackEditor.insertVideo = function(image) {
		
	}

	$.fn.greybackEditor.insertDocument = function(image) {
		
	}

	$.fn.greybackEditor.toggleEditor = function() {
		console.log($(this));
	};
})(jQuery);