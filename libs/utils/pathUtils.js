/**
 * @author yanglei
 * @date 20160325
 * @fileoverview 路由默认配置
 */
module.exports = {
    path(data, components, dropDown) {
        var defaultData = {
            type: '',
            title: '',
            query_api: '',
            components: {
                date: {
                    show: true,
                    defaultData: 7
                },
                dropDown: {
                    platform: true,
                    channel: true,
                    version: true,
                    coupon: true
                },
                date_type: {
                    show: true,
                    defaultData: [1, 2, 3]
                },
                btnGroups: {
                    position: '',
                    show: false,
                    groups: [
                        {
                            name: '',
                            key: '',
                            value: ''
                        }
                    ]
                }
            }
        };
        for(var key in data) {
            if(defaultData.hasOwnProperty(key)) {
                defaultData[key] = data[key];
            }
        }
        for(var key in components) {
            if(defaultData.components.hasOwnProperty(key)) {
                defaultData.components[key] = components[key];
            }
        }
        for(var key in dropDown) {
            if(defaultData.components.dropDown.hasOwnProperty(key)) {
                defaultData.components.dropDown[key] = dropDown[key];
            }
        }
        return defaultData;
    }
};