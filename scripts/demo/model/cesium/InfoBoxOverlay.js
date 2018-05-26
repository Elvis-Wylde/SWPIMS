Ext.define('RMIS.model.cesium.InfoBoxOverlay', {
	extend: 'RMIS.model.cesium.Overlay',
	
	requires: [
	    'RMIS.view.infobox.MachineInfobox'
	    /*
	    // 信息管理
		'RMIS.view.infobox.SimpleMessageInfobox',				// 测试使用
		'RMIS.view.infobox.MaterialStatInfobox',				// 移民规划-主要实物指标
		'RMIS.view.infobox.RuralPlanningInfobox',				// 移民规划-农村移民规划
		'RMIS.view.infobox.TownPlanningInfobox',				// 移民规划-城集镇迁建规划
		'RMIS.view.infobox.ConstructionPlanningInfobox',		// 移民规划-专业项目复建规划
		'RMIS.view.infobox.ResettleBudgetInfobox',				// 移民规划-移民补偿概算
		'RMIS.view.infobox.ResidentImplStatInfobox',			// 安置实施-移民户安置-统计
		'RMIS.view.infobox.ResidentImplDetailInfobox',			// 安置实施-移民户安置-详情
		'RMIS.view.infobox.CommunityStatInfobox',				// 安置实施-集中居民点-统计
		'RMIS.view.infobox.CommunityDetailInfobox',				// 安置实施-集中居民点-详情
		'RMIS.view.infobox.TownimplPanelInfobox',				// 
		'RMIS.view.infobox.TownimplDetailPanelInfobox',			//
		'RMIS.view.infobox.ConstructionImplDetailInfobox',   	// 安置实施-专业项目复建-详情
		'RMIS.view.infobox.ConstructionImplStatInfobox',    	// 安置实施-专业项目复建-统计
		'RMIS.view.infobox.PeopleSupportInfobox',				// 后期扶持-后扶人口
		'RMIS.view.infobox.ProjectSupportInfobox',				// 后期扶持-后扶项目
		'RMIS.view.infobox.MoneySupportInfobox',				// 后期扶持-后扶资金
		// 业务管理
		'RMIS.view.infobox.PlanningModifyStatInfobox',			// 规划管理-规划变更-变更统计
		'RMIS.view.infobox.PlanningModifyDetailInfobox'			// 规划管理-规划变更-变更详情
		*/
	],
	
	singleMode: true,
	
	viewCollection: {},
	
	constructor: function(config) {
		this.callParent([config]);
	},

	_updateOverlayContents: function(overlay, options) {
		var me = this,
			width = overlay.data.width,
			height = overlay.data.height;
    	if (!me._panel) {
    		me._panel = Ext.create('Ext.panel.Panel', {
        		viewModel: {
        			data: {
        				title: ''
        			}
        		},
        		layout: 'fit',
        		hidden: true,
        		renderTo: overlay,
        		bind: {
        			title: '{title}'
        		},
        		closable: true,
        		closeAction: 'hide',
        		closeToolText: null,
        		style: {
        			opacity: '0.9',
        	    	filter: 'alpha(opacity=90)'
        		},
        		listeners: {
        			close: function() {
        				me.hideOverlay();
        			}
        		}
        	});
    	}
    	me._panel.setHidden(false);
		me._panel.setWidth(width);
		me._panel.setHeight(height);
    	
		var contents = options.contents,
			view = me.getView(contents);
		me._panel.getViewModel().set('title', contents.title);
		me._panel.removeAll(false);
		if (view) {
			me._panel.add(view);
		}
	},
	
	getView: function(contents) {
		var me = this, 
			viewType = contents.viewType,
			record = contents.record,
			view = me.viewCollection[viewType];
		if (!view) {
			var config = Ext.apply({
				xtype: viewType,
				record: record
			}, contents.params);
			view = Ext.create(config);
			me.viewCollection[viewType] = view;
		} else {
			view.updateRecord(record, contents.params);
		}
		return view;
	}

});