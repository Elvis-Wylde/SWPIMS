Ext.define('RMIS.view.windows.RoadEditWindow', {
	extend: 'RMIS.view.windows.MainWindow',
	
	title: '道路工程施工信息',
	
	layout: {
		type: 'fit'
	},
	
//	listeners: {
//    	boxready: 'onWindowReady',
//    	destroy: 'onDestroy'
//	},
	
	initComponent: function() {
		var me = this;
		
		me.initWindowBounds();
		
		me.grid = Ext.create('Ext.grid.Panel', {
			reference: 'grid',
			border: false,
			rowLines: true,
			columnLines: true,
			scrollable: 'y',
			tbar: ['->', {
				xtype: 'button',
				iconCls: 'x-fa fa-plus',
				tooltip: '添加记录',
				listeners: {
					click: function() {
						me.onAddClick(me.grid)
					}
				}
			}, {
				xtype: 'button',
				iconCls: 'x-fa fa-save',
				tooltip: '保存数据',
				listeners: {
					//click: 'onDeleteBtnClick'
				}
			}, '-', {
				xtype: 'button',
				iconCls: 'x-fa fa-arrow-circle-up',
				tooltip: '导入数据',
				listeners: {
					//click: 'onDeleteBtnClick'
				}
			}, {
				xtype: 'button',
				iconCls: 'x-fa fa-print',
				tooltip: '导出数据',
				handler: function() {
					grid.saveDocumentAs({
						type: 'excel',
						fileName: '主要实物指标详表.xlsx'
					});
				}
			}],
			plugins: [{
				ptype: 'gridexporter'
			}, new Ext.grid.plugin.CellEditing({
	            clicksToEdit: 1
	        })],
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
            columns: [
                {
	                xtype: 'actioncolumn',
	                width: 30,
	                sortable: false,
	                menuDisabled: true,
	                items: [{
	                    iconCls: 'cell-editing-delete-row',
	                    tooltip: '删除',
	                    scope: me,
	                    handler: me.onRemoveClick
	                }]
	            },
                { text: '单元工程名称', flex: 1, dataIndex: 'name', editor: {
                    allowBlank: false
                } },
                { text: '类型', width: 105, dataIndex: 'type', align: 'center',editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    store: [
                        ['进场道路','进场道路'],
                        ['场内道路','场内道路'],
                        ['支路','支路']
                    ]
                }) },
                { text: '计划开始时间', width: 120, xtype: 'datecolumn', dataIndex: 'pstart', align: 'center', formatter: 'date("Y年m月d日")' },
                { text: '计划完成时间', width: 120, xtype: 'datecolumn', dataIndex: 'pend', align: 'center', formatter: 'date("Y年m月d日")' },
                { text: '实际开始时间', width: 120, xtype: 'datecolumn', dataIndex: 'astart', align: 'center' , formatter: 'date("Y年m月d日")', editor: {
                    xtype: 'datefield',
                    format: 'm/d/y',
                    minValue: '01/01/06'
                }},
              	{ text: '实际完成时间', width: 120, xtype: 'datecolumn', dataIndex: 'aend', align: 'center' , formatter: 'date("Y年m月d日")', editor: {
                    xtype: 'datefield',
                    format: 'm/d/y',
                    minValue: '01/01/06'
                }},
              	
                { text: '进度情况', width: 105, dataIndex: 'percent', align: 'center', xtype: 'widgetcolumn', formatter: 'date("Y年m月d日")', widget: {
                    xtype: 'progressbarwidget',
                    textTpl: [
                        '{percent:number("0")}%'
                    ]
                }, editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 1
                }},
            	{ text: '进度评价', width: 80, dataIndex: 'process', align: 'center', renderer: function(value) {
            		var img = value == "正常" ? './resources/images/thumb-up.png' : './resources/images/thumb-down.png';
            		return '<img src="' + img + '" style="width: 20px; height: 20px"></img>';
            	} }
            ]
		});
		
		me.localizeGridMenu(me.grid);
		me.items = [me.grid];
		me.callParent();
	},
	
	onAddClick: function(grid){
        // Create a model instance
        var rec = new Ext.data.Model({
            name: '',
            type: '进场道路',
            pstart: Ext.Date.clearTime(new Date()),
            pstart: Ext.Date.clearTime(new Date()),
            pstart: Ext.Date.clearTime(new Date()),
            pstart: Ext.Date.clearTime(new Date()),
            percent: 0,
            process: '正常'
        });

        grid.getStore().insert(0, rec);
        // this.cellEditing.startEdit(rec, 0);
    },

    onRemoveClick: function(grid, rowIndex){
        grid.getStore().removeAt(rowIndex);
    }
 
});