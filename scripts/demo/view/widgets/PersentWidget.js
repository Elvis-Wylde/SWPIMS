Ext.define('RMIS.view.widgets.PersentWidget', {
    extend: 'Ext.container.Container',
    xtype: 'persentwidget',

    title: '',
	textColor: '#69708a',
    fillColor: '#2ac8ef',
    emptyColor: '#ececec',

    // width: 127,
    // height: 127,
    // flex: 1,
    layout: 'fit',
    
    viewModel: {
    	data: {
    		divisor: 1,
        	dividend: 2
    	}
    },
    
    listeners: {
    	'boxready': function() {
    		// this.el.setStyle('height', '129px');
    	}
    },

    initComponent: function(){
        var me = this;
        
        me.store = Ext.create('Ext.data.Store', {
        	fields: ['text', 'value'],
            data: [
                { text: 'divisor', value: 0 },
                { text: 'dividend', value: 1 }
            ]
        });
        
        var fontSize = 12;
        var x = Math.round((me.width - (fontSize) * 5) / 2);
        var y = Math.round(fontSize + 8);
        
        var titleText = Ext.create('Ext.draw.sprite.Text', {
        	x: x,
            y: y,
            text: me.title,
            fontSize: fontSize,
            fillStyle: me.fillColor
        });
        
        fontSize = Math.floor(me.width * 0.2) - 1;
        x = Math.round((me.width - (fontSize - 6) * 3) / 2);
        y = Math.round((me.height / 2) + fontSize - 5);
        
        me.persentText = Ext.create('Ext.draw.sprite.Text', {
            x: x,
            y: y,
            text: '0%',
            fontSize: fontSize,
            // font: '30px 300 Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif',
            fillStyle: me.textColor
        });
        
        me.items = [{
        	xtype: 'polar',
        	// reference: 'persentchart',
            flex: 1,
            animation: true,
            padding: '0 0 5px 5px',
            insetPadding: { top: 35, left: 2, right: 2, bottom: 2 },
            donut: true,
            interactions: ['rotate'],
            colors: [me.fillColor, me.emptyColor],
            
            store: me.store,
            sprites: [titleText, me.persentText],
            series: [{
                type: 'pie',
                xField: 'value',
                colors: [me.fillColor, me.emptyColor],
                donut: 85
            }]
        }];

        me.callParent(arguments);
    },
    
    updateData: function(divisor, dividend) {
    	var me = this;
    	
    	me.store.setData([
    		{ text: 'divisor', value: divisor },
            { text: 'dividend', value: dividend - divisor }
    	]);
    	
    	me.persentText.setText(parseInt((divisor / dividend) * 100) + '%');
    	// me.persentText.getSurface().renderFrame();
    	
    }
});
