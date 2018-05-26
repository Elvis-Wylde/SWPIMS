Ext.define('RMIS.view.main.MainView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',
    requires: [
        'RMIS.view.main.MainContainerWrap',
        'RMIS.model.main.MainViewModel', 
	    'RMIS.controller.main.MainViewController',
	    'RMIS.view.main.MapViewContainer'
    ],
    controller: 'mainview',
    viewModel: 'mainview',
	
    cls: 'sencha-dash-viewport',
	itemId: 'mainview',
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	listeners: {
		render: 'onMainViewRender',
		afterrender: 'onMainViewReady'
	},
	
	items: [{
		xtype: 'toolbar',
		cls: 'sencha-dash-dash-headerbar shadow',
		height: 64,
		itemId: 'headerBar',
		items: [{
			xtype: 'component',
			reference: 'platformLogo',
			cls: 'platform-logo',
			html: '<div class="main-logo"><img src="resources/images/logo.png">智慧风电信息管理系统</div>',
			width: 250
		}, {
            margin: '0 0 0 8',
            reference: 'naviTreeResizeBtn',
            ui: 'header',
            iconCls:'x-fa fa-chevron-left',
            id: 'main-navigation-btn',
            handler: 'onToggleNavigationSize'
        }, {
            xtype: 'breadcrumb',
			// margin: '0 0 0 8',
            reference: 'regionSelection',
            id: 'region-selection-btn',
            bind: {
            	selection: '{selectedRegion}'
            },
            showIcons: false,
            focusCls: '',
            store: 'RegionTree',
            listeners: {
            	change: 'onSelectedRegionChanged'
            }
        }, '->', /*{
        	xtype: 'segmentedbutton',
        	reference: 'naviswitchbtn',
            margin: '0 16 0 0',
            items: [{
                iconCls: 'x-fa fa-info-circle',
                text: '信息管理',
                value: 'info',
                pressed: true
            }, {
                iconCls: 'x-fa fa-retweet',
                value: 'business',
                text: '业务管理'
            }],
            listeners: {
            	toggle: 'onSwitchNavTree'
            }
        }, */{
            iconCls: 'x-fa fa-comment-o',
            ui: 'header',
            reference: 'messages',
            // href: '#message',
            // hrefTarget: '_self',
            tooltip: '信息交流',
            listeners: {
                // click: 'showDocumentWindow'
            }
        }, {
			iconCls: 'x-fa fa-file-text',
			ui: 'header',
			reference: 'documentbtn',
			// href: '#message',
			// hrefTarget: '_self',
			tooltip: '文档管理',
			listeners: {
				// click: 'showDocumentWindow'
			}
		}, {
			iconCls: 'header-faq-btn',
			ui: 'header',
			href: '#faq',
			hrefTarget: '_self',
			tooltip: '帮助'
		}, {
			iconCls: 'x-fa fa-gears',
			ui: 'header',
			href: '#permission',
			hrefTarget: '_self',
			tooltip: '用户权限设置'
		}, {
			xtype: 'tbtext',
			id: 'userprofile-name',
			reference: 'usernameLabel',
			text: 'user name',
			cls: 'top-user-name'
		}, {
			xtype: 'tbtext',
			id: 'userprofile-org',
			reference: 'userorgLabel',
			text: '国电广西',
			cls: 'top-user-name'
		}, {
			xtype: 'tbtext',
			id: 'userprofile-title',
			reference: 'usertitleLabel',
			text: '信息管理员',
			cls: 'top-user-name'
		}, {
			xtype: 'image',
			cls: 'header-right-profile-image',
			height: 35,
			width: 35,
			id: 'userprofile-image',
			reference: 'userImage',
			alt: 'current user image',
			src: 'resources/images/user-profile/2.png'
		}]
	}, {
		xtype: 'maincontainerwrap',
		id: 'main-view-detail-wrap',
		reference: 'mainContainerWrap',
		flex: 1,
		items: [{
			xtype: 'treelist',
			reference: 'navigationTreeList',
			id: 'navigationTreeList',
			itemId: 'navigationTreeList',
			ui: 'navigation',
			store: 'NavigationTree',
			singleExpand: true,
			width: 250,
			// micro: true,
			expanderFirst: false,
			expanderOnly: false,
			listeners: {
				// itemclick: 'onItemClick',
				selectionchange: 'onNavigationTreeSelectionChange'
			}
		}, {
			xtype: 'container',
			flex: 1,
			reference: 'mainCardPanel',
			cls: 'sencha-dash-right-main-container',
			itemId: 'contentPanel',
			layout: {
				type: 'card',
				anchor: '100%'
			}
		}]
	}],
	
	initComponent: function() {
		var me = this;
		
		me.callParent();
	}
});
