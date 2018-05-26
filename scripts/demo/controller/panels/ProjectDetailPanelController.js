Ext.define('RMIS.controller.panels.ProjectDetailPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.projectdetailpanel',
    
    onSwitchIntoProvince: function(promise) {
    	this.backToStatPanel();
    },
    
    onSwitchIntoBasin: function(basinId, basinName) {
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
    
    showPdfFile: function(btn, evt) {
    	var me = this,
    		app = RMIS.getApplication(),
			id = me.view.record.get('id'),
			title = me.view.record.get('name') + me.view.record.get('ptype');
    	app.showResourcesViewer('pdf', [
    		{sourcePath: 'data/files/' + id + '.pdf', title: title + '台账-总体信息'},
    		{sourcePath: 'data/files/wddtz-ymgh.pdf', title: title + '台账-移民规划'},
    		{sourcePath: 'data/files/wddtz-azss.pdf', title: title + '台账-安置实施'},
    		{sourcePath: 'data/files/wddtz-hqfc.pdf', title: title + '台账-后期扶持'}
    	], btn, 0);
    },
    
    imagePreviewClicked: function(dataview, record, item, index, e, eOpts) {
    	var me = this,
			app = RMIS.getApplication(),
			id = me.view.record.get('id'),
			sourceId = 'image-' + id + '-',
			title = me.view.record.get('name') + me.view.record.get('ptype') + '照片资料',
			store = record.store,
			contentArray = [], pathArray = [], titleArray = [];
    	
    	store.getData().each(function(record, idx) {
    		contentArray.push({sourcePath: record.get('url'), sourceId: sourceId + idx, title: title});
    	});
		app.showResourcesViewer('image', contentArray, item, index);
    },
    
    updateRecord: function(record) {
    	var me = this,
    		refs = me.getReferences(), 
    		viewModel = me.getViewModel();
    	me.view.record = record;
    	viewModel.set('projectTitleHtml', me.getTitleHtml());
    	viewModel.set('locHtml', me.getLocHtml());
    	me.getCesiumEx().renderProjects([record], true, 1).then(function() {
    		refs.contentform.getForm().reset();
        	refs.contentform.getForm().loadRecord(record);
        	me.renderMachines(record.get("id"));
        	me.renderBackground(record.get("id"));
        	// me.renderBuilding();
    	});
    },
    
    renderMachines: function(id) {
    	var me = this, store = RMIS.getApplication().getStore('Machines');
    	store.clearFilter();
    	store.filter('projectid', id);
    	// console.log(store.getData().getRange());
    	me.getCesiumEx().renderMachines(store.getData().getRange(), 0);
    },
    
    renderBackground: function(id) {
    	//if (id == "2") {
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
    	//}
    },
    
    renderBuilding: function() {
    	var me = this;
    	// me.getCesiumEx().viewer.scene.globe.depthTestAgainstTerrain = true;
    	var positions = [111.11345584,25.47166143,111.11293052,25.47104908,111.11291187,25.47106705,111.11281638,25.47099876,111.11309162,25.47060518,111.11319346,25.47066514,111.11299444,25.47095462,111.11354889,25.47158747];
    	var orangePolygon = me.getCesiumEx().viewer.entities.add({
    	    name : 'Orange polygon with per-position heights and outline',
    	    polygon : {
    	        hierarchy : Cesium.Cartesian3.fromDegreesArray(positions),
    	        extrudedHeight: 365.0,
    	        material : Cesium.Color.GREEN,
    	        closeTop : true,
    	        closeBottom : false
    	    }
    	});
    },
    
    getProjectRecord: function(id) {
    	var store = RMIS.getApplication().getStore('Projects');
    	return store.getById(id);
    },
    
    backToStatPanel: function() {
		var me = this,
			mainViewModel = me.getMainViewModel();
		
		me.closeCurrentWindow();
		var panel = me.getFloatPanel('projectstatpanel');
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
    	var basin = me.view.getViewModel().get('basinMap')[record.get('basin')];
    	
    	var result = '<p><span style="font-size: 18px; font-weight: bold; text-shadow: 2px 2px 3px #000"><span>' + record.get('location')  + '</span><span>' + record.get('name') + '</span></span></p>';
    	result += '<p><span style="font-size: 13px;">工程建设状态 ' + record.get('GCJSJD') + '</span><br/>';
    	result += '<span style="font-size: 13px;">工程总投资 ' + record.get('GCZTZ') + ' 万元，' + '装机容量 ' + record.get('ZJRL') + ' 兆瓦' + '</span></p>';
    		
    	return result;
    },
    
    getLocHtml: function() {
    	var me = this,
			record = me.view.record;
    	if (!record) {
    		return "";
    	}
		var result = '<table style="margin: 5px; width: 450px"><tr><td><img src="./resources/images/u1761.png" style="width: 24px; height: 24px"/></td><td><div style="width: 415px;overflow: hidden; text-overflow:ellipsis;white-space:nowrap;">' + record.get('BZWZ') + '</div></td></tr></table>';
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