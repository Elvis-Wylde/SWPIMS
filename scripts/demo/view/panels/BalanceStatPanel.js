Ext.define('RMIS.view.panels.BalanceStatPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'balancestatpanel',

    requires: [
        'RMIS.controller.panels.BalanceStatPanelController',
        'Ext.layout.container.HBox',
        'RMIS.view.widgets.SumWidget',
        'RMIS.view.widgets.PersentWidget'
    ],

    controller: 'balancestatpanel',

    viewModel: {
        data: {
            topicTitle: '',
            mainRegion: '全省',
            subRegion: '',
            description: ''
        }
    },

    initComponent: function() {
        var me = this;

        me.initStore();
        me.items = [{
            xtype: 'label',
            bind: {
                html: '<span style="width: ' + me.width + 'px;text-align: center;display:block;color:#999999;padding-top: 15px;">全省风电场合同结算情况</span>'
            }
        }, me.getPieChart(), me.getChart(), me.getGrid()];

        me.callParent();
    },

    initStore: function() {
        var me = this;
        me.mainStore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'name', type: 'string'},
                {name: 'id', type: 'string'},
                {name: 'SBHTE', type: 'number'},
                {name: 'SFHTE', type: 'number'},
                {name: 'WFHTE', type: 'number'},
                {name: 'percent', type: 'number'}
            ],
            proxy: {
                type: 'ajax',
                url: './data/JSON/balance.json',
                reader: {
                    rootProperty: 'results'
                },
                simpleSortMode: true
            }
        });
        me.pieChartStore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'text', type: 'string'},
                {name: 'value', type: 'number'}
            ]
        });
    },

    getPieChart: function() {
        var me = this,
            height = Math.round(me.width * 0.55),
            padding = 20;
            // padding = Math.round(height * 0.15);

        var chart = Ext.create('Ext.chart.PolarChart', {
            reference: 'piechart',
            innerPadding: padding,
            height: height,
            border: false,
            theme: 'default-gradients',
            store: me.pieChartStore,
            legend: {
                docked: 'right'
            },
            series: [{
                type: 'pie',
                angleField: 'value',
                rotation: 45,
                title: 'text',
                label: {
                    field: 'text'
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: 'onPieSeriesTooltipRender'
                }
            }]
        });

        chart.getSeries()[0].setStyle({
            'opacity': 0.9, 'bevelWidth': 5, 'colorSpread': 0.5
        });
        return chart;
    },

    getChart: function() {
        var me = this,
            height = Math.round(me.width * 0.5);
        return Ext.create('Ext.container.Container', {
            layout: 'vbox',
            reference: 'chart',
            items: [{
                xtype: 'cartesian',
                reference: 'paretochart',
                theme: 'category3',
                width: '100%',
                height: height,
                padding: '5px 10px 5px 10px',
                store: me.mainStore,
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    fields: ['SBHTE'],
                    reconcileRange: true,
                    grid: true,
                    minimum: 0
                }, {
                    type: 'category',
                    position: 'bottom',
                    fields: 'name'
                }, {
                    type: 'numeric',
                    position: 'right',
                    fields: ['percent'],
                    reconcileRange: true,
                    majorTickSteps: 10,
                    minimum: 0,
                    maximum: 100,
                    renderer: 'onAxisLabelRender'
                }],
                series: [{
                    type: 'bar',
                    stacked: false,
                    xField: 'name',
                    yField: ['SBHTE', 'SFHTE'],
                    style: {
                        opacity: 0.80
                    },
                    highlight: {
                        fillStyle: 'rgba(204, 230, 73, 1.0)',
                        strokeStyle: 'black'
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: 'onBarSeriesTooltipRender'
                    }
                }, {
                    type: 'line',
                    xField: 'name',
                    yField: 'percent',
                    style: {
                        lineWidth: 2,
                        opacity: 0.80
                    },
                    marker: {
                        type: 'square',
                        fx: {
                            duration: 200
                        }
                    },
                    highlightCfg: {
                        scaling: 2,
                        rotationRads: Math.PI / 4
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: 'onLineSeriesTooltipRender'
                    }
                }]
            }]
        });
    },

    getGrid: function() {
        var me = this;

        var tbar = Ext.create('Ext.toolbar.Toolbar', {
            reference: 'subtbar',
            style: {"border": "none"},
            items: ['->', {
                xtype: 'button',
                iconCls: 'x-fa fa-table',
                tooltip: '查看详表',
                listeners: {
                    // click: 'onDetailBtnClick'
                }
            }]
        });

        var statGrid = Ext.create('Ext.grid.Panel', {
            reference: 'statgrid',
            width: me.width,
            height: 500,
            store: me.mainStore,
            tbar: tbar,
            rowLines: true,
            columnLines: true,
            scrollable: 'y',
            columns: [{
                text: '风电场',
                dataIndex: 'name',
                flex: 1,
                minWidth: 90,
                sortable: true
            }, {
                text: '申报合同额',
                dataIndex: 'SBHTE',
                sortable: true, width: 90,
                align: 'center'
            }, {
                text: '实付合同额',
                dataIndex: 'SFHTE',
                sortable: true, width: 90,
                align: 'center'
            }, {
                text: '实付比例',
                dataIndex: 'percent',
                sortable: true, width: 90,
                align: 'center',
                renderer: function(value) {
                    return value + '%';
                }
            }],
            listeners: {
                // rowclick: 'onGridRowClick',
                // rowdblclick: 'onGridRowDBClick'
            }
        });

        me.localizeGridMenu(statGrid);
        return statGrid;
    }

});