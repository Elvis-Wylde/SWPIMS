Ext.define('RMIS.view.windows.BalanceMgrWindow', {
    extend: 'RMIS.view.windows.MainWindow',

    title: '合同结算管理',

    layout: {
        type: 'fit'
    },

    initComponent: function() {
        var me = this;
        me.initWindowBounds();
        me.items = [me.getGrid()];
        me.callParent();
    },

    getGrid: function() {
        var me = this;

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
            rowLines: true,
            columnLines: true,
            scrollable: 'y',
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: '项目名称',
                width: 280,
                locked: true,
                sortable: true,
                dataIndex: 'itemname'
            }, {
                text: '施工形象',
                dataIndex: 'SGXX',
                sortable: true,
                width: 80,
                align: 'center',
                renderer: function(value) {
                    if (value) {
                        return "100%";
                    }
                }
            }, {
                text: '质量检验',
                columns: [{
                    text: '测量',
                    dataIndex: 'ZLCL',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>已完成</span>';
                        }
                    }]
                }, {
                    text: '试验检测',
                    dataIndex: 'ZLSYJC',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>已完成</span>';
                        }
                    }]
                }, {
                    text: '工序评定',
                    dataIndex: 'ZLGXPD',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            if (v === undefined) {
                                return '';
                            } else {
                                if (v === true) {
                                    return 'array-grid-buy-col';
                                } else {
                                    return 'array-grid-sell-col';
                                }
                            }
                        },
                        getTip: function(v, meta, rec) {
                            if (v === undefined) {
                                return '';
                            } else {
                                if (v === true) {
                                    return '<span style=\'color: #d6ff84\'>已完成</span>';
                                } else {
                                    return '工序评定资料报评及时性：<span style=\'color: #d6ff84\'>满足要求</span><br/>' +
                                        '工序资料填写规范性：<span style=\'color: #d6ff84\'>满足要求</span><br/>' +
                                        '工序资料完整性：<span style=\'color: #ff88a0\'>不完整</span>';
                                }
                            }
                        }
                    }]
                }]
            }, {
                text: '电气设备检验',
                columns: [{
                    text: '开箱检查',
                    dataIndex: 'DQKXJC',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>已完成</span>';
                        }
                    }]
                }, {
                    text: '电气试验',
                    dataIndex: 'DQSY',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>已完成</span>';
                        }
                    }]
                }]
            }, {
                text: '体系检查',
                columns: [{
                    text: '质量',
                    dataIndex: 'TXZL',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>良好</span>';
                        }
                    }]
                }, {
                    text: '安全',
                    dataIndex: 'TXAQ',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            return v === undefined ? '' : 'array-grid-buy-col';
                        },
                        getTip: function(v, meta, rec) {
                            return v === undefined ? '' : '<span style=\'color: #d6ff84\'>良好</span>';
                        }
                    }]
                }, {
                    text: '主要方案',
                    dataIndex: 'TXFA',
                    width: 80,
                    align: 'center',
                    xtype: 'actioncolumn',
                    items: [{
                        getClass: function(v, meta, rec) {
                            if (v === undefined) {
                                return '';
                            } else {
                                if (v === true) {
                                    return 'array-grid-buy-col';
                                } else {
                                    return 'array-grid-sell-col';
                                }
                            }
                        },
                        getTip: function(v, meta, rec) {
                            if (v === undefined) {
                                return '';
                            } else {
                                if (v === true) {
                                    return '<span style=\'color: #d6ff84\'>已上报</span>';
                                } else {
                                    return '方案是否已上报：<span style=\'color: #ff88a0\'>未上报</span><br/>';
                                }
                            }
                        }
                    }]
                }]
            }, {
                text: '验评（竣工）资料归档',
                dataIndex: 'YPZL',
                width: 80,
                align: 'center',
                xtype: 'actioncolumn',
                items: [{
                    getClass: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === true) {
                                return 'array-grid-buy-col';
                            } else {
                                return 'array-grid-sell-col';
                            }
                        }
                    },
                    getTip: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === true) {
                                return '<span style=\'color: #d6ff84\'>已完成</span>';
                            } else {
                                return '存在未完成工程：<span style=\'color: #ff88a0\'>是</span><br/>' +
                                    '验评资料归档：<span style=\'color: #ff88a0\'>未完成</span><br/>';
                            }
                        }
                    }
                }]
            }, {
                text: '遗留事项',
                dataIndex: 'YLSX',
                width: 80,
                align: 'center',
                xtype: 'actioncolumn',
                items: [{
                    getClass: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === true) {
                                return 'array-grid-buy-col';
                            } else {
                                return 'array-grid-alert-col';
                            }
                        }
                    },
                    getTip: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === true) {
                                return '<span style=\'color: #d6ff84\'>无遗留事项</span>';
                            } else {
                                return '<span style=\'color: #ff88a0\'>存在未完成相关工作</span>';
                            }
                        }
                    }
                }]
            }, {
                text: '申报合同额',
                dataIndex: 'SBHTE',
                sortable: true,
                width: 100,
                align: 'center',
                renderer : function(value) {
                    return parseFloat(value).toFixed(2) + '万元';
                }
            }, {
                text: '付款比例',
                dataIndex: 'HTBL',
                sortable: true,
                width: 80,
                align: 'center',
                renderer: function(value) {
                    return value + '%';
                }
            }, {
                text: '实付合同金额',
                dataIndex: 'SFHTE',
                width: 100,
                align: 'center',
                renderer : function(value) {
                    return parseFloat(value).toFixed(2) + '万元';
                }
            }, {
                text: '实付比例',
                dataIndex: 'SFBL',
                width: 80,
                align: 'center',
                renderer : function(value) {
                    if (value == "0") {
                        return  '<span style=\'color: red\'>' + value + '%</span>';
                    } else {
                        return value + "%";
                    }
                }
            }, {
                text: '结算时间',
                dataIndex: 'JSSJ',
                width: 130,
                align: 'center',
                formatter: 'date("Y年m月d日")'
            }, {
                text: '结算',
                dataIndex: 'KYJS',
                sortable: true,
                width: 80,
                align: 'left',
                xtype: 'actioncolumn',
                items: [{
                    getClass: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === '0') {
                                return 'array-grid-jiesuan-col';
                            } else if (v === '1') {
                                return 'array-grid-daijiesuan-col';
                            } else {
                                return 'array-grid-nojiesuan-col';
                            }
                        }
                    },
                    getTip: function(v, meta, rec) {
                        if (v === undefined) {
                            return '';
                        } else {
                            if (v === '0') {
                                return '<span style=\'color: #d6ff84\'>已完成结算</span>';
                            } else if (v === '1') {
                                return '<span style=\'color: #d6ff84\'>开始结算</span>';
                            } else {
                                return '<span style=\'color: #ff88a0\'>无法结算</span>';
                            }
                        }
                    }
                }]
            }],
            listeners: {
                // rowclick: 'onGridRowClick',
                // rowdblclick: 'onGridRowDBClick'
            }
        });

        var tipRenderere = function(value, type) {
            var tip = '';

            if (value === undefined) {
                return;
            }
            if (value === true) {
                tip = '<span style=\'color: #d6ff84\'>已完成</span>';
                return '<span style=\'color: #d6ff84\' data-qshowDelay=0  data-qtip="' + tip + '"><img width="18px" height="18px" src="./resources/images/green-check-1.png"></span>';
            } else {
                if (type === 0) {
                    tip = '工序评定资料报评及时性：<span style=\'color: #d6ff84\'>满足要求</span><br/>' +
                        '工序资料填写规范性：<span style=\'color: #d6ff84\'>满足要求</span><br/>' +
                        '工序资料完整性：<span style=\'color: #ff88a0\'>不完整</span>';
                }
                return '<span style=\'color: #ff251e\' data-qshowDelay=0  data-qtip="' + tip + '">未完成</span>';
            }
        };

        me.localizeGridMenu(grid);
        return grid;
    }

});