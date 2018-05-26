Ext.define('RMIS.controller.panels.PreProcessDetailPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.preprocessdetailpanel',
    
    onSwitchIntoProvince: function(promise) {
    	this.backToStatPanel();
    },
    
    onSwitchIntoProject: function(project, promise) {
    	var me = this;
    	me.closeCurrentWindow();
		me.updateRecord(project);
    },
    
    restore: function() {
    	var me = this, 
    		mainViewModel = me.getMainViewModel(),
    		currentProject = mainViewModel.get('CurrentProject');
    	
    	me.callParent();
    	me.getCesiumEx().renderGeoJson([]);
    	me.updateRecord(me.getProjectRecord(currentProject));
    },
    
    updateRecord: function(record) {
    	var me = this,
    		viewModel = me.getViewModel();
    	me.view.record = record;
    	viewModel.set('projectTitleHtml', me.getTitleHtml());
    	me.getCesiumEx().renderProjects([record], true, 1).then(function() {
        	me.renderMachines(record.get("id"));
        	me.renderBackground(record.get("id"));
    	});
    },
    
    renderMachines: function(id) {
    	var me = this, store = RMIS.getApplication().getStore('Machines');
    	store.clearFilter();
    	store.filter('projectid', id);
    	me.getCesiumEx().renderMachines(store.getData().getRange(), 0);
    },
    
    renderBackground: function(id) {
		var me=this, cesiumEx = me.getCesiumEx(), layers = cesiumEx.viewer.imageryLayers;
		if (!cesiumEx.singleImageLayerSet['guanyang']) {
			cesiumEx.singleImageLayerSet['guanyang'] = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
		    	url: 'data/files/guanyang.png',
		    	// rectangle: Cesium.Rectangle.fromDegrees(111.10146839, 25.46846577, 111.11750987, 25.47661062)
		    	// rectangle: Cesium.Rectangle.fromDegrees(111.10159077, 25.46831336, 111.11763225, 25.47645821)
		    	rectangle: Cesium.Rectangle.fromDegrees(111.10152077, 25.46825577, 111.11770225, 25.47663062)
		    }), {
			  	alpha: 0.7
		    });
			layers.add(cesiumEx.singleImageLayerSet['guanyang']);
		}
		cesiumEx.singleImageLayerSet['guanyang'].show = (id == "2");
    },
    
    getProjectRecord: function(id) {
    	var store = RMIS.getApplication().getStore('Projects');
    	return store.getById(id);
    },
    
    backToStatPanel: function() {
		var me = this,
			mainViewModel = me.getMainViewModel();
		me.closeCurrentWindow();
		var panel = me.getFloatPanel('preprocessstatpanel');
		me.view.hide();
		panel.restore();
		mainViewModel.set('CurrentFloatPanel', panel);
    },
    
    getTitleHtml: function() {
    	var me = this,
    		record = me.view.record;
    	if (!record) {
    		return "";
    	}
    	
    	var result = '<p><span style="font-size: 18px; font-weight: bold; text-shadow: 2px 2px 3px #000"><span>' + record.get('location')  + '</span><span>' + record.get('name') + '</span></span></p>';
    	result += '<p><span style="font-size: 13px;">工程建设状态 ' + record.get('GCJSJD') + '</span><br/>';
    	result += '<span style="font-size: 13px;">工程总投资 ' + record.get('GCZTZ') + ' 万元，' + '装机容量 ' + record.get('ZJRL') + ' 兆瓦' + '</span></p>';
    		
    	return result;
    },
    
    onEntityClicked: function(id, type, longitude, latitude, entity) {
    	var me = this,
			cesiumEx = me.getCesiumEx(),
			infoboxOverlay = cesiumEx.infoboxOverlay;
    	if (type == cesiumEx.machineEntity) {
    		var record = entity.record;
    		infoboxOverlay.showOverlay({
	    		longitude: longitude,
	    		latitude: latitude,
	    		width: 450,
	    		height: 300,
	    		offset: {
	    			x: 0, y: -20
	    		},
	    		contents: {
	    			title: record.get('name'),
	    			viewType: 'machineinfobox',
	    			record: record
	    		}
	    	});
    	}
    }
    
});