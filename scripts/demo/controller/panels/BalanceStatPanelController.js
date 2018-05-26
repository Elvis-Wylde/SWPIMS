Ext.define('RMIS.controller.panels.BalanceStatPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.balancestatpanel',

    requires: [
        //'RMIS.view.windows.TownImplPanelWindow',
        //"RMIS.view.windows.TownImplListPanelWindow"
    ],

    onPanelReady: function(container, width, height, eOpts) {
        this.updatePanelHeight();
    },

    getMainStore: function() {
        return this.view.mainStore;
    },

    updatePanelHeight: function() {
        var me = this,
            refs = me.getReferences(),
            viewHeight = me.view.getHeight(),
            leftHeight = viewHeight - refs.piechart.getHeight() - refs.chart.getHeight() - 15;
        refs.statgrid.setHeight(leftHeight);
    },

    updateContents: function(records) {
        var me = this,
            refs = me.getReferences(),
            cesiumEx = me.getCesiumEx(),
            sum1 = 0, sum2 = 0;

        Ext.Array.each(records, function(record, index, length) {
            sum1 = sum1.accAdd(record.get('SFHTE'));
            sum2 = sum2.accAdd(record.get('WFHTE'));
        });

        refs.piechart.getStore().loadData([
            { 'text': '实付合同总额', 'value': sum1 },
            { 'text': '未付合同总额', 'value': sum2 }
        ]);
        refs.piechart.redraw();

        cesiumEx.renderProjects(records, false, 0);
    },

    onSwitchIntoProvince: function(promise) {
        var me = this;
        promise.then(function() {
            me.setMainStoreFilter(null);
            me.updatePanel();
        });
        me.callParent(arguments);
    },

    onSwitchIntoProject: function(project) {
        var me = this, promise,
            cesiumEx = me.getCesiumEx(),
            mainViewModel = me.getMainViewModel();
        me.closeCurrentWindow();//add by Raven
        mainViewModel.get('CurrentFloatPanel').hide();
        var panel = me.getFloatPanel('balancedetailpanel');
        panel.restore();
        mainViewModel.set('CurrentFloatPanel', panel);
        me.callParent(arguments);
    },

    restore: function() {
        var me = this;
        me.setMainStoreFilter(null);
        me.callParent();
    },

    onPieSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('text') + ': ' + record.get('value') + '万元');
    },

    onAxisLabelRender: function (axis, label, layoutContext) {
        return label + '%';
    },

    onBarSeriesTooltipRender: function (tooltip, record, item) {
        var field = item.field;
        if (field == 'SBHTE') {
            tooltip.setHtml(record.get('name') + '申报合同金额：' + record.get('SBHTE').toFixed(2)+ '万元');
        } else {
            tooltip.setHtml(record.get('name') + '实付合同金额：' + record.get('SFHTE').toFixed(2)+ '万元');
        }

    },

    onLineSeriesTooltipRender: function (tooltip, record, item) {
        // var field = item.field;
        tooltip.setHtml(record.get('name') + '实付比例：' + record.get('percent') + '%');

    },

    onEntityClicked: function(id, type, longitude, latitude, entity) {

    },

    onDetailBtnClick: function(btn) {
//		var me = this,
//			refs = me.getReferences(),
//			layout = refs.subgrid.getLayout();
//		if (layout.getActiveItem() == refs.statgrid) {
//			me.showCurrentWindow('RMIS.view.windows.ConstructionImplWindow', btn, {
//				store: me.getMainStore(), catalog: 'stat'
//			});
//		}
    }

});