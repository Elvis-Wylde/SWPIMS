Ext.define('RMIS.view.widgets.SumWidget', {
    extend: 'Ext.panel.Panel',
    xtype: 'sumwidget',

    cls: 'admin-widget-small info-card-item shadow',

    containerColor: '',
    
    selected: false,
    
    bodyStyle: {
    	background: 'transparent'
    },

    data: {
        amount: 0,
        type: '',
        icon: ''
    },
    
    tpl: '<div style="line-height: 20px">\
			<div style="font-size: 18px;line-height: 20px" class="x-fa fa-{icon}"></div>\
			<div style="font-size: 26px; font-weight: normal; line-height:30px">{amount}</div>\
			<div style="font-size: 12px;line-height: 20px" >{type}</div></div>',
    
    listeners: {
    	'boxready': function() {
    		var height = this.height - 1;
    		this.getEl().setStyle('height', height + 'px');
    		this.setSelected(this.selected);
    		this.getEl().on('mouseover', function() {
				this.el.setStyle('background', 'rgb(235, 230, 240)');
        	});
        	this.getEl().on('mouseout', function() {
				this.el.setStyle('background', 'rgb(255, 255, 255)');
        	});
    	}
    },
    
    setSelected: function(selected) {
    	this.selected = selected;
    	//var backColor = this.selected ? 'rgb(200, 230, 240)' : 'rgb(255, 255, 255)';
		//this.getEl().setStyle('background', backColor);
    	this.setBodyStyle({
    		color: this.selected ? '#167abc' : '#000000',
    		fontWeight: this.selected ? 'bold' : 'normal'
    	});
    },

    initComponent: function(){
        var me = this;
        var avergeHeight = Math.round((me.height - 70) / 2);
        
        Ext.apply(me, {
        	style: {
        	    textAlign: 'center',
        	    background: '#fff',
        	    padding: avergeHeight + 'px 2px !important',
        	    fontSize: avergeHeight + 'px'
        	},
        	cls: me.config.containerColor
        });

        me.callParent(arguments);
    }
});
