Ext.define('RMIS.controller.panels.PreProcessStatPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.preprocessstatpanel',
    
    requires: [
    	// 'RMIS.view.windows.ProjectStatDetailWindow'
    ], 
    
    // ==== override ==== //
    onPanelReady: function(container, width, height, eOpts) {
    	this.updatePanelHeight();
    },
    
    getMainStore: function() {
    	return this.view.projectStore;
    },
    
    updatePanelHeight: function() {
    	var me = this,
			refs = me.getReferences(),
			viewHeight = me.view.getHeight(),
			leftHeight = viewHeight - refs.cardcontainer.getHeight() - refs.piecontainer.getHeight() - 15;
		refs.projectgrid.setHeight(leftHeight);
    },
    
    updateContents: function(records) {
    	var me = this, 
			store = me.getMainStore(), 
			totalCount = 0, totalCap = 0, totalInvest = 0, pieData = [], 
			projectItems = [], groups = store.getGroups();
		
		groups.each(function(group, index, len) {
			var zjrl = parseFloat(group.sum('ZJRL').toFixed(2)), gcztz = parseFloat(group.sum('GCZTZ').toFixed(2));
			// var zjrl = group.sum('ZJRL'), gcztz = group.sum('GCZTZ');
			totalCount += group.length;
			totalCap += zjrl;
			totalInvest += gcztz;
			
			projectItems = projectItems.concat(group.items);
			pieData.push({'text': group.getConfig('groupKey'), 'PCOUNT': group.length, 'ZJRL': zjrl, 'GCZTZ': gcztz});
		});
		
		var refs = me.getReferences();
		var data = refs.PCOUNT.getData();
		data.amount = totalCount;
		refs.PCOUNT.update(data);
		
		data = refs.ZJRL.getData();
		data.amount = Math.round(totalCap);
		refs.ZJRL.update(data);
		
		data = refs.GCZTZ.getData();
		data.amount = Math.round(totalInvest);
		refs.GCZTZ.update(data);
		
		refs.piechart.getStore().loadData(pieData);
		refs.piechart.redraw();
		
		me.getCesiumEx().renderProjects(projectItems, false, 0);
    },
    
    // ==== events handler ====//
    onSwitchIntoBasin: function(basinId, basinName) {
    	
    },
    
    onSwitchIntoProject: function(project) {
    	var me = this, promise,
    		cesiumEx = me.getCesiumEx(),
    		mainViewModel = me.getMainViewModel();
    		me.closeCurrentWindow();//add by Raven
		mainViewModel.get('CurrentFloatPanel').hide();
    	var panel = me.getFloatPanel('preprocessdetailpanel');
    	panel.restore();
    	mainViewModel.set('CurrentFloatPanel', panel);
    	me.callParent(arguments);
    },
    
    onSwitchIntoProvince: function(promise) {
    	var me = this;
    	promise.then(function() {
    		me.setMainStoreFilter(null);
    		me.updatePanel();
    	});
    	me.callParent(arguments);
    },
    
    restore: function() {
    	var me = this;
    	
    	me.setMainStoreFilter(null);
    	me.callParent();
    },
    
    // ==== UI events handler ====//
    
    onPieTooltipRender: function(tooltip, record, item) {
    	tooltip.setHtml(record.get('text') + ': ' + record.get(this.getViewModel().get('currentView')));
    },
    
    onGridRowClick: function(grid, record, rowIndex, e, eOpts) {
    	var me = this;
    	me.getCesiumEx().flyToProject(record.get('id'));
    },

    onGridRowDBClick: function(grid, record, rowIndex, e, eOpts) {
    	var me = this;
    	var node = RMIS.getApplication().getStore('RegionTree').getNodeById(record.get('id'));
    	RMIS.getApplication().view.getViewModel().set('selectedRegion', node);
    },
    
    onDetailBtnClick: function(btn) {
    	var me = this;
//		me.showCurrentWindow('RMIS.view.windows.ProjectStatDetailWindow', btn, {
//			store: me.getMainStore()
//		});
    }
    
});