Ext.define('RMIS.view.main.Permission', {
    extend: 'Ext.container.Container',
    xtype: 'permission',

    requires: [
        'Ext.panel.Panel',
        'Ext.plugin.Responsive',
        'Ext.button.Button',
        'RMIS.controller.main.PermissionController'
    ],

    controller: 'permission',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    initComponent:function(){
    	var me=this;
    	me.UserStore=RMIS.getApplication().getStore('UserList');
    	if(!me.UserStore.isLoaded()){
    		me.UserStore.load()
        }
        me.items=[{
        xtype: 'panel',
        ui: 'light',
        margin: 10,
        cls: 'pages-permission-container shadow',
        iconCls: 'x-fa fa-sitemap',
        title: '组织机构',
        tools: [{
            type: 'plus',
            itemId: 'orgAdd',
            reference: 'orgAdd',
            disabled: true,
            tooltip: '新增',
            callback: 'addOrg'
        }, {
            type: 'edit',
            itemId: 'orgEdit',
            reference: 'orgEdit',
            disabled: true,
            tooltip: '修改',
            callback: 'editOrg'
        }, {
            type: 'minus',
            itemId: 'orgDel',
            reference: 'orgDel',
            disabled: true,
            tooltip: '删除',
            callback: 'delOrg'
        }],
        responsiveConfig: {
            'width < 1000': {
                width: 0,
                visible: false
            },
            'width >= 1000 && width < 1600': {
                width: 230,
                visible: true
            },
            'width >= 1600': {
                width: 300,
                visible: true
            }
        },
        items: [{
            xtype: 'treelist',
            reference: 'orgTreeList',
            id: 'orgTreeList',
            itemId: 'orgTreeList',
            ui: 'org',
            store: 'OrgTree',
            expanderOnly: false,
            expanderFirst: false,
            listeners: {
                selectionchange: 'onTreeSelectionChange'
            }
        }],
        plugins: [{
            ptype: 'responsive'
        }]
    }, {
        xtype: 'panel',
        ui: 'light',
        margin: 10,
        flex: 1,
        cls: 'pages-permission-container shadow',
        iconCls: 'x-fa fa-user',
        title: '用户管理',
        tools: [{
            type: 'user-add',
            itemId: 'userAdd',
            reference: 'userAdd',
            tooltip: '新增用户',
            callback: 'addUser'
        }, {
            type: 'edit',
            itemId: 'userEdit',
            reference: 'userEdit',
            tooltip: '编辑用户',
            callback: 'editSelectedUser'
        }, {
            type: 'user-del',
            itemId: 'userDel',
            reference: 'userDel',
            tooltip: '删除用户',
            callback: 'delSelectedUser'
        }],
        bodyPadding: 10,
        items: [{
            xtype: 'grid',
            reference: 'userListGrid',
            itemId: 'userListGrid',
            id: 'userListGrid',
            store: me.UserStore,
            columns: [
                { text: '姓名', dataIndex: 'name', width: 100 },
                { text: '用户名', dataIndex: 'userid', width: 150 },
                { text: '机构', dataIndex: 'orgName', width: 200 },
                { text: '邮箱', dataIndex: 'email', flex: 1, },
                { text: '电话', dataIndex: 'phone', width: 120 },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    width: 140,
                    items: [{
                        iconCls: 'x-fa fa-edit',
                        tooltip: '编辑',
                        margin: '0 5',
                        handler: 'editUser'
                    }, {
                        iconCls: 'x-fa fa-user-times',
                        tooltip: '删除',
                        margin: '0 5',
                        handler: 'delUser'
                    }]
                }
                // {
                //     text: '操作',
                //     width: 140,
                //     xtype: 'widgetcolumn',
                //     widget: {
                //         xtype: 'container',
                //         items: [{
                //             xtype: 'button',
                //             text: '编辑',
                //             margin: '0 5',
                //             padding: 2,
                //             dataIndex: 'id',
                //             handler: 'editUser'
                //         }, {
                //             xtype: 'button',
                //             text: '删除',
                //             margin: '0 5',
                //             padding: 2,
                //             dataIndex: 'id',
                //             handler: 'delUser'
                //         }]
                //     }
                // }
            ],
        }]
    }];
    me.callParent();
    },
    padding: 10,
    
});