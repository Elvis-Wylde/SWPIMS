Ext.define('RMIS.controller.main.PermissionController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.permission',

  requires: [],

  /**
   * 树节点点击回调
   */
  onTreeSelectionChange: function(tree, node) {
    var me = this;
    var refs = me.view.refs;
    var nodeData = node.getData();
    var editable = nodeData.editable;
    var leaf = nodeData.leaf;

    me.destroyCurrentWindow();
    
    // 如果不可编辑
    if (editable === false) {
      refs.orgAdd.disable(true);
      refs.orgEdit.disable(true);
      refs.orgDel.disable(true);
    } else {
      if (leaf) { // 叶子节点
        refs.orgAdd.disable(true);
        refs.orgEdit.enable(true);
        refs.orgDel.enable(true);
      } else {
        refs.orgAdd.enable(true);
        refs.orgEdit.disable(true);
        refs.orgDel.disable(true);
      }
    }
  },

  /**
   * 新增机构
   */
  addOrg: function(panel, tool, event) {
    var me = this;
    me.destroyCurrentWindow();
 
    var treeList = me.view.refs.orgTreeList;
    var selectedNode = treeList.getSelection();

    me.currentWindow = Ext.create('Ext.window.Window', {
      title: '新增机构',
      height: 400,
      width: 500,
      layout: 'hbox',
      bodyPadding: 10,
      defaultType: 'textfield',
      items: [{
        width: '100%',
        fieldLabel: '机构名称',
        name: 'orgname',
      }],
      buttons: [{
        text: '确定',
        handler: function() {
          var orgname = me.currentWindow.down('textfield[name=orgname]').value;

          selectedNode.appendChild({
            id: Math.random(),
            text: orgname,
            leaf: true
          });

          me.currentWindow.destroy();
        }
      }, {
        text: '取消',
        handler: function() {
          me.currentWindow.destroy();
        }
      }]
    }).show();
  },
  /**
   * 编辑机构
   */
  editOrg: function(panel, tool, event) {
    var me = this;
    me.destroyCurrentWindow();

    var treeList = me.view.refs.orgTreeList;
    var selectedNode = treeList.getSelection();
    
    me.currentWindow = Ext.create('Ext.window.Window', {
      title: '编辑机构',
      height: 400,
      width: 500,
      layout: 'hbox',
      bodyPadding: 10,
      defaultType: 'textfield',
      items: [{
        width: '100%',
        fieldLabel: '机构名称',
        name: 'orgname',
      }],
      buttons: [{
        text: '确定',
        handler: function() {
          var treeList = me.view.refs.orgTreeList;
          var selectedNode = treeList.getSelection();
          // var treeStore = treeList.getStore();

          // var form = this.up('form');
          // console.log(form);
          var orgname = this.up('window').down('textfield[name=orgname]').value;

          selectedNode.set('text', orgname);

          me.currentWindow.destroy();
        }
      }, {
        text: '取消',
        handler: function() {
          me.currentWindow.destroy();
        }
      }]
    }).show();
    
    me.currentWindow.down('textfield[name=orgname]').setValue(selectedNode.getData().text);
  },
  /**
   * 删除机构
   */
  delOrg: function(panel, tool, event) {
    var me = this;
    me.destroyCurrentWindow();
    var refs = me.view.refs;
    var selectedNode = refs.orgTreeList.getSelection();
    selectedNode.remove();
  },

  openUserEditDialog: function(user) {
    var me = this;
    me.currentWindow = Ext.create('Ext.window.Window', {
      title: '新增用户',
      minHeight: 550,
      minWidth: 600,
      width: 600,
      cls: 'pages-permission-container',
      bodyPadding: 10,
      items: [{
        xtype: 'form',
        itemId: 'form',
        layout: 'column',
        defaultType: 'textfield',
        defaults: {
          padding: '5 10',
          columnWidth: 0.5
        },
        items: [{
          fieldLabel: '用户名',
          allowBlank: false,
          itemId: 'userid',
          name: 'userid'
        }, {
          inputType: 'password',
          fieldLabel: '密码',
          // allowBlank: user ? false : true,
          itemId: 'password',
          name: 'password'
        }, {
          fieldLabel: '姓名',
          allowBlank: false,
          itemId: 'name',
          name: 'name'
        }, {
          fieldLabel: '邮箱',
          allowBlank: false,
          itemId: 'email',
          name: 'email'
        }, {
          fieldLabel: '电话',
          allowBlank: false,
          itemId: 'phone',
          name: 'phone'
        }, {
        	xtype: 'radiogroup',
            fieldLabel: '角色',
            vertical: true,
            defaultType: 'radiofield',
            items:[{
                boxLabel  : '管理员',
                name      : 'power',
                inputValue: 1,
            }, {
                boxLabel  : '用户',
                name      : 'power',
                inputValue: 2,
            }
            ]
        },{
            xtype: 'filefield',
            name: 'image',
            fieldLabel: '头像',
            msgTarget: 'side',
            itemId: 'image',
            buttonText: '选择图片'
        }, {
          xtype: 'container',
          layout: 'hbox',
          items: [{
            xtype: 'label',
            text: '机构:',
            width: 105
          }, {
            xtype: 'treelist',
            itemId: 'org',
            id: 'org',
            ui: 'org',
            store: 'OrgTree',
            expanderFirst: false,
            height: 180,
            flex: 1,
            style: 'border: 1px solid #DDD; overflow: auto;',
            listeners: {
                selectionchange: function(tree, node) {
                  var nodeData = node.getData();
                  var form = me.currentWindow.getComponent('form');
                  var provinceComponent = form.getComponent('provincecbg');
                  var projectComponent = form.getComponent('project');
                  var areaComponent = form.getComponent('area');
                  if (nodeData.type === 'province') {
                    provinceComponent.show();
                  } else {
                    provinceComponent.hide();
                  }
  
                  if (nodeData.editable === false || !nodeData.leaf) {
                    areaComponent.hide();
                    projectComponent.hide();
                  } else {
                    areaComponent.show();
                    projectComponent.show();
                  }
                }
            }
          }],
          columnWidth: 1
        }, {
          xtype: 'checkboxgroup',
          hidden: true,
          fieldLabel: '范围',
          itemId: 'provincecbg',
          vertical: true,
          items: [
            { boxLabel: '省级业务', name: 'province', itemId: 'province' },
            { boxLabel: '省本级', name: 'provincecur', itemId: 'provincecur' }
          ],
          columnWidth: 1
        }, {
          xtype: 'combobox',
          name: 'projectid',
          hidden: true,
          itemId: 'project',
          fieldLabel: '项目',
          queryMode: 'local',
          displayField: 'name',
          valueField: 'id',
          store: 'Projects'
        }, {
          xtype: 'combobox',
          name: 'areaid',
          hidden: true,
          itemId: 'area',
          fieldLabel: '地区',
          queryMode: 'local',
          displayField: 'name',
          valueField: 'value',
          store: Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
              {"value":1, "name":"东区"},
              {"value":2, "name":"仁和区"},
              {"value":3, "name":"会东县"},
              {"value":4, "name":"会理县"},
              {"value":5, "name":"盐边县"},
              {"value":6, "name":"钒钛产业园区"}
            ]
          })
        }]
      }],
      buttons: [{
        text: '确定',
        handler: function() {
          var userListGrid = me.view.refs.userListGrid;
          var userStore = userListGrid.getStore();
          var form = me.currentWindow.getComponent('form').getForm();
          if(!form.isValid()) {
            return;
          }
          if (!user) {
            user = form.getFieldValues();
            user.id = Math.random();
            userStore.add(user);
          } else {
            form.setValues({
              province: me.currentWindow.getComponent('form').getComponent('provincecbg').getComponent('province').value,
              provincecur: me.currentWindow.getComponent('form').getComponent('provincecbg').getComponent('provincecur').value
            });
            form.updateRecord();
          }
          me.currentWindow.destroy();
        }
      }, {
        text: '取消',
        handler: function() {
          me.currentWindow.destroy();
        }
      }]
    }).show();

    if(user) {
      me.currentWindow.getComponent('form').getForm().loadRecord(user);
      var orgCmp = Ext.ComponentQuery.query('#org')[0];
      var orgStore = orgCmp.getStore();
      var selection = orgStore.findNode('id', user.get('orgid'));
      orgCmp.setSelection(selection);
      selection.parentNode.expand();
    }
  },

  /**
   * 新增用户
   */
  addUser: function() {
    var me = this;
    me.destroyCurrentWindow();
    this.openUserEditDialog();
  },
  /**
   * 编辑用户
   */
  editSelectedUser: function() {
    var me = this;
    var user = me.view.refs.userListGrid.getSelection();
    if(user && user[0]){
      me.openUserEditDialog(user[0]);
    } else {
      // me.destroyCurrentWindow();
    }
  },
  /**
   * 删除用户
   */
  delSelectedUser: function() {
    var me = this;
    me.destroyCurrentWindow();

    var refs = me.view.refs;
    var userListGrid = refs.userListGrid;
    var userStore = userListGrid.getStore();
    var selectedUser = userListGrid.getSelection();

    if (selectedUser) {
      userStore.remove(selectedUser);
    }
  },

  editUser: function(grid, rowIndex, colIndex){
    var user = grid.getStore().getAt(rowIndex);
    this.openUserEditDialog(user);
  },

  delUser: function(grid, rowIndex, colIndex) {
    var me = this;
    me.destroyCurrentWindow();

    var userStore = me.view.refs.userListGrid.getStore();
      var selectedUser = grid.getStore().getAt(rowIndex);
      userStore.remove(selectedUser);

  },

  destroyCurrentWindow: function(){
    this.currentWindow && this.currentWindow.destroy();
  }
});
