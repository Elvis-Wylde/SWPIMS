Ext.define('RMIS.view.panels.ProjectDetailPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'projectdetailpanel',
    
    requires: [
        'RMIS.view.widgets.UnitTextField',
	    'RMIS.controller.panels.ProjectDetailPanelController'
    ],
    
    controller: 'projectdetailpanel',
    
	border: false,
	bodyBorder: false,
	scrollable: 'y',
	title: {
		style: {
			background: '#5fa2dd',
			color: '#fff'
		},
		bind: {
			html: '{projectTitleHtml}'
		}
	},
	tools: [{
		type: 'help',
		tooltip: '项目文件',
		listeners: {
			click: 'showPdfFile'
		}
	}],
    
    record: null,
    viewModel: {
    	data: {
    		projectTitleHtml: '',
    		locHtml: '',
    		// projectNote: ''
    		basinMap: {
    			'603': "雅砻江流域 ",
        		'604': "金沙江流域 ",
        		'212': "大渡河流域 ",
        		'999': "其他流域 "
    		}
    	}
    },
    
    initComponent: function() {
    	var me = this;
    	
    	me.getViewModel().set('projectTitleHtml', me.controller.getTitleHtml());
    	me.getViewModel().set('locHtml', me.controller.getLocHtml());
    	
    	var locLabel = Ext.create('Ext.form.Label', {
    		bind: {
    			html: '{locHtml}'
    		}
    	});
    	me.items = [locLabel, me.getImageView(), me.getContentPanel()];
    	
    	me.callParent();
    },
        
    getImageView: function() {
    	var me = this;
    	
    	var store = Ext.create('Ext.data.Store');
    	store.loadData([
    		{url: './resources/images/projimgs/u3.jpg'},
    		{url: './resources/images/projimgs/u1.jpg'},
    		{url: './resources/images/projimgs/u2.jpg'}
    	]);
    	
    	var width = store.getCount() * 140;
    	var imgViewer = Ext.create('Ext.view.View', {
    		store: store,
    		//height: 80,
    		width: width,
    		trackOver: true,
    		overItemCls: 'images-view x-item-over',
    		itemSelector: 'div.thumb-wrap',
    		tpl: [
    		    '<tpl for=".">',
    		    '<div class="images-view thumb-wrap">',
    		    '<div class="images-view thumb"><img src="{url}"></div></div></tpl>'
    		],
    		listeners: {
    			itemclick: 'imagePreviewClicked'
    		}
    	});
    	
    	return Ext.create('Ext.container.Container', {
    		// id: 'images-view',
    		cls: 'images-view',
    		reference: 'projImgView',
    		border: false,
    		bodyBorder: false,
    		scrollable: 'x',
    		items: [imgViewer]
    	});
    },
    
    getTextField: function(name, label, unitCls, labelWidth, anchor, extraParam) {
		labelWidth = labelWidth ? labelWidth : this.fieldDefaults.labelWidth;
		anchor = anchor ? anchor : '95%';
		var config = {
			name: name,
			fieldLabel: label,
			anchor: anchor,
			labelWidth: labelWidth,
			editable: false,
            ui: 'oneline'
		};
		if (extraParam) {
			config = Ext.apply(config, extraParam);
		}
		if (unitCls) {
			var triggers = {
    			unit: {
    				cls: 'trigger-noop unit-' + unitCls
    			}
    		};
			if (extraParam && extraParam.triggers) {
				triggers = Ext.apply(triggers, extraParam.triggers);
			}
			Ext.apply(config, {
				cls: 'unit-field',
				triggers: triggers
			});
		}
		return Ext.create('Ext.form.field.Text', config);
	},
    
    getContentPanel: function() {
    	var me = this;
    	
    	//=========
    	var legalco = me.getTextField('XMFRDW', '项目单位', null, 80, '95%');
    	var designco = me.getTextField('ZTSJDW', '设计单位', null, 80, '95%');
    	var constructco = me.getTextField('SGDW', '施工单位', null, 80, '95%');
    	var inspectco = me.getTextField('ZHJLDW', '监理单位', null, 80, '95%');
    	
    	//=========
    	// 建设状态、总投资、占地面积、设计年发电量、装机台数、装机容量、计划开工时间、实际开工时间、计划完工时间、实际完工时间
    	
    	var invest = me.getTextField('GCZTZ', '工程总投资', 'yuan-tt', 100, '95%');
    	var area = me.getTextField('AREA', '工程占地', 'km-square', 100, '95%');
    	var cap = me.getTextField('ZJRL', '装机容量', 'mw', 100, '95%');
    	var count = me.getTextField('ZJTS', '装机台数', 'tai', 100, '95%');
    	var average = me.getTextField('PJFDL', '设计年均发电量', 'kwh-tt', 100, '95%');
    	var approve = me.getTextField('XMHZSJ', '项目核准时间', null, 100, '95%');
    	var status = me.getTextField('GCJSJD', '工程建设状态', null, 100, '95%');
    	var pstart = me.getTextField('JHKGSJ', '计划开工时间', null, 100, '90%');
    	var pend = me.getTextField('JHJGSJ', '计划竣工时间', null, 100, '90%');
    	var astart = me.getTextField('ZSKGSJ', '正式开工时间', null, 100, '90%');
    	var aend = me.getTextField('SJJGSJ', '实际竣工时间', null, 100, '90%');
    	
    	return Ext.create('Ext.form.Panel', {
    		reference: 'contentform',
    		bodyPadding: 10,
    		border: false,
    		bodyBorder: false,
    		fieldDefaults: { msgTarget: 'side', labelWidth: 70 },
    		items: [{
    			xtype: 'container',
                anchor: '100%',
                defaultType: 'fieldset',
    		    // defaults: { collapsible: true, collapsed: false },
    		    items: [{
    		    	title: '工程建设管理',
    		    	anchor: '100%',
    		    	items: [{
    		    		xtype: 'container',
    	                anchor: '100%',
    	                layout: 'anchor',
    	                items: [legalco, designco, constructco, inspectco, approve, status]
    		    	}, {
    	            	xtype: 'container',
    	                anchor: '100%',
    	                layout: 'hbox',
    	                defaultType: 'container',
    	                defaults: { flex: 1, layout: 'anchor' },
    	                items:[
		                	{ items: [pstart, astart] }, 
		                	{ items: [pend, aend] }
		                ]
    	            }]
    	        }, {
    	        	title: '主要工程特性',
    		    	anchor: '100%',
    		    	items: [{
    		    		xtype: 'container',
    	                anchor: '100%',
    	                layout: 'anchor',
    	                items: [invest, area, cap, count, average]
    		    	}]
    	        }]
    		}]
    	});
    	
    }
    
});
    	
