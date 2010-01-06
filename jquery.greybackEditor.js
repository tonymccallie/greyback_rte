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
				{'name':'Image','id':'image','type':'function','val':'insertImage'},
				{'name':'Video','id':'video','type':'function','val':null},
				{'name':'Document','id':'document','type':'function','val':null}
			]
		};

		var opts = $.extend(defaults,options);

		this.each(function() {
			textarea = $(this);

			var tag = textarea.attr('id');

			var value = textarea.val();
			var editor = document.createElement('div');
			editor.contentEditable = "true";
			editor.id = tag+'_greybackEditor';
			$(editor).html(value);
			$(editor).attr("class","greybackEditor");

			var workspace = document.createElement('div');
			workspace.id = tag+'_greybackWorkspace';
			var workspace_controls = document.createElement('div');
			workspace_controls.id = tag+'_greybackWorkspaceControls';
			
			var workspace_image = document.createElement('div');
			workspace_image.id = tag+'_greybackWorkspaceImage';
			var workspace_save = document.createElement('div');
			workspace_save.id = tag+'_greybackWorkspaceSave';
			$(workspace_save).html('<a href="#" id="'+tag+'_greybackWorkspaceSaveLink">SAVE</a>');

			workspace.appendChild(workspace_controls);
			workspace.appendChild(workspace_image);
			workspace.appendChild(workspace_save);

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
							editor.focus();
							eval('$.fn.greybackEditor.'+val['val']+'(tag,"http://localhost/greyback_razor/img/thumb/00698_snowmountains_1440x900.jpg/width:700");');
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

			textarea.before(workspace);
			textarea.before(controls);
			textarea.before(editor);
			textarea.hide();
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
				debug(this);
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
		/*
		$(editor).html($(editor).html().replace(/<em(\b[^>]*)>/gi, "<i$1>")
		.replace(/<\/em>/gi, "</i>")
		.replace(/<STRONG(\b[^>]*)>/gi, "<b$1>")
		.replace(/<\/strong>/gi, "</b>"));
		*/
		$(textarea).val($(editor).html());
	}

	$.fn.greybackEditor.editImage = function(tag, image) {
		workspace = '#'+tag+'_greybackWorkspace';
		workspace_controls = '#'+tag+'_greybackWorkspaceControls';
		workspace_image = '#'+tag+'_greybackWorkspaceImage';
		workspace_save = '#'+tag+'_greybackWorkspaceSaveLink';
		editor = '#'+tag+'_greybackEditor';
		$(workspace_image).html(image);
		image_width = image.width;
		image_height = image.height;
		image.id = tag+'_greybackJcrop';
		var jcrop = $.Jcrop(image,{});
		$(workspace_controls).slider({
			orientation:"vertical",
			min:.10,
			max:2,
			value:1,
			step:.01,
			slide: function(event, ui) {
				$('.jcrop-holder IMG, .jcrop-holder, .jcrop-tracker').width(ui.value * image_width).height(ui.value * image_height);
			}
		});
		$(image).dblclick(function(){
			$(editor).focus();
			$(editor).greybackEditor.insertImage(tag, this.src);
		});
		$(workspace_save).click(function() {
/*
		h: 260
w: 246
x: 329
x2: 575
y: 77
y2: 337
*/
			var jcrop_dim = jcrop.tellSelect();
			var img = '<img src="">';
			var base = image.baseURI + 'img/thumb/';
			console.log(base);
			console.log($('#'+image.id).attr('src'));
		});
	}

	$.fn.greybackEditor.insertImage = function(tag, image) {
		document.execCommand('insertImage',false,image);
		editor = '#'+tag+'_greybackEditor';
		$(editor).children('IMG').dblclick(function() {
			$.fn.greybackEditor.editImage(tag, this);
		});
	}

	$.fn.greybackEditor.insertVideo = function(image) {
		
	}

	$.fn.greybackEditor.insertDocument = function(image) {

	}

	$.fn.greybackEditor.toggleEditor = function() {
		console.log($(this));
	};
})(jQuery);