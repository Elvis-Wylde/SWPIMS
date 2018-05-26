Ext.define('RMIS.controller.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainview',
    
    requires: [
		'RMIS.view.main.FAQ', 							// 主界面工具栏-帮助
		'RMIS.view.panels.ProjectStatPanel',			// 枢纽概况 - 统计
		'RMIS.view.panels.ProjectDetailPanel',			// 枢纽概况 - 电站详情
		
		'RMIS.view.panels.PreProcessStatPanel',
		'RMIS.view.panels.ConstructStatPanel',
		'RMIS.view.panels.PreProcessDetailPanel',
		'RMIS.view.panels.ConstructDetailPanel',
        'RMIS.view.panels.BalanceStatPanel',
        'RMIS.view.panels.BalanceDetailPanel',
		// 其他
		'RMIS.view.panels.EmptyPanel'					// 空面板
	],

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    lastView: null,
    
    onMainViewRender:function() {
        this.redirectTo("mapview");
    },
    
    onMainViewReady: function() {
    	
    },

    onRouteChange: function (id) {
//        if (id == "mainview")
//            return;
        this.setCurrentView(id);
    },

    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();
        
        var me = this,
        	mainViewModel = RMIS.getApplication().view.getViewModel(),
        	refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) || store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')) || hashTag,
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;
        
        // Kill any previously routed window
        if (lastView && (lastView.isWindow)) {
            lastView.destroy();
        }
        if (mainViewModel.get('CurrentWindow')) {
        	mainViewModel.get('CurrentWindow').destroy();
        	mainViewModel.set('CurrentWindow', null);
        }

        lastView = mainLayout.getActiveItem();       
        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag,  // for existingItem search later
                hideMode: 'offsets'
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }
        
        if (!node) {
        	navigationList.setSelection(null);
        } else if (!navigationList.getSelection() || (navigationList.getSelection().get('ViewType') != node.get('ViewType'))) {
        	navigationList.setSelection(node);
        }

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
        
        if (Ext.get('cesium-container')) {
        	var cesiumContainer = Ext.get('cesium-container');
        	if (hashTag == 'mapview') {
        		cesiumContainer.setStyle('display', 'block');
        	} else {
        		cesiumContainer.setStyle('display', 'none');
        	}
        }
    },
    
    updateUserProfile: function(userprofile) {
    	var me = this,
        	refs = me.getReferences();
    	refs.usernameLabel.setText(userprofile.name);
    	refs.userorgLabel.setText(userprofile.orgName);
    	refs.usertitleLabel.setText(userprofile.title);
    	refs.userImage.setSrc(userprofile.image);
    },
    
    onSwitchNavTree: function(segementBtn, btn, isPressed) {
    	var store = RMIS.getApplication().getStore('NavigationTree');
    	var naviTree = this.getReferences().navigationTreeList;
    	store.switchData(btn.getValue());
    	naviTree.setSelection(store.getRoot().childNodes[0].childNodes[0]);
    	// this.getViewModel.set('NavTreeType', btn.getValue());
    	var mainViewModel = RMIS.getApplication().view.getViewModel();
    	mainViewModel.set('NavTreeType', btn.getValue());
    },

    onNavigationTreeSelectionChange: function (tree, node) {
    	var mainViewModel = RMIS.getApplication().view.getViewModel(),
    		refs = this.getReferences();
		refs.regionSelection.setDisabled(false);
		// refs.naviswitchbtn.setDisabled(false);
		// refs.documentbtn.setDisabled(false);
    	if (mainViewModel.get('CurrentWindow')) {
        	mainViewModel.get('CurrentWindow').destroy();
        	mainViewModel.set('CurrentWindow', null);
        }
    	if (node) {
    		mainViewModel.set('SelectedNavNode', node);
    		var to = node.get('routeId') || node.get('viewType');
    		if (to) {
				this.redirectTo(to);
                // add action
                if (mainViewModel.get('initialized')) {
                	if (to == 'mapview') {
                		var panelType = node.get('panelType'),
                			panel = this.getFloatPanel(panelType, node.get('emptyimg'));
                		mainViewModel.get('CurrentFloatPanel').hide();
                		panel.restore();
                		mainViewModel.set('CurrentFloatPanel', panel);
            		} else {
	            		panel = mainViewModel.get('CurrentFloatPanel');
	            		panel.hide();
            		}
                }
            }
    	} else {
    		refs.regionSelection.setDisabled(true);
    		// refs.naviswitchbtn.setDisabled(true);
    		// refs.documentbtn.setDisabled(true);
    		panel = mainViewModel.get('CurrentFloatPanel');
    		panel.hide();
    	}
    },
    
    onSelectedRegionChanged: function(breadcrumb, node, prevNode, eOpts) {
    	var id = node.get('id'), 
    		actionType = node.get('type'),
    		viewModel = this.getViewModel(),
    		cesiumEx = viewModel.get('cesiumEx');
    	
    	if (id == '450000') {
    		viewModel.set('CurrentProject', null);
    		cesiumEx.reset(1);
    		cesiumEx.switchIntoProvince();
    	} else {
    		viewModel.set('CurrentProject', id);
			cesiumEx.switchIntoProject(id);
    	}
    	/*
    	if (id == '510000') {
    		viewModel.set('CurrentBasin', null);
    		viewModel.set('CurrentProject', null);
    		cesiumEx.reset(1);
    		cesiumEx.switchIntoProvince();
    	} else {
    		if (actionType == 'basin') {
    			viewModel.set('CurrentBasin', id);
        		viewModel.set('CurrentProject', null);
        		cesiumEx.switchIntoBasin(id);
    		} else if (actionType == 'project') {
    			viewModel.set('CurrentProject', id);
    			cesiumEx.switchIntoProject(id);
    		}
    	}
    	*/
    },
    
    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();
            refs.platformLogo.setWidth(new_width);
            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);
            Ext.resumeLayouts(); 
            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        } else {
            if (!collapsing) {
                navigationList.setMicro(false);
            }
            refs.platformLogo.animate({dynamic: true, to: {width: new_width}});

            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
        refs.naviTreeResizeBtn.setIconCls(collapsing ? 'x-fa fa-chevron-right' : 'x-fa fa-chevron-left');
    },
    
    showDocumentWindow: function(btn) {
    	var me = this,
			viewModel = me.getViewModel();
		
		var window = Ext.create('RMIS.view.windows.DocumentWindow');
		
		if (viewModel.get('CurrentWindow')) {
			viewModel.get('CurrentWindow').destroy();
			viewModel.set('CurrentWindow', null);
	    }
		window.show(btn);
		viewModel.set('CurrentWindow', window);
    },
    
    getFloatPanel: function(panelType, emptyimg) {
    	var me = this, panel,
    		refs = me.getReferences(),
    		mainViewModel = RMIS.getApplication().view.getViewModel(),
    		currentBasin = mainViewModel.get('CurrentBasin'),
    		currentProject = mainViewModel.get('CurrentProject');
    	
//    	if (panelType == 'projectoverview') {
//    		panelType = currentProject ? 'projectdetailpanel' : 'projectstatpanel';
//    	} else if (panelType == 'preprocessoverview') {
//    		panelType = currentProject ? 'preprocessdetailpanel' : 'preprocessstatpanel';
//    	} else if (panelType == 'constructoverview') {
//    		panelType = currentProject ? 'constructdetailpanel' : 'constructstatpanel';
//    	}
    	
    	if (panelType.indexOf('overview') > 0) {
    		panelType = panelType.replace('overview', currentProject ? 'detailpanel' : 'statpanel');
    	}
    	
    	if (!mainViewModel.get(panelType)) {
    		var mainContainer = refs.mainCardPanel,
				clientW = document.body.clientWidth,
				clientH = document.body.clientHeight,
				containerW = mainContainer.getWidth(),
				containerH = mainContainer.getHeight(),
				padding = 10,
				minWidth = 381,
				calWidth = Math.round(Math.round(containerW / 3.5) / 3) * 3,
				panelWidth = calWidth < minWidth ? minWidth : calWidth;
			var bounds = {
				x: clientW - panelWidth - padding,
				y: clientH - containerH + padding,
				width: panelWidth,
				height: containerH - padding * 2
			};
			mainViewModel.set(panelType, Ext.create({
	            xtype: panelType,
	            bounds: bounds,
				width: bounds.width, 
				height: bounds.height
	        }));
		}
    	
    	panel = mainViewModel.get(panelType);
    	
    	if (panelType == 'emptypanel' && emptyimg) {
    		panel.getViewModel().set('image', emptyimg);
    	}
    	
    	return panel;
    }
    
});
