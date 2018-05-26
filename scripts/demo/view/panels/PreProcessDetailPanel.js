Ext.define('RMIS.view.panels.PreProcessDetailPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'preprocessdetailpanel',
    
    requires: [
        'RMIS.view.widgets.UnitTextField',
	    'RMIS.controller.panels.PreProcessDetailPanelController'
    ],
    
    controller: 'preprocessdetailpanel',
    
	border: false,
	bodyBorder: false,
	scrollable: 'y',
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
    		bodyPadding: 0,
//    		defaults: {
//            	scrollable: true,
//                html: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
//            },
    		items: [{
                title: '投资决策信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down',
                bodyStyle: {
                    background: '#f6f6f6'
                },
                scrollable: 'y',
                bodyPadding: '5px 0 5px 0',
                items: [{
                	xtype: 'container',
                	margin: '5px 10px 5px 10px',
                	html: '一、核准前置条件'
                },
                    me.getContentItem('国家核准计划', '2016/05/20', true, false), 
                    me.getContentItem('核准批复', '2017/06/08', true, true), 
                    me.getContentItem('规划选址意见书', '2017/01/20', true, true), 
                    me.getContentItem('用地预审意见', '2017/01/20', true, true),
                {
                	xtype: 'container',
                	margin: '5px 10px 5px 10px',
                	html: '二、非核准前置批复'
                },
	                me.getContentItem('节能审查意见（登记表）', '2016/05/20', true, true), 
	                me.getContentItem('环境影响评价审批文件', '2017/06/08', true, true), 
	                me.getContentItem('水土保持方案审核', null, false, false), 
	                me.getContentItem('压覆矿产资源批复', null, false, false),
	                me.getContentItem('安全预评价备案', null, false, false),
	                me.getContentItem('文物保护意见', null, false, false),
	                me.getContentItem('军事设施保护意见', null, false, false),
	                me.getContentItem('地震安全性评价', null, false, false),
	                me.getContentItem('地质灾害危险性评估备案', null, false, false),
	                me.getContentItem('林地相关意见', null, false, false),
	                me.getContentItem('社会稳定风险评估报告批复', null, false, false),
	                me.getContentItem('接入系统设计评审意见函', null, false, false),
	                me.getContentItem('项目可行性研究报告', null, false, false),
	                me.getContentItem('金融机构贷款承诺函', null, false, false)
    			]
            }, {
            	title: '开工决策信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }, {
            	title: '设备招标与供货信息',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }]
    	});
    },
    
    getContentItem: function(title, date, isComplete, isFiled) {
    	var img = isComplete ? './resources/images/green-check.png' : './resources/images/red-check.png',
    		d = date ? '<span style="color: green">' + date + '</span>' : '<span style="color: red">未完成</span>';
    	return Ext.create('Ext.container.Container', {
    		// padding: '5px 0 5px 0',
        	margin: 0,
        	layout: 'hbox',
        	items: [{
        		xtype: 'container',
        		width: 38,
        		html: '<img src="' + img + '" width="38px" height="69px"></img>'
        	}, {
        		xtype: 'container',
        		margin: '5px 20px 5px 0',
        		flex: 1,
        		layout: 'hbox',
        		style: {
            		'background': '#fff',
        			'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.2)'
            	},
        		items: [{
        			xtype: 'panel',
        			flex: 1,
        			html: '<span style="display: block; font: bold 16px Open Sans;padding: 5px">' + title + '</span>' +
        				'<span style="display: block;padding: 5px">完成时间: ' + d + '</span>'
        		}, {
        			xtype: 'button',
        			iconCls: 'x-fa fa-file-pdf-o',
        			width: 48,
        			height: 59,
        			scale: 'large',
        			focusCls: '',
        			style: {
        				border: '0px',
        				background: 'transparent',
        				color: '#000'
        			},
        			hidden: !isFiled,
        			listeners: {
        				click: function(btn) {
        					RMIS.getApplication().showResourcesViewer('pdf', [
                        		{sourcePath: 'data/files/1.pdf', title: title}
                        	], btn, 0);
        				}
        			}
        		}, {
        			xtype: 'button',
        			iconCls: 'x-fa fa-upload',
        			width: 48,
        			height: 59,
        			scale: 'large',
        			focusCls: '',
        			style: {
        				border: '0px',
        				background: 'transparent',
        				color: '#000'
        			},
        			hidden: isComplete,
        			listeners: {
        				click: function(btn) {
        					var uploadWin = Ext.create('Ext.window.Window', {
        						title: '上传文档',
        						width: 600,
        						height: 268,
								items: [
									{
										xtype: 'form',
                                        bodyPadding: '10 10 0',
                                        defaults: {
                                            anchor: '100%',
                                            allowBlank: false,
                                            msgTarget: 'side',
                                            labelWidth: 80
                                        },
                                        items: [{
                                            xtype: 'textfield',
                                            fieldLabel: '文件类型',
											value: title
                                        }, {
                                            xtype: 'textfield',
                                            fieldLabel: '上传人',
											value: '王世华'
                                        }, {
                                            xtype: 'datefield',
                                            fieldLabel: '上传日期',
											value: new Date()
                                        }, {
                                            xtype: 'filefield',
                                            emptyText: '选择文档',
                                            fieldLabel: '文件',
                                            buttonText: '...'
                                        }],
                                        buttons: [{
                                            text: '上传',
                                            handler: function() {
                                                uploadWin.close();
											}
                                        }, {
                                            text: '关闭',
                                            handler: function() {
                                                uploadWin.close();
											}
                                        }]
									}
								]
        					});
        					uploadWin.show(btn);
        				}
        			}
        		}]
        	}]
    	});
    }
    
});
    	
