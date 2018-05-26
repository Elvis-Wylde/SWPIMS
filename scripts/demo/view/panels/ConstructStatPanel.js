Ext.define('RMIS.view.panels.ConstructStatPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'constructstatpanel',
    
    requires: [
	    'RMIS.controller.panels.ConstructStatPanelController',
	    'Ext.layout.container.HBox',
    	'RMIS.view.widgets.SumWidget',
	    'RMIS.view.widgets.PersentWidget'
    ],
    
    controller: 'constructstatpanel',
    
    viewModel: {
    	data: {
    		topicTitle: '',
    		mainRegion: '全省',
    		subRegion: '',
    		description: ''
    	}
    },
    
    initComponent: function() {
    	var me = this;
    	
    	me.initStore();
    	me.items = [me.getPersentContainer(), me.getLegendContainer(), me.getChart(), me.getGrid()];
    	
    	me.callParent();
    },
    
    initStore: function() {
    	var me = this;
    	me.mainStore = Ext.create('Ext.data.Store', {
			fields: [
		  	    {name: 'name', type: 'string'},
		  	    {name: 'id', type: 'string'},
		  	    {name: 'GCZTZ', type: 'number'},
		  	    {name: 'JHZJ', type: 'number'},
		  	    {name: 'SYZJ', type: 'number'}
		  	],
		  	proxy: {
		     	type: 'ajax',
		     	url: './data/JSON/construction.json',
		     	reader: {
		     		rootProperty: 'results'
		     	},
		     	simpleSortMode: true
		     }
		});
    },
    
	getLegendContainer: function() {
		var me = this,
			width = me.width - 15;
		return  Ext.create('Ext.container.Container', {
    		layout: 'vbox',
    		reference: 'legend',
    		padding: '5px 10px 0 10px',
    		items: [{
                xtype: 'label',
                reference: 'totalTask',
                width: width,
                data: {amount: '20'},
                tpl: '<span>总投资</span><span>{amount} 万元</span>',
                cls: 'task-total'
            }, {
                xtype: 'label',
                width: width,
                reference: 'planTask',
                data: {amount: '0'},
                tpl: '<span>累计下达计划资金</span><span>{amount} 万元</span>',
                cls: 'task-plan'
    		}, {
                xtype: 'label',
                width: width,
                reference: 'completeTask',
                data: {amount: '0'},
                tpl: '<span>已使用资金</span><span>{amount} 万元</span>',
                cls: 'task-complete'
    		}]
    	});
	},
	
	getPersentContainer: function() {
		var me = this;
			size = Math.round(me.width / 3);
		return Ext.create('Ext.container.Container', {
			layout: 'vbox',
			reference: 'persent',
			items: [{
				xtype: 'label',
				bind: {
					html: '<span style="width: ' + me.width + 'px;text-align: center;display:block;color:#999999;padding-top: 15px;">全省风电场建设进度情况</span>'
				}
			},{
				xtype: 'container',
				layout: 'hbox',
	    		items: [Ext.create('RMIS.view.widgets.PersentWidget', {
	        		title: '计划占任务',
	        		reference: 'persent1',
	        		width: size,
	        		height: size
	        	}), Ext.create('RMIS.view.widgets.PersentWidget', {
	        		title: '完成占任务',
	        		reference: 'persent2',
	        		fillColor: '#11c897',
	        		width: size,
	        		height: size
	        	}), Ext.create('RMIS.view.widgets.PersentWidget', {
	        		title: '完成占计划',
	        		reference: 'persent3',
	        		fillColor: '#ffc000',
	        		width: size,
	        		height: size
	        	})]
			}]
    	});
	},
	
	getChart: function() {
		var me = this;
			height = Math.round(me.width * 0.5);
		return Ext.create('Ext.container.Container', {
			layout: 'vbox',
			reference: 'chart',
			items: [{
				xtype: 'cartesian',
				reference: 'paretochart',
				theme: 'category3',
				width: '100%',
				height: height,
				padding: '5px 10px 5px 10px',
				store: me.mainStore,
				axes: [{
		            type: 'numeric',
		            position: 'left',
		            fields: ['JHZJ'],
		            reconcileRange: true,
		            grid: true,
		            minimum: 0
		        }, {
		            type: 'category',
		            position: 'bottom',
		            fields: 'name'
		        }, {
		            type: 'numeric',
		            position: 'right',
		            fields: ['planPercent', 'completePercent'],
		            reconcileRange: true,
		            majorTickSteps: 10,
		            minimum: 0,
		            maximum: 100,
		            renderer: 'onAxisLabelRender'
		        }],
		        series: [{
		            type: 'bar',
		            stacked: false,
		            xField: 'name',
		            yField: ['JHZJ', 'SYZJ'],
		            style: {
		                opacity: 0.80
		            },
		            highlight: {
		                fillStyle: 'rgba(204, 230, 73, 1.0)',
		                strokeStyle: 'black'
		            },
		            tooltip: {
		                trackMouse: true,
		                renderer: 'onBarSeriesTooltipRender'
		            }
		        }, {
		            type: 'line',
		            xField: 'name',
		            yField: 'planPercent',
		            style: {
		                lineWidth: 2,
		                opacity: 0.80
		            },
		            marker: {
		                type: 'square',
		                fx: {
		                    duration: 200
		                }
		            },
		            highlightCfg: {
		                scaling: 2,
		                rotationRads: Math.PI / 4
		            },
		            tooltip: {
		                trackMouse: true,
		                renderer: 'onLineSeriesTooltipRender'
		            }
		        }, {
		            type: 'line',
		            xField: 'name',
		            yField: 'completePercent',
		            style: {
		                lineWidth: 2,
		                opacity: 0.80
		            },
		            marker: {
		                type: 'square',
		                fx: {
		                    duration: 200
		                }
		            },
		            highlightCfg: {
		                scaling: 2,
		                rotationRads: Math.PI / 4
		            },
		            tooltip: {
		                trackMouse: true,
		                renderer: 'onLineSeriesTooltipRender'
		            }
		        }]
			}]
		});
	},
	
	getGrid: function() {
    	var me = this;
    	
    	var tbar = Ext.create('Ext.toolbar.Toolbar', {
			reference: 'subtbar',
			style: {"border": "none"},
			items: ['->', {
    			xtype: 'button',
    			iconCls: 'x-fa fa-table',
    			tooltip: '查看详表',
    			listeners: {
    				// click: 'onDetailBtnClick'
    			}
    		}]
    	});
    	
    	var statGrid = Ext.create('Ext.grid.Panel', {
    		reference: 'statgrid',
    		width: me.width,
    		height: 500,
    		store: me.mainStore,
    		tbar: tbar,
    		//border: false,
    		rowLines: true,
    		columnLines: true,
    		scrollable: 'y',
    		columns: [{
    			// text: me.getViewModel().get('subRegion'),
    			text: '风电场',
    			dataIndex: 'name',
    			flex: 1,
    			minWidth: 90,
    			sortable: true
    		}, {
    			text: '工程总投资',
    			dataIndex: 'GCZTZ',
    			sortable: true, width: 90,
    			align: 'center'
			}, {
    			text: '累计计划资金',
    			dataIndex: 'JHZJ',
    			sortable: true, width: 90,
    			align: 'center'
			}, {
    			text: '已使用资金',
    			dataIndex: 'SYZJ',
    			sortable: true, width: 90,
    			align: 'center'
			}],
			listeners: {
				// rowclick: 'onGridRowClick',
				// rowdblclick: 'onGridRowDBClick'
			}
    	});
    	
    	me.localizeGridMenu(statGrid);
    	return statGrid;
    	
//    	return Ext.create('Ext.panel.Panel', {
//    		layout: 'card',
//    		reference: 'subgrid',
//    		width: me.width,
//    		height: 500,
//    		border: false,
//    		bodyBorder: false,
//    		tbar: tbar,
//    		items: [statGrid]
//    	});
    }
    
});