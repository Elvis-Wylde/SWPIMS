Ext.define('RMIS.controller.panels.ConstructStatPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.constructstatpanel',
    
    requires: [
      //'RMIS.view.windows.TownImplPanelWindow',
      //"RMIS.view.windows.TownImplListPanelWindow"
    ], 
    
    onPanelReady: function(container, width, height, eOpts) {
    	this.updatePanelHeight();
    },
    
    getMainStore: function() {
    	return this.view.mainStore;
    },
    
    updatePanelHeight: function() {
    	var me = this,
			refs = me.getReferences(),
			viewHeight = me.view.getHeight(),
			leftHeight = viewHeight - refs.persent.getHeight() - refs.legend.getHeight() - refs.chart.getHeight() - 15;
		refs.statgrid.setHeight(leftHeight);
    },
    
    updateContents: function(records) {
    	var me = this, 
			refs = me.getReferences(),
			cesiumEx = me.getCesiumEx(),
			totalCount = 0, planCount = 0, completeCount = 0;
    	
    	Ext.Array.each(records, function(record, index, length) {
    		totalCount = totalCount.accAdd(record.get('GCZTZ'));
			planCount = planCount.accAdd(record.get('JHZJ'));
			completeCount = completeCount.accAdd(record.get('SYZJ')); 
    	});
		
		refs.totalTask.update({amount: totalCount.ksFormat(2)});
		refs.planTask.update({amount: planCount.ksFormat(2)});
		refs.completeTask.update({amount: completeCount.ksFormat(2)});
		
		refs.persent1.updateData(planCount, totalCount);
		refs.persent2.updateData(completeCount, totalCount);
		refs.persent3.updateData(completeCount, planCount);
		
		cesiumEx.renderProjects(records, false, 0);
		
    },
    
    onSwitchIntoProvince: function(promise) {
    	var me = this;
    	promise.then(function() {
    		me.setMainStoreFilter(null);
    		me.updatePanel();
    	});
    	me.callParent(arguments);
    },
    
    onSwitchIntoProject: function(project) {
    	var me = this, promise,
			cesiumEx = me.getCesiumEx(),
			mainViewModel = me.getMainViewModel();
			me.closeCurrentWindow();//add by Raven
		mainViewModel.get('CurrentFloatPanel').hide();
		var panel = me.getFloatPanel('constructdetailpanel');
		panel.restore();
		mainViewModel.set('CurrentFloatPanel', panel);
		me.callParent(arguments);
    },
    
    restore: function() {
    	var me = this;
    	me.setMainStoreFilter(null);
    	me.callParent();
    },
    
    onAxisLabelRender: function (axis, label, layoutContext) {
    	return label + '%';
    },
    
    onBarSeriesTooltipRender: function (tooltip, record, item) {
    	var field = item.field;
    	if (field == 'JHZJ') {
    		tooltip.setHtml(record.get('name') + '计划资金：' + record.get('JHZJ').toFixed(2)+ '万元');
    	} else {
    		tooltip.setHtml(record.get('name') + '已使用资金：' + record.get('SYZJ').toFixed(2)+ '万元');
    	}
    	
    },

    onLineSeriesTooltipRender: function (tooltip, record, item) {
    	var field = item.field;
    	if (field == 'planPercent') {
    		tooltip.setHtml(record.get('name') + '计划占任务：' + record.get('planPercent') + '%');
    	} else {
    		tooltip.setHtml(record.get('name') + '已使用占任务：' + record.get('completePercent') + '%');
    	}
    },
    
    onEntityClicked: function(id, type, longitude, latitude, entity) {
    	
    },
    
    onDetailBtnClick: function(btn) {
//		var me = this, 
//			refs = me.getReferences(),
//			layout = refs.subgrid.getLayout();
//		if (layout.getActiveItem() == refs.statgrid) {
//			me.showCurrentWindow('RMIS.view.windows.ConstructionImplWindow', btn, {
//				store: me.getMainStore(), catalog: 'stat'
//			});
//		}
    }

});