Ext.define('RMIS.controller.main.MapViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mapview',
    
    requires: [
    	'RMIS.model.cesium.Extension'
    ],
    
    onContainerReady: function(container, width, height, eOpts) {
    	var me = this,
    		mainViewModel = RMIS.getApplication().view.getViewModel(),
    		cesiumEx = me.getCesiumEx();
    	
    	me.updateViewHeight();
    	
    	Ext.on('resize', function(width, height) {
    		me.updateViewHeight();
    	});
    	
    	cesiumEx.loadGeoJson('data/GeoJSON/city_gx.json', cesiumEx.geoJsonSet).then(function() {
    		cesiumEx.renderGeoJson(['450100', '450200', '450300', '450400', '450500', '450600', '450700', '450800', '450900', '451000', '451100', '451200', '451300', '451400']);
    	});
    	
    	cesiumEx.initLocation(5).then(function() {
    		RMIS.getApplication().view.unmask();
    		try {
    		var mainController = RMIS.getApplication().view.getController();
    		var panel = mainController.getFloatPanel('projectoverview');
    		// var panel = mainController.getFloatPanel('emptypanel');
    		panel.restore();
    		mainViewModel.set('CurrentFloatPanel', panel);
    		mainViewModel.set('initialized', true);
    		} catch (e) {
    			console.log(e);
    		}
    		
    		var projectStore = RMIS.getApplication().getStore('Projects');
    		projectStore.load({
    			callback: function(records) {
    				// console.log(records);
    				cesiumEx.renderProjects(records, false, 0);
    			}
    		})
		});
    },
    
    afterLayout: function(container, layout) {
    	// this.cesiumEx.mapchartOverlay.updateChart();
    },
    
    onMapResize: function() {
    	// console.log('resize arguments: ', arguments);
    	this.updateToolbarPosition();
    },
    
    updateViewHeight: function() {
    	var me = this,
    		headerHeight = 64,
    		cesiumPanel = me.getReferences().mappanel,
    		height = document.body.clientHeight - headerHeight;
    	
    	cesiumPanel.setHeight(height);
    	Ext.get('cesium-container').setHeight(height);
    	
    	// console.log(cesiumPanel);
    	me.updateToolbarPosition();
    },
    
    updateToolbarPosition: function() {
    	var me = this,
    		cesiumPanel = me.getReferences().mappanel,
    		toolbar = me.getReferences().maptoolbar,
    		headerHeight = 64,
    		containerX = document.body.clientWidth - cesiumPanel.getWidth(),
    		containerY = headerHeight;
    	
    	toolbar.setPosition(containerX, containerY);
    },
    
    getCesiumEx: function() {
    	var mainViewModel = RMIS.getApplication().view.getViewModel(),
    		cesiumEx = mainViewModel.get('cesiumEx');
    	if (!cesiumEx) {
    		cesiumEx = Ext.create('RMIS.model.cesium.Extension');
    		mainViewModel.set('cesiumEx', cesiumEx);
    	}
    	return cesiumEx;
    },
    
    switchImageProvider: function(item, checked, eOpts) {
    	var me = this,
    		cesiumEx = me.getCesiumEx();
    	cesiumEx.viewer.imageryLayers.get(0).show = !checked;
    	cesiumEx.viewer.imageryLayers.get(1).show = checked;
    },
    
    toggleRiverLayer: function(item, checked, eOpts) {
    	this.getCesiumEx().watlayer.show = checked;
    },
    
    toggleRoadLayer: function(item, checked, eOpts) {
    	this.getCesiumEx().cialayer.show = checked;
    },
    
    onLocSearch: function(btn) {
    	var me = this;
    	if (btn.pressed) {
    		if (!me.searchWin) {
    			me.searchWin = Ext.create('Ext.window.Window', {
    	    		width: 232,
    	    		height: 30,
    	    		header: false,
    	    		resizable: false,
    	    		draggable: false,
    	    		style: {
    	    			background: 'transparent',
    	    			border: '0px'
    	    		},
    	    		bodyStyle: {
    	    			background: 'transparent',
    	    			border: '0px'
    	    		},
    	    		items: [{
    	    			xtype: 'searchfield',
    	    			width: 232
    	    		}]
    	    	});
    		}
    		me.searchWin.showBy(btn, 'bl', [0, 5]);
    	} else {
    		me.searchWin.hide();
    	}
    },
    
    showPenddingMsg: function() {
    	Ext.toast({
            html: '正在研发……',
            closable: false,
            align: 't',
            slideInDuration: 400,
            minWidth: 400
        });
    }
    
});