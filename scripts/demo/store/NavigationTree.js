Ext.define('RMIS.store.NavigationTree', {
	extend: 'Ext.data.TreeStore',
	
	storeId: 'NavigationTree',
	
	fields: [{
		name: 'text',
		itemId: 'string'
	}],
	
	constructor: function(config) {
        var me = this;

        me.callParent([Ext.apply({
            root: me.getRootData('info')
        }, config)]);
    },
	
	switchData: function(catalog) {
		var me = this;
		me.setRoot(me.getRootData(catalog));
	},
	
	getRootData: function(catalog) {
			return {
				expanded: true,
				children: [{
					text: '基础信息管理',
					iconCls: 'x-fa fa-pie-chart',
					// viewType: 'mapview',
					//panelType: 'projectoverview',
					//leaf: true
					selectable: false,
					expanded: true,
					children: [{
						text: '风电场概况',
						iconCls: 'x-fa fa-map-marker',
                        viewType: 'mapview',
                        panelType: 'projectoverview',
						leaf: true
					}, {
						text: '风电场前期信息',
						iconCls: 'x-fa fa-map-signs',
						viewType: 'mapview',
						panelType: 'preprocessoverview',
						leaf: true
					}]
				}, {
					text: '工程进度管理',
					iconCls: 'x-fa fa-line-chart',
					selectable: false,
					children: [{
                        text: '风电场建设管理',
                        iconCls: 'x-fa fa-road',
                        viewType: 'mapview',
                        panelType: 'constructoverview',
                        leaf: true
					}, {
						text: '风电场进度预警',
						iconCls: 'x-fa fa-warning',
						viewType: 'mapview',
						 panelType: 'emptypanel',
						leaf: true
					}]
				}, {
                    text: '工程投资管理',
                    iconCls: 'x-fa fa-money',
                    selectable: false,
                    children: [{
                        text: '合同管理',
                        iconCls: 'x-fa fa-edit',
                        viewType: 'mapview',
                        panelType: 'emptypanel',
                        leaf: true
                    }, {
                        text: '结算管理',
                        iconCls: 'x-fa fa-cny',
                        viewType: 'mapview',
                        panelType:'balanceoverview',
                        leaf: true
                    }, {
                        text: '合同变更管理',
                        iconCls: 'x-fa fa-exchange',
                        viewType: 'mapview',
                        panelType: 'emptypanel',
                        leaf: true
                    }, {
                        text: '支付信息预警',
                        iconCls: 'x-fa fa-credit-card',
                        viewType: 'mapview',
                        panelType:'emptypanel',
                        leaf: true
                    }]
                }, {
					text: '工程质量管理',
					iconCls: 'x-fa fa-balance-scale',
					selectable: false,
					children: [{
						text: '工序质量检测预警',
						iconCls: 'x-fa fa-sort-amount-asc',
						// iconCls: 'x-fa fa-tasks',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}, {
						text: '工程材料检测预警',
						iconCls: 'x-fa fa-flask',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}, {
						text: '电气设备检测预警',
						iconCls: 'x-fa fa-plug',
						viewType: 'mapview',
						 panelType: 'emptypanel',
						leaf: true
					}]
				}, {
					text: '工程安全管理',
					iconCls: 'x-fa fa-shield',
					selectable: false,
					children: [{
						text: '特种作业人员资质',
						iconCls: 'x-fa fa-address-card-o',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}, {
						text: '安全管理人员资质',
						iconCls: 'x-fa fa-male',
						viewType: 'mapview',
						panelType:'emptypanel',
						leaf: true
					}, {
						text: '特种设备',
						iconCls: 'x-fa fa-wrench',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}, {
						text: '隐患排查与治理',
						iconCls: 'x-fa fa-warning',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}]
				}, {
					text: '工程环保水保管理',
					iconCls: 'x-fa fa-tint',
					selectable: false,
					children: [{
						text: '水土保持',
						iconCls: 'x-fa fa-fire',
						viewType: 'mapview',
						panelType: 'emptypanel',
						leaf: true
					}, {
						text: '土质边坡绿化',
						iconCls: 'x-fa fa-tree',
						viewType: 'mapview',
						panelType:'emptypanel',
						leaf: true
					}]
				}/*, {
					text: '预警信息', // '竣工信息管理'
					iconCls: 'x-fa fa-warning',
					selectable: false,
					children: [, {
						text: '竣工资料归档信息预警',
						iconCls: 'x-fa fa-check-circle-o',
						viewType: 'mapview',
						panelType:'emptypanel',
						leaf: true
					}]
				}*/ ]
			};
//		} else {
//			return {
//				expanded: true,
//				children: []
//			};
//		}
	}
	
});
