Ext.define('RMIS.view.panels.PreProcessStatPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'preprocessstatpanel',
    
    requires: [
        'Ext.layout.container.HBox',
        'RMIS.view.widgets.SumWidget',
	    'RMIS.controller.panels.PreProcessStatPanelController'
    ],    
    
    controller: 'preprocessstatpanel',
    
    viewModel: {
    	data: {
    		currentView: 'PCOUNT',
    		currentBasin: null
    	}
    },
    
    // chartColors: ['#FFD700', '#B22222', '#94ae0a'],
    //chartColors: ['#B22222', '#94ae0a'],
    
    initStore: function() {
    	var me = this;
    	me.projectStore = RMIS.getApplication().getStore('PreProcess');
    },
    
    getCardContainer: function() {
    	var me = this,
    		panelWidth = me.width,
    		panelHeight = me.height,
    		width = panelWidth / 3,
    		height = Math.round(width * 0.8);
    	
    	var	container = Ext.create('Ext.container.Container', {
    		reference: 'cardcontainer',
    		layout: 'hbox',
    		//height: 131,
    		items: [{
        		xtype: 'sumwidget',
        		width: width,
        		height: height,
        		reference: 'PCOUNT',
        		containerColor: 'green',
        		selected: true,
        		data: {
                    amount: 0,
                    type: '工程数量(个)',
                    icon: 'flag'
                },
                listeners: {
            		click: {
            			element: 'el',
            			fn: function() {
            				me.controller.onCardClick(me, 'PCOUNT');
            			}
            		}
            	}
        	}, {
        		xtype: 'sumwidget',
        		containerColor: 'blue',
        		width: width,
        		height: height,
        		reference: 'ZJRL',
        		data: {
                    amount: 0,
                    type: '装机容量(万千瓦)',
                    icon: 'flash'
                },
                listeners: {
            		click: {
            			element: 'el',
            			fn: function() {
            				me.controller.onCardClick(me, 'ZJRL');
            			}
            		}
            	}
        	}, {
        		xtype: 'sumwidget',
        		containerColor: 'orange',
        		width: width,
        		height: height,
        		reference: 'GCZTZ',
        		data: {
                    amount: 0,
                    type: '工程投资(万元)',
                    icon: 'money'
                },
                listeners: {
            		click: {
            			element: 'el',
            			fn: function() {
            				me.controller.onCardClick(me, 'GCZTZ');
            			}
            		}
            	}
        	}]
    	});
    	
    	return container;
    },
    
    getPieContainer: function() {
    	var me = this;
		
    	var store = Ext.create('Ext.data.Store', {
    		fields: [
    		    {name: 'text', type: 'string'},
    		    {name: 'PCOUNT', type: 'number'},
    		    {name: 'ZJRL', type: 'number'},
    		    {name: 'GCZTZ', type: 'number'}
    		]
    	});
    	
		return Ext.create('Ext.panel.Panel', {
			margin: '15 0 0 0',
            bodyPadding: 0,
            reference: 'piecontainer',
            items: [{
            	xtype: 'panel',
            	items: [me.getPieChart('PCOUNT', store)]
            }]
		});
    },
    
    getPieChart: function(currentView, store) {
    	var me = this;
    		height = Math.round(me.width * 0.6),
    		padding = Math.round(height * 0.15);
    	
		var chart = Ext.create('Ext.chart.PolarChart', {
			reference: 'piechart',
    		innerPadding: padding,
    		height: height,
    		border: false,
    		store: store,
    		// interactions: ['itemhighlight', 'rotatePie3d'],
    		// sprites: [sprite],
    		series: [{
    			type: 'pie3d',
    			xField: currentView,
    			// colors: me.chartColors,
    			donut: 30,
    			label: {field: 'text'},
    			thickness: 20,
    			distortion: 0.6,
    			rotation: 45,
                highlight: {
                    margin: 30
                },
    			tooltip: {
    				trackMouse: true,
    				renderer: 'onPieTooltipRender'
    			}
    		}]
    	});
	
		chart.getSeries()[0].setStyle({
			'opacity': 0.9, 'bevelWidth': 10, 'colorSpread': 1.5
		});
    	return chart;
    },
    
    getProjectGrid: function() {
    	var me = this;
    	
    	var tbar = Ext.create('Ext.toolbar.Toolbar', {
			reference: 'subtbar',
			items: ['->', {
    			xtype: 'button',
    			iconCls: 'x-fa fa-table',
    			tooltip: '展开详表',
    			listeners: {
    				click: 'onDetailBtnClick'
    			}
    		}]
    	});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {
    		reference: 'projectgrid',
    		width: me.width,
    		height: 500,
    		store: me.projectStore,
    		border: false,
    		rowLines: true,
    		columnLines: true,
    		scrollable: 'y',
    		tbar: tbar,
    		features: [{
                id: 'group',
                ftype: 'groupingsummary',
                groupHeaderTpl: '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu: false
            }],
    		columns: [{
    			text: '风电场',
    			dataIndex: 'name',
    			flex: 1,
    			minWidth: 100,
    			sortable: true,
    			summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '项目合计：' + value + '个';
                }
    		}, {
    			text: '装机容量(万千瓦)',
    			dataIndex: 'ZJRL',
    			xtype: 'numbercolumn', 
    			format:'0.00',
    			sortable: true, 
    			width: 125,
    			align: 'center',
    			summaryType: 'sum',
    			summaryRenderer: function(value, summaryData, dataIndex) {
                    return value.toFixed(2);
                }
			}, {
    			text: '工程总投资(万元)',
    			dataIndex: 'GCZTZ',
    			xtype: 'numbercolumn', 
    			format:'0.00',
    			sortable: true, 
    			width: 125,
    			align: 'center',
    			summaryType: 'sum',
    			summaryRenderer: function(value, summaryData, dataIndex) {
                    return value.toFixed(2);
                }
			}],
			listeners: {
				rowclick: 'onGridRowClick',
				rowdblclick: 'onGridRowDBClick'
			}
    	});
    	
    	me.localizeGridMenu(me.grid);
    	return me.grid;
    },
    
    initComponent: function() {
    	var me = this;
    	me.initStore();
    	me.items = [me.getCardContainer(), me.getPieContainer(), me.getProjectGrid()];
    	me.callParent();
    }
});
