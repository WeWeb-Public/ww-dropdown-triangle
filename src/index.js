import wwObject from './wwObjectDropdown.vue'

const name = "__NAME__";
const version = '__VERSION__';

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            content: {
                type: name,
                data: {
                    dropDownIcon: null,
                    dropDownButton: null,
                    style: {
                        justify: null
                    },
                    title: null,
                    background: null,
                    list: [],
                    dropDownStyle: {
                        backgroundColor: '#FFFFFF',
                        hoverColor: '#FAFAFA',
                    }
                }
            },
            upsales: {
                wwAnalytics: {
                    click: true
                }
            },
            /* wwManager:start */
            cmsOptions: {
                wwObjectMenu: {
                    items: [
                        {
                            name: 'OPTIONS',
                            main: true,
                            text: {
                                en: 'Options',
                                fr: 'Options'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        },
                        {
                            name: 'TOGGLE',
                            text: {
                                en: 'Keep open',
                                fr: 'Garder ouvert'
                            },
                            icon: 'wwi wwi-chevron-down',
                            action: 'toggle'
                        }
                    ]
                }
            }
            /* wwManager:end */
        });

        window.vm.addComponent({
            name: name,
            version: version,
            content: wwObject
        });

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}