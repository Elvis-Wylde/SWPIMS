Ext.define('RMIS.view.main.MapViewContainer', {
	extend: 'Ext.container.Container',
	alias: 'view.mapview',
    xtype: 'mapview',
    cls: 'map-container',
    requires: [
        'Ext.layout.container.Fit',
        'RMIS.model.cesium.Extension',
        'RMIS.controller.main.MapViewController'
    ],
    controller: 'mapview',
    
    layout: 'fit',
    bodyPadding: 0,    
    padding: 0,
    
	initComponent: function() {
		var me = this;
		
		var mapPanel = Ext.create('Ext.panel.Panel', {
			id: 'mappanel',
	    	reference: 'mappanel',
	        html: '<div id="cesium-container"></div>',
	        flex: 1,
	        border: 0,
	        listeners: {
	            boxready: 'onContainerReady',
	            afterlayout: 'afterLayout',
	            resize: 'onMapResize'
	        }
		});
		
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			floating: true,
			reference: 'maptoolbar',
			x: 250,
			y: 64,
			width: 500,
			height: 44,
			border: 0,
			focusCls: '',
			style: {
				background: 'transparent'
			},
			items: [{
				xtype: 'segmentedbutton',
	            items: [{
	            	text: '2D',
	                value: '2D'
	            }, {
	            	value: '3D',
	                text: '3D',
	                pressed: true
	            }],
	            listeners: {
	            	// toggle: 'onSwitchMap'
	            }
			}, {
				tooltip:'基础图层',
	            iconCls: 'x-fa fa-map-o',
	            focusCls: '',
	            menu: [{
	    			xtype: 'menucheckitem',
	    			text: '晕渲底图',
	    			listeners:{
	    				checkchange: 'switchImageProvider'
	    			}
	    		}, {
	    			xtype: 'menucheckitem',
	    			text: '河流水系',
	    			listeners:{
	    				checkchange: 'toggleRiverLayer'
	    			}
	    		}, {
	    			xtype: 'menucheckitem',
	    			text: '交通路网',
	    			listeners:{
	    				checkchange: 'toggleRoadLayer'
	    			}
	    		}]
			}, {
				iconCls: 'x-fa fa-search',
				tooltip: '地名搜索定位',
	            focusCls: '',
	            enableToggle: true,
	            handler: 'onLocSearch'
			}, {
				tooltip: '距离测量',
				focusCls: '',
    			handler: 'showPenddingMsg',
    			iconCls: 'x-fa fa-arrows-v'
    		}, {
    			tooltip: '面积测量',
    			focusCls: '',
    			handler: 'showPenddingMsg',
    			iconCls: 'x-fa fa-clone'
			}, {
				tooltip: '增加点位',
				focusCls: '',
				handler: 'showPenddingMsg',
    			iconCls: 'x-fa fa-map-marker'
    		}, {
    			tooltip: '增加折线',
    			focusCls: '',
    			handler: 'showPenddingMsg',
    			iconCls: 'x-fa fa-line-chart'
    		}, {
    			tooltip: '增加多边形',
    			focusCls: '',
    			handler: 'showPenddingMsg',
    			iconCls: 'x-fa fa-lemon-o'
			}]
		});
		
		me.items = [mapPanel, toolbar];
		toolbar.show();
		
		me.callParent();
	}
    
    
});