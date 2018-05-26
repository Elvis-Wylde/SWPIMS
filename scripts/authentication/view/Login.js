Ext.define('RMIS.view.Login', {
    extend: 'RMIS.view.LockingWindow',
    xtype: 'login',

    requires: [
        'RMIS.view.Dialog',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button'
    ],
	
    viewModel: {
    	data: {
            userid: '',
            fullName: '',
            password: '',
            email: '',
            persist: false,
            agrees: false
        }
    },
	
    listeners: {
		afterrender: 'afterLoginRender'
	},
	
	title: '智慧风电信息管理系统',
	defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well
	
	items: [{
		xtype: 'authdialog',
		reference: 'authDialog',
		defaultButton: 'loginButton',
		referenceHolder: true,
		autoComplete: true,
		bodyPadding: '20 20',
		cls: 'auth-dialog-login',
		header: false,
		width: 415,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		
		defaults: {
			margin: '5 0'
		},
		
		items: [{
			xtype: 'label',
			text: '用户账户登录'
		}, {
			xtype: 'textfield',
			cls: 'auth-textbox',
			name: 'userid',
			reference: 'userid',
			bind: '{userid}',
			height: 55,
			hideLabel: true,
			allowBlank: false,
            ui: 'oneline',
			emptyText: '用户名',
			blankText: '用户名不能为空',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-email-trigger'
				}
			}
		}, {
			xtype: 'textfield',
			cls: 'auth-textbox',
			height: 55,
			hideLabel: true,
			emptyText: '密码',
			blankText: '请输入密码',
			inputType: 'password',
			name: 'password',
			reference: 'password',
			bind: '{password}',
			allowBlank: false,
            ui: 'oneline',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-password-trigger'
				}
			}
		}, , {
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype: 'textfield',
				cls: 'auth-textbox',
				flex: 1,
				height: 55,
				hideLabel: true,
				emptyText: '验证码',
				blankText: '请输入验证码',
				name: 'verifycode',
				reference: 'verifycode',
				allowBlank: false,
	            ui: 'oneline'
			}, {
				xtype: 'box',
				height: 55,
				html: '<img src="./resources/images/verifycode.png" style="width: 160px; height: 50px">'
			}]
		}, {
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype: 'checkboxfield',
				flex: 1,
				cls: 'form-panel-font-color rememberMeCheckbox',
				height: 30,
				reference: 'loginpersist',
				bind: '{persist}',
				boxLabel: '记住当前用户',
				listener: {
					change: function(btn, newValue, oldValue) {
						console.log(oldValue);
						console.log(newValue);
					}
				}
			}, {
				xtype: 'box',
				html: '<a href="#passwordreset" class="link-forgot-password"> 忘记密码 ?</a>'
			}]
		}, {
			xtype: 'button',
			reference: 'loginButton',
			scale: 'large',
			ui: 'soft-green',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: '登录',
			formBind: true,
			listeners: {
				click: 'onLoginButton'
			}
		}/*, {
			xtype: 'box',
			html: '<div class="outer-div"><div class="seperator">OR</div></div>',
			margin: '10 0'
		}, {
			xtype: 'button',
			scale: 'large',
			ui: 'gray',
			iconAlign: 'right',
			iconCls: 'x-fa fa-user-plus',
			text: '用户注册',
			listeners: {
				click: 'onNewAccount'
			}
		}*/]
	}],
	
	initComponent: function() {
		this.addCls('user-login-register-container');
		this.callParent(arguments);
	}
});
