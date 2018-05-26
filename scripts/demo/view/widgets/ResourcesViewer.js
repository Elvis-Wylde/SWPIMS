Ext.define('RMIS.view.widgets.ResourcesViewer', {
	extend: 'Ext.window.Window',
	
	xtype: 'resourceviewer',
	
	bodyBorder: false,
	border: false,
	constrain: true,
	constrainTo: Ext.getBody(),
	closable: false,
	closeAction: 'destroy',
	resizable: false,
	draggable: false,
	header: false,
	modal: true,
	widthRate: 0.75,
	heightRate: 0.85,
	alwaysOnTop: true,
	scrollable: false,
	contentType: 'iframe', // 'iframe' or 'pdf' or 'image' or 'video'
	currentCardIdx: 0,
	contentArray: [],
	
	style: {
		border: 0,
		background: 'transparent'
	},
	
	bodyStyle: {
		border: 0,
		background: 'transparent'
	},
	
	layout: 'absolute',
	
	listeners: {
		show: function(me) {
			var cardCount = me.contentArray.length;
			me.titleLabel.setText(me.contentArray[0].title);
			me.prevBtn.setVisible(me.currentCardIdx > 0);
			me.nextBtn.setVisible(cardCount - 1 > me.currentCardIdx);
		}
	},
	
	initComponent: function() {
		var me = this;
		
		me.initMainContainer();
		me.initCloseContainer();
		me.initBar();
		
		me.items = [me.mainContainer, me.closeContainer, me.bar];
		
		me.contentContainer.getLayout().setActiveItem(me.currentCardIdx);
		me.initBounds();
		
		me.callParent();
	},
	
	initBounds: function() {
		var me = this,
			width = document.body.clientWidth,
			height = document.body.clientHeight;
		
		me.updateBounds(Math.round(width * me.widthRate), Math.round(height * me.heightRate));
	},
	
	updateBounds: function(width, height) {
		var me = this,
			clientWidth = document.body.clientWidth,
			clientHeight = document.body.clientHeight;
		
		me.setSize(width + 50, height + 50);
		
		me.mainContainer.x = me.mainContainer.y = 0;
		me.mainContainer.setSize(me.width - 30, me.height - 30);
		
		me.bar.x = 25;//15 + 10;
		me.bar.y = me.contentType == 'video' ? 25 : height - 20;
		me.bar.setWidth(width);
		
		if (me.bar.el && me.contentType != 'video') {
			me.bar.setLocalXY(25, height - 20);
		}
		
		if (!me.isHidden()) {
			me.setLocalXY((clientWidth - width - 50) / 2, (clientHeight - height - 50) / 2);
			me.updateLayout();
		}
	},
	
	updateImageSize: function(width, height) {
		// 图片过大或过小处理
		var me = this, layout = me.contentContainer.getLayout(),
			clientWidth = document.body.clientWidth,
			clientHeight = document.body.clientHeight,
			maxWidth = Math.round(clientWidth * .75), 
			maxHeight = Math.round(clientHeight * .85),
			minWidth = 400, minHeight = 300;
			rate = width / height;
		if (width > maxWidth || height > maxHeight) {
			var h = Math.round(maxWidth / rate);
			if (h > maxHeight) {
				height = maxHeight;
				width = height * rate;
			} else {
				width = maxWidth;
				height = h;
			}
		} else if (width < minWidth || height < minHeight) {
			width = minWidth;
			height = Math.round(width / rate);
		}
		
		layout.getActiveItem().setWidth(width);
		layout.getActiveItem().setHeight(height);
		return [width, height];
	},
	
	initMainContainer: function() {
		var me = this;
		
		me.contentContainer = Ext.create('Ext.container.Container', {
			padding: 10,
			layout: {
				type: 'card',
				deferredRender: true
			},
			items: me.initContents()
		});
		
		me.mainContainer = Ext.create('Ext.container.Container', {
			margin: 15,
			style: {
				border: 0,
				boxShadow: 'rgb(0,0,0) 0px 0px 20px',
				background: '#fff'
			},
			layout: 'fit',
			items: [me.contentContainer]
		});
	},
	
	initCloseContainer: function() {
		var me = this;
		me.closeContainer = Ext.create('Ext.container.Container', {
			layout: 'border',
			height: 30,
			style: {
				background: 'transparent'
			},
			items: [{
				xtype: 'button',
				region: 'east',
				width: 30,
				height: 30,
				style: {
					border: 0,
					boxShadow: 'rgba(0,0,0,0) 0px 0px 0px',
					background: 'transparent url(./resources/images/icons/fancybox.png) -40px 0px'
				},
				handler: function() {
					me.close();
				}
			}]
		});
	},
	
	initBar: function() {
		var me = this;
		me.titleLabel = Ext.create('Ext.form.Label', {
			itemId: 'titleLabel',
			// xtype: 'label',
			style: {color: '#fff', fontSize: '16px'},
			text: 'empty title'
		});
		
		me.prevBtn = Ext.create('Ext.button.Button', {
			width: 30, height: 30,
			itemId: 'prevBtn',
			style: {
				border: 0,
				boxShadow: 'rgba(0,0,0,0) 0px 0px 0px',
				background: 'transparent url(./resources/images/icons/fancybox.png) -40px -30px'
			},
			handler: function() {
				me.showPrev();
			}
		});
		
		me.nextBtn = Ext.create('Ext.button.Button', {
			width: 30, height: 30,
			itemId: 'nextBtn',
			style: {
				border: 0,
				boxShadow: 'rgba(0,0,0,0) 0px 0px 0px',
				background: 'transparent url(./resources/images/icons/fancybox.png) -40px -60px'
			},
			handler: function() {
				me.showNext();
			}
		});
		
		me.bar = Ext.create('Ext.toolbar.Toolbar', {
			height: 45,
			style: {
				border: 0,
				boxShadow: 'rgba(0,0,0,0) 0px 0px 0px',
				background: 'rgba(0,0,0,0.5)'
			},
			items: [me.titleLabel, '->', me.prevBtn, me.nextBtn]
		})
	},
	
	initContents: function() {
		var me = this, i = 0, len = me.contentArray.length,
			items = [];
		for(; i < len; i++) {
			var sourceId = me.contentArray[i].sourceId;
			var html = me.getContainerHtml(me.contentArray[i].sourcePath, sourceId);
			items.push(Ext.create('Ext.container.Container', {
				html: html,
				layout: 'fit',
				listeners: {
					activate: function() {
						if (me.contentType == 'image') {
							var img = new Image(), idx = me.currentCardIdx;
							img.src = me.contentArray[idx].sourcePath;
							if (img.width <= 0) {
								img.onload = function() {
									var size = me.updateImageSize(img.width, img.height);
									me.updateBounds(size[0], size[1]);
								}
							} else {
								var size = me.updateImageSize(img.width, img.height);
								me.updateBounds(size[0], size[1]);
							}
						}
					}
				}
			}));
		}
		return items;
	},
	
	showPrev: function() {
		this.doCardNavigation(-1);
	},
	
	showNext: function() {
		this.doCardNavigation(1);
	},
	
	doCardNavigation: function (incr) {
		var me = this, layout = me.contentContainer.getLayout();
		var next = me.currentCardIdx + incr;
		me.currentCardIdx = next;
		layout.setActiveItem(next);
		
		me.titleLabel.setText(me.contentArray[next].title);
		me.prevBtn.setVisible(next > 0);
		me.nextBtn.setVisible(next < me.contentArray.length - 1);
	},
	
	getContainerHtml: function(path, sourceId) {
		var me = this, html;
		switch(me.contentType) {
			case 'iframe':
			default:
				html = '<iframe width="100%" height="100%" frameborder="0" src="'+ path + '"></iframe>';
				break;
			case 'pdf':
				html = '<iframe width="100%" height="100%" frameborder="0" src="./lib/pdfjs/web/viewer.html?file='+ me.getFileRealPath(path) + '"></iframe>';
				break;
			case 'image':
				html = '<img width="100%" height="100%" id="' + sourceId + '" src="'+ path + '"></img>';
				break;
			case 'video':
				html = '<video style="background: #000" width="100%" height="100%" autoplay controls id="' + sourceId + '" src="'+ path + '"></video>';
				break;
		}
		return html;
	},
	
	getFileRealPath: function(relativePath) {
    	if (!this.prefixPath) {
    		var location = window.document.location,
    			origin = location.origin,
    			pathname = location.pathname.split('/')[1];
    		this.prefixPath = origin + '/' + pathname + '/';
    	}
    	return this.prefixPath + relativePath;
    }
	
});
	
	