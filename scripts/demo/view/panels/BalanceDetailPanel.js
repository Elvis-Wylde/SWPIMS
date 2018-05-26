Ext.define('RMIS.view.panels.BalanceDetailPanel', {
    extend: 'RMIS.view.panels.FloatPanel',
    xtype: 'balancedetailpanel',

    requires: [
        'RMIS.controller.panels.BalanceDetailPanelController'
    ],

    controller: 'balancedetailpanel',

    border: false,
    bodyBorder: false,
    // scrollable: 'y',
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
        me.items = [me.getGrid()];
        me.callParent();
    },

    getContentPanel: function() {
        return Ext.create('Ext.tree.grid', {

        });
    },

    getGrid: function() {
        var me = this;

        var tbar = Ext.create('Ext.toolbar.Toolbar', {
            reference: 'subtbar',
            style: {"border": "none"},
            items: ['->', {
                xtype: 'button',
                iconCls: 'x-fa fa-gear',
                tooltip: '结算管理',
                listeners: {
                    click: 'onDetailBtnClick'
                }
            }]
        });

        var grid = Ext.create('Ext.tree.Panel', {
            reference: 'grid',
            width: me.width,
            height: 500,
            rootVisible: false,
            useArrows: true,
            store: Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: './data/JSON/balancedetail.json',
                    simpleSortMode: true
                },
                autoLoad: true
            }),
            tbar: tbar,
            rowLines: true,
            columnLines: true,
            scrollable: 'y',
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: '项目名称',
                flex: 2,
                sortable: true,
                dataIndex: 'itemname'
            }, {
                text: '申报合同额',
                dataIndex: 'SBHTE',
                sortable: true, width: 90,
                align: 'center'
            }, {
                text: '付款比例',
                dataIndex: 'HTBL',
                sortable: true, width: 60,
                align: 'center',
                renderer: function(value) {
                    return value + "%";
                }
            }, {
                text: '结算',
                dataIndex: 'KYJS',
                sortable: true, width: 60,
                align: 'center',
                renderer: function(value) {
                    if (value === "0") {
                        return "<span style='color: green'>已结算</span>";
                    } else if (value === "1") {
                        return "<span style='color: #ffa958'>待结算</span>";
                    } else if (value === "2") {
                        return "<span style='color: red'>无法结算</span>";
                    } else {
                        return "";
                    }
                }
            }],
            listeners: {
                // rowclick: 'onGridRowClick',
                // rowdblclick: 'onGridRowDBClick'
            }
        });

        me.localizeGridMenu(grid);
        return grid;
    }

});

