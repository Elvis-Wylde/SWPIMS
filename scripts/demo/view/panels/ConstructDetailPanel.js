Ext.define('RMIS.view.panels.ConstructDetailPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'constructdetailpanel',
    
    requires: [
        'RMIS.view.widgets.UnitTextField',
	    'RMIS.controller.panels.ConstructDetailPanelController'
    ],
    
    controller: 'constructdetailpanel',
    
	border: false,
	bodyBorder: false,
	// scrollable: 'y',
	layout: 'fit',
	title: {
		style: {
			background: '#5fa2dd',
			color: '#fff'
		},
		bind: {
			html: '{projectTitleHtml}'
		}
	},
    
    record: null,
    viewModel: {
    	data: {
    		projectTitleHtml: ''
    	}
    },
    
    initComponent: function() {
    	var me = this;
    	me.getViewModel().set('projectTitleHtml', me.controller.getTitleHtml());
    	me.items = [me.getContentPanel()];
    	me.callParent();
    },
    
    getContentPanel: function() {
    	var me = this;
    	return Ext.create('Ext.panel.Panel', {
    		reference: 'contentpanel',
    		ui: 'light',
    		cls: 'pages-faq-container shadow',
    		layout: 'accordion',
    		border: false,
    		bodyBorder: false,
    		defaults: {
            	scrollable: true
                // html: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
            },
    		items: [{
                title: '道路工程施工信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down',
                layout: 'fit',
                scrollable: 'y',
                bodyPadding: 0,
                items: [{
                	xtype: 'grid',
                	tbar: ['->', {
                		xtype: 'button',
                		iconCls: 'x-fa fa-edit',
            			tooltip: '编辑数据',
            			listeners: {
            				click: function(cmp) {
            					me.controller.showCurrentWindow('RMIS.view.windows.RoadEditWindow', cmp);
            				}
            			}
                	}, {
                		xtype: 'button',
                		iconCls: 'x-fa fa-arrow-circle-up',
            			tooltip: '导入数据'
                	}],
                	border: false,
                	bodyBorder: false,
                    columns: [
                    	{ text: '单元工程名称', flex: 1, dataIndex: 'name' },
                    	{ text: '类型', width: 75, dataIndex: 'type', align: 'center' },
                    	{ text: '进度情况', width: 85, dataIndex: 'percent', align: 'center', xtype: 'widgetcolumn', widget: {
                            xtype: 'progressbarwidget',
                            textTpl: [
                                '{percent:number("0")}%'
                            ]
                        } },
                    	{ text: '进度评价', width: 75, dataIndex: 'process', align: 'center', renderer: function(value) {
                    		var img = value == "正常" ? './resources/images/thumb-up.png' : './resources/images/thumb-down.png';
                    		return '<img src="' + img + '" style="width: 20px; height: 20px"></img>';
                    	} }
                    ],
                    store: Ext.create('Ext.data.Store', {
                    	autoLoad: true,
                    	proxy: {
            		     	type: 'ajax',
            		     	url: './data/JSON/road.json',
            		     	reader: {
            		     		rootProperty: 'results'
            		     	},
            		     	simpleSortMode: true
            		     }
                    }),
                    features: [{
                        ftype: 'rowbody',
                        getAdditionalData: function (data, idx, record, orig) {
                            // Usually you would style the my-body-class in a CSS file
                            return {
                                rowBody: '<div><span style="display: inline-block; width: 180px">计划开始时间：' + record.get("pstart") 
                                		+ '</span><span style="display: inline-block; width: 180px">实际开始时间：' + record.get("astart") + '</span></div>'
                                		+ '<div><span style="display: inline-block; width: 180px">计划结束时间：' + record.get("pend") 
                                		+ '</span><span style="display: inline-block; width: 180px">实际结束时间：' + record.get("aend") + '</span></div>',
                                rowBodyCls: "my-body-class"
                            };
                        }
                    }],
					listeners: {
                        rowclick: 'onGridRowClick'
					}
                }]
            }, {
            	title: '升压站建筑工程施工信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down',
                layout: 'fit',
                scrollable: 'y',
                bodyPadding: 0,
                items: [{
                	xtype: 'grid',
                	tbar: ['->', {
                		xtype: 'button',
                		iconCls: 'x-fa fa-edit',
            			tooltip: '编辑数据'
                	}, {
                		xtype: 'button',
                		iconCls: 'x-fa fa-arrow-circle-up',
            			tooltip: '导入数据'
                	}],
                	border: false,
                	bodyBorder: false,
                    columns: [
                    	{ text: '分项工程', flex: 1, dataIndex: 'name' },
                    	{ text: '类型', width: 75, dataIndex: 'type', align: 'center' },
                    	{ text: '进度情况', width: 85, dataIndex: 'percent', align: 'center', xtype: 'widgetcolumn', widget: {
                            xtype: 'progressbarwidget',
                            textTpl: [
                                '{percent:number("0")}%'
                            ]
                        } },
                    	{ text: '进度评价', width: 75, dataIndex: 'process', align: 'center', renderer: function(value) {
                    		var img = value == "正常" ? './resources/images/thumb-up.png' : './resources/images/thumb-down.png';
                    		return '<img src="' + img + '" style="width: 20px; height: 20px"></img>';
                    	} }
                    ],
                    store: Ext.create('Ext.data.Store', {
                    	autoLoad: true,
                    	proxy: {
            		     	type: 'ajax',
            		     	url: './data/JSON/build.json',
            		     	reader: {
            		     		rootProperty: 'results'
            		     	},
            		     	simpleSortMode: true
            		     }
                    }),
                    features: [{
                        ftype: 'rowbody',
                        getAdditionalData: function (data, idx, record, orig) {
                            // Usually you would style the my-body-class in a CSS file
                            return {
                                rowBody: '<div><span style="display: inline-block; width: 180px">计划开始时间：' + record.get("pstart") 
                                		+ '</span><span style="display: inline-block; width: 180px">实际开始时间：' + record.get("astart") + '</span></div>'
                                		+ '<div><span style="display: inline-block; width: 180px">计划结束时间：' + record.get("pend") 
                                		+ '</span><span style="display: inline-block; width: 180px">实际结束时间：' + record.get("aend") + '</span></div>',
                                rowBodyCls: "my-body-class"
                            };
                        }
                    }],
                }]
            }, {
            	title: '升压站电气设备安装及调试工程施工信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }, {
            	title: '风力发电机组工程施工信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }]
    	});
    }
    
});
    	
