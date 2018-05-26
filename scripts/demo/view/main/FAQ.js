Ext.define('RMIS.view.main.FAQ', {
    extend: 'Ext.container.Container',
    xtype: 'faq',

    requires: [
        'Ext.panel.Panel',
        'Ext.plugin.Responsive',
        'Ext.button.Button',
        'Ext.layout.container.Accordion'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    padding: 10,

    items: [{
        xtype: 'panel',
        cls: 'faq-left-sidebar shadow',
        margin: 10,
        header: false,
        ui: 'light',
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
            xtype: 'panel',
            title: '基本要点',
            ui: 'light',
            cls: 'shadow pages-faq-container',
            iconCls: 'x-fa fa-lightbulb-o',
            html: '<p>列举了使用此系统所需的一些基础知识，请加以了解。</p>' 
            	+ '<ul class=\'faq-tips-list\'><li class=\'pointone\'>首先</li>' 
            	+ '<li class=\'pointtwo\'>其次</li>' 
            	+ '<li class=\'pointthree\'>再次</li>' 
            	+ '<li class=\'pointfour\'>最后</li></ul>',
            bodyPadding: 15
        }, {
            xtype: 'panel',
            bodyPadding: 20,
            ui: 'light',
            cls: 'shadow pages-faq-container',
            iconCls: 'x-fa fa-question',
            title: '未找到解决方案？',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'box',
                html: '<p>你可以通过下方的“发送邮件”按钮将问题通过邮件方式发送给我们，我们将尽快为您提供解答。如果发现平台存在错误或问题，也可以通过我们的《bug管理系统》进行提交。</p><br>'
            }, {
                xtype: 'button',
                ui:'soft-blue',
                margin: '20 20 10 20',
                text: '发送邮件'
            }, {
                xtype: 'button',
                ui:'soft-blue',
                margin: '10 20 20 20',
                text: '提交BUG'
            }]
        }],
        plugins: [{
            ptype: 'responsive'
        }]
    }, {
        xtype: 'panel',
        ui: 'light',
        margin: 10,
        flex: 1,
        cls: 'pages-faq-container shadow',

        iconCls: 'x-fa fa-question-circle',
        title: 'FAQs',
        bodyPadding: 15,
        items: [{
            xtype: 'panel',
            cls: 'FAQPanel',
            layout: 'accordion',
            title: '使用手册',
            height: 440,
            ui: 'light',
            defaults: {
            	scrollable: true,
                html: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
            },
            items: [{
                title: '主界面功能说明',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }, {
                title: '地图操作',
                widh: '100%',
                iconCls:'x-fa fa-caret-down',
                html: '\
                    <table>\
                    <tr>\
                        <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseLeft.svg') + '" width="48" height="48" /></td>\
                        <td>\
                            <div class="cesium-navigation-help-pan">漫游</div>\
                            <div>鼠标左键拖动</div>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseMiddle.svg') + '" width="48" height="48" /></td>\
                        <td>\
                            <div class="cesium-navigation-help-zoom">视角缩放</div>\
                            <div>鼠标中键拖动，或滚动鼠标滚轮</div>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td><img src="' + Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/MouseRight.svg') + '" width="48" height="48" /></td>\
                        <td>\
                            <div class="cesium-navigation-help-rotate">视角倾斜</div>\
                            <div>鼠标右键拖动，或CTRL+鼠标左键拖动</div>\
                        </td>\
                    </tr>\
                </table>'
            }, {
                title: '信息管理功能说明',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }, {
                title: '业务管理功能说明',
                widh: '100%',
                iconCls:'x-fa fa-caret-down'
            }]
        }, {
            xtype: 'panel',
            cls: 'FAQPanel',
            layout: 'accordion',
            title: '常见问题',
            height: 240,
            bodyPadding: 10,
            ui: 'light',
            defaults: {
                html: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
            },
            items: [{
                title: '问题1',
                iconCls:'x-fa fa-caret-down'
            }, {
                title: '问题2',
                iconCls:'x-fa fa-caret-down'
            }]
        }]
    }]
});
