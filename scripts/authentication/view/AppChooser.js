Ext.define('RMIS.view.AppChooser', {
    extend: 'Ext.window.Window',
    
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
	alwaysOnTop: true,
	scrollable: false,
	
	width: 550,
	height: 300,
	
	layout: 'fit',
	
	style: {
		border: 0,
		boxShadow: 'rgb(0,0,0) 0px 0px 20px',
		backgroud: 'transparent'
	},
	
	bodyStyle: {
		border: 0,
		backgroud: 'transparent'
	},
	
	initComponent: function() {
		var me = this;
		
		var chooserView = Ext.create('Ext.view.View', {
			width: 550,
    		// height: 100,
    		reference: 'chooserview',
    		padding: '35 0 35 100',
    		store: Ext.create('Ext.data.Store', {
    			data: [
    				{ 'src': './resources/images/map-sample.png', 'caption': '省级业务管理', 'value': 'province' },
    				{ 'src': './resources/images/map-sample.png', 'caption': '省本级信息管理', 'value': 'county' }
    			]
    		}),
    		tpl: '<tpl for=".">\
		            <div style="margin-bottom: 10px;" class="appchooser-view thumb-wrap">\
		            <img width="80" height="80" src="{src}" />\
		            <br/><span><strong>{caption}</strong></span>\
		          </div>\
		      </tpl>',
	        trackOver: true,
    		overItemCls: 'appchooser-view x-item-over',
    		itemSelector: 'div.thumb-wrap',
    		listeners: {
    			select: function(view, record, index, eOpts) {
    				if (record) {
    					confirmBtn.setDisabled(false);
    				}
    			}
    		}
		});
		
		var confirmBtn = Ext.create('Ext.button.Button', {
			text: '确认',
    		width: 120,
    		height: 40,
    		disabled: true,
    		handler: function() {
    			var value = chooserView.getSelectionModel().getSelection()[0].get('value');
    			window.location.replace(value + ".html");
//    			if (selected == 1) {
//    				window.location.replace("province.html");
//    			} else {
//    				window.location.replace("county.html");
//    			}
    		}
		});
		
		me.items = [{
			xtype: 'container',
			layout: {
		        type: 'vbox',
		        align: 'center',
		        pack: 'center'
		    },
		    items: [{
		    	xtype: 'label',
		    	text: '请选择要进入的应用:',
		    	width: 550,
		    	padding: 15,
		    	style: {
		    		fontSize: '20px',
		    		fontWeight: 'bold',
		    		color: '#5DADE2',
		    		borderBottom: '2px solid #5DADE2'
		    	}
		    }, {
	    		xtype: 'container',
	    		cls: 'appchooser-view',
	    		border: false,
	    		bodyBorder: false,
	    		scrollable: false,
	    		height: 190,
	    		items: [chooserView]
		    }, {
		    	xtype: 'container',
		    	width: 550,
		    	height: 60,
		    	padding: '10 0 10 420',
		    	style: {
	    			borderTop: '1px solid #E5E8E8'
	    		},
		    	items: [confirmBtn]
		    }]
		}];
			
		me.callParent();
	}
});