Ext.define('RMIS.view.panels.EmptyPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'emptypanel',
    
    requires: [ 'RMIS.controller.panels.EmptyPanelController'],    
           
    controller: 'emptypanel',
    
    viewModel: {
    	data: {
    		image: null
    	}
    },
    
    initComponent: function() {
    	var me = this;
    	
    	me.items = [{
            xtype: 'container',
            reference: 'container',
        	cls: 'blank-page-container',
            html: '<div style="padding-top: 100px;" ><div class=\'fa-outer-class\'><span class=\'x-fa fa-clock-o\'></span></div>' +
            '<h1>Coming Soon!</h1><span class=\'blank-page-text\'>此模块正在研发中</span></div>'
        }];
    	
    	me.callParent();
    }
});