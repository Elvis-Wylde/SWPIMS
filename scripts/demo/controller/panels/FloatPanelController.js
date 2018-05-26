Ext.define('RMIS.controller.panels.FloatPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.floatpanel',
    
    onPanelReady: function(container, width, height, eOpts) {},
    onResize: function(container, width, height, oldWidth, oldHeight, eOpts ) {},
    afterLayout: function() {},
    
    onHide: function() {
    	var me = this;
    	me.unbindEvents();
    	me.view.setStyle({
        	opacity: 0
        });
    },
    
    afteranimate: function() {
    	var me = this, view = me.view;
    	me.bindEvents();
    	me.updatePanel();
    },
    
    onRender: function(panel) {
    	panel.getEl().on('mouseover', function() {
    		panel.getEl().setOpacity(1);
    	});
    	panel.getEl().on('mouseout', function() {
    		panel.getEl().setOpacity(.9);
    	});
    },
    
    restore: function() {
    	this.clearCesiumEntities();
    },
    
    bindEvents: function() {
    	var me = this;
    	me.mon(me.getCesiumEx(), {
    		scope: me,
    		switchIntoBasin: me.onSwitchIntoBasin,
    		switchIntoProject: me.onSwitchIntoProject,
    		switchIntoProvince: me.onSwitchIntoProvince,
    		entityClicked: me.onEntityClicked
    	});
    },
    
    unbindEvents: function() {
    	var me = this;
    	me.mun(me.getCesiumEx(), {
    		scope: me,
    		switchIntoBasin: me.onSwitchIntoBasin,
    		switchIntoProject: me.onSwitchIntoProject,
    		switchIntoProvince: me.onSwitchIntoProvince,
    		entityClicked: me.onEntityClicked
    	});
    },
    
    onCardClick: function(me, catalog) {
    	var lastView = me.getViewModel().get('currentView');
    	if (lastView == catalog) {
    		return;
    	}
    	var refs = me.getReferences();
    	refs[lastView].setSelected(false);
    	me.getViewModel().set('currentView', catalog);
    	refs[catalog].setSelected(true);
    	
    	var pieContainer = refs.piecontainer;
    	var store = refs.piechart.getStore();
    	store.clearFilter(true);
		store.filterBy(function(record) {
			return record.get(catalog) > 0;
		});
    	pieContainer.removeAll(true);
    	pieContainer.add(me.getPieChart(catalog, store));
    },
    
    onSwitchIntoProvince: function(promise) {
    	this.cleanOverlays();
    },
    
    onSwitchIntoBasin: function(basinId, basinName) {
    	this.cleanOverlays();
    },
    
    onSwitchIntoProject: function(project) {
    	this.cleanOverlays();
    },
    
    cleanOverlays: function() {
    	var cesiumEx = this.getCesiumEx();
    	cesiumEx.infoboxOverlay.hideOverlay();
    },
    
    /**
     * 地图元素选择后的事件处理接口
     * @param {String} id 元素的id，可能为流域、电站、区县、或其他元素（变更点位、居民户点位等）的id
     * @param {Number} id 元素的类型，参考CesiumExtension的entity类型常量，根据功能需求，针对不同类型可显示不同的infobox内容
     * @param {Number} longitude 元素基本坐标的经度，用于定位infobox位置
     * @param {Number} latitude 元素基本坐标的纬度，用于定位infobox位置
     * @param {Number} entity 地图元素对象
     */
    onEntityClicked: Ext.emptyFn,
    
    updatePanel: function () {
    	var me = this, 
    		store = me.getMainStore(), 
    		filters = me.getMainStoreFilter(),
    		slience = filters ? true : false;
    	if (!store) {
    		return;
    	}
    	store.clearFilter(slience);
    	if (filters) {
    		store.filter(filters);
    	}
    	if (!store.isLoaded()) {
    		store.load({
    			scope: me,
        		callback: function() {
        			me.updateContents(store.getData().getRange());
        		}
    		});
    	} else {
    		me.updateContents(store.getData().getRange());
    	}
    },
    
    setMainStoreFilter: function(filters) {
    	this._mainStoreFilter = filters;
    },
    
    getMainStoreFilter: function() {
    	return this._mainStoreFilter;
    },
    
    getMainStore: function() {
    	return null;
    },
    
    getCesiumEx: function() {
    	return this.getMainViewModel().get('cesiumEx');
    },
    
    getMainViewModel: function() {
    	return RMIS.getApplication().view.getViewModel();
    },
    
    clearCesiumEntities: function() {
    	var cesiumEx = this.getCesiumEx();
    	cesiumEx.infoboxOverlay.hideOverlay();
    	/*
    	cesiumEx.removeAllLabel();
    	cesiumEx.renderModifications([], 0);
    	cesiumEx.renderProjects([], false, 0);
    	cesiumEx.renderResidents([], 0);
    	cesiumEx.renderCommunities([], 0);
    	cesiumEx.renderConstructions([], 0);
    	*/
    	cesiumEx.renderMachines([], 0);
    	cesiumEx.renderImages([], 0);
    	cesiumEx.renderVideos([], 0);
        cesiumEx.renderRoad(false, [], 0);
    	for (var key in cesiumEx.singleImageLayerSet) {
    		cesiumEx.singleImageLayerSet[key].show = false;
    	}
    },
    
    generateFilters: function(param, opt) {
    	var filterFn = function(record) {
    		return true;
    	};
    	if (param.length > 0) {
    		filterFn = function(record) {
    			var match = opt == "and" ? true : false;
        		for (var i = 0, len = param.length; i < len; i++) {
        			var property = param[i].property,
        				value = param[i].value,
        				anyMatch = param[i].anyMatch ? true : false;
        			if (opt == "and") {
        				match = match && (anyMatch ? (record.get(property).toString().indexOf(value) >= 0) : (record.get(property) == value));
        				if (!match) {
        					break;
        				}
        			} else {
        				match = match || (anyMatch ? (record.get(property).toString().indexOf(value) >= 0) : (record.get(property) == value));
        				if (match) {
        					break;
        				}
        			}
        		}
        		return match;
        	};
    	}
    	return new Ext.util.Filter({
    		filterFn: filterFn
    	});
    },
    
    quickTip: function(msg) {
    	Ext.toast({
            html: msg,
            closable: false,
            align: 't',
            slideInDuration: 400,
            minWidth: 400
        });
    },
    
    closeCurrentWindow: function() {
    	var me = this,
			mainViewModel = me.getMainViewModel(),
			win = mainViewModel.get('CurrentWindow');
		if (win) {
			win.destroy();
			mainViewModel.set('CurrentWindow', null);
		}
    },
    
    showCurrentWindow: function(windowCls, sourceCmp, windowConfig) {
    	var me = this;
    	me.closeCurrentWindow();
    	var window = Ext.create(windowCls, windowConfig);
		window.show(sourceCmp);
		me.getMainViewModel().set('CurrentWindow', window);
    },
    
    getFloatPanel: function(panelType) {
    	return RMIS.getApplication().view.getController().getFloatPanel(panelType);
    }
    
    // updatePanelHeight: function() {}
});