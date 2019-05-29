<template>
    <div class="ww-dropdown" @mouseover="setHoverMenu(true)" @mouseleave="setHoverMenu(false)" :class="{'open': forceOpen || focus }" :style="style">
        <!-- wwManager:start -->
        <wwOrangeButton class="ww-orange-button-top" v-if="editMode"></wwOrangeButton>
        <!-- wwManager:end -->
        <div class="dropdown-button-wrapper" :style="{'background-color': (enabledMenu ? hoverColor : backgroundColor)}">
            <wwObject tag="div" class="dropdown-button" :ww-object="wwObject.content.data.dropDownButton"></wwObject>
            <div class="dropdown-icon">
                <wwObject tag="div" class="dropdown-button-icon" :ww-object="wwObject.content.data.dropDownIcon" :class="{'rotate-icon':enabledMenu}"></wwObject>
            </div>
        </div>

        <div class="dropdown">
            <div class="triangle">
                <div class="triangle-after" :style="{'background-color': backgroundColor}"></div>
            </div>
            <div class="dropdown-list-wrapper">
                <wwLayoutColumn tag="div" :style="{'background-color': backgroundColor}" ww-default="ww-text" :ww-list="wwObject.content.data.list" class="dropdown-list" @ww-add="wwAdd($event)" @ww-remove="wwRemove($event)">
                    <wwObject tag="div" class="dropdown-element" v-for="(element, index) in wwObject.content.data.list" :key="element.uniqueId" :ww-object="element" @mouseover.native="setHoverColor(true, index)" @mouseleave.native="setHoverColor(false, index)" :style="{'background-color': ((elementHover && (activeElementIndex == index)) ? hoverColor: '')}"></wwObject>
                </wwLayoutColumn>
            </div>
        </div>
    </div>
</template>
 

<script>

export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            focus: false,
            forceOpen: false,
            enabledMenu: false,
            elementHover: false,
            activeElement: 0

        }
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        style() {
            let style = {};
            let wwObjectStyle = this.wwObject.content.data.style || {};
            style.justifyContent = wwObjectStyle.justify || 'center';
            return style;
        },
        editMode() {
            return this.wwObjectCtrl.getSectionCtrl().getEditMode() == 'CONTENT'
        },

        backgroundColor() {
            return this.wwObject.content.data.dropDownStyle.backgroundColor
        },
        hoverColor() {
            return this.wwObject.content.data.dropDownStyle.hoverColor
        },
        activeElementIndex() {
            return this.activeElement
        }


    },
    watch: {
    },
    beforeDestroy() { },
    methods: {
        init() {
            this.wwObject.content.data = this.wwObject.content.data || {}

            this.wwObject.content.data.dropDownStyle = this.wwObject.content.data.dropDownStyle || {};
            this.wwObject.content.data.dropDownStyle.backgroundColor = this.wwObject.content.data.dropDownStyle.backgroundColor || '#ffffff'
            this.wwObject.content.data.dropDownStyle.hoverColor = this.wwObject.content.data.dropDownStyle.hoverColor || '#fafafa'
            if (!this.wwObject.content.data.dropDownButton) {
                this.wwObject.content.data.dropDownButton = wwLib.wwObject.getDefault({
                    type: "ww-button",
                    data: {
                        style: {
                            backgroundColor: '#FFFFFF00',
                            borderWidth: 0
                        }
                    }
                });
                this.wwObjectCtrl.update(this.wwObject);

            }
            if (!this.wwObject.content.data.dropDownIcon) {
                this.wwObject.content.data.dropDownIcon = wwLib.wwObject.getDefault({
                    type: 'ww-icon',
                    data: {
                        icon: "fas fa-angle-down",
                        style: {
                            backgroundColor: '#FFFFFF00',
                            borderWidth: 0,
                            size: 24,
                            fontSize: 24
                        }
                    }
                }),
                    this.wwObjectCtrl.update(this.wwObject);

            }

            if (_.isEmpty(this.wwObject.content.data.list)) {
                this.wwObject.content.data.list = [];
                this.wwObject.content.data.list.push(
                    wwLib.wwObject.getDefault({
                        type: "ww-text",
                        data: {
                            text: {
                                fr: "place holder",
                                en: "place holder"
                            }
                        }
                    })
                )
            }

        },

        /* wwManager:start */
        /*=============================================m_ÔÔ_m=============================================\
          EDIT
        \================================================================================================*/
        async edit() {

            wwLib.wwPopups.addStory('WWDROP_CUSTOM', {
                title: {
                    en: 'Color picker',
                    fr: 'Choisir une couleur'
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'Background Color:',
                                fr: 'Couleur du fond :'
                            },
                            type: 'color',
                            key: 'backgroundColor',
                            value: "#ffffff",
                            valueData: 'backgroundColor',
                            desc: {
                                en: 'Choose a Background color',
                                fr: 'Changer la couleur du fond '
                            }
                        },
                        {
                            label: {
                                en: 'Hover Color:',
                                fr: 'Couleur du Hover :'
                            },
                            type: 'color',
                            key: 'hoverColor',
                            value: "#fafafa",
                            valueData: 'hoverColor',
                            desc: {
                                en: 'Choose the Hover color',
                                fr: 'Changer la couleur du Hover '
                            }
                        },
                    ]
                },
                buttons: {

                    NEXT: {
                        text: {
                            en: 'Ok',
                            fr: 'Ok'
                        },
                        next: false
                    }
                }
            })

            let options = {
                firstPage: 'WWDROP_CUSTOM',
                data: {
                    wwObject: this.wwObject,
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/


                if (typeof (result.backgroundColor) != 'undefined') {
                    this.wwObject.content.data.dropDownStyle.backgroundColor = result.backgroundColor;
                }
                if (typeof (result.hoverColor) != 'undefined') {
                    this.wwObject.content.data.dropDownStyle.hoverColor = result.hoverColor;
                }

                this.wwObjectCtrl.update(this.wwObject);

                this.wwObjectCtrl.globalEdit(result);


            } catch (error) {
                console.log(error);
            }

        },
        setFocus(focusId) {
            this.focus = focusId == this.$parent._uid
        },
        wwAdd(options) {
            this.wwObject.content.data.list.splice(options.index, 0, options.wwObject);
            this.wwObjectCtrl.update(this.wwObject);
        },
        wwRemove(options) {
            this.wwObject.content.data.list.splice(options.index, 1);
            this.wwObjectCtrl.update(this.wwObject);
        },
        toggle() {
            this.forceOpen = !this.forceOpen;
        },
        /* wwManager:end */


        setHoverMenu(value) {
            this.enabledMenu = value
        },
        setHoverColor(value, index) {
            this.activeElement = index
            this.elementHover = value
        },


    },
    mounted() {
        this.init();
        /* wwManager:start */
        wwLib.$on('wwFocus', this.setFocus);
        /* wwManager:end */

        this.$emit('ww-loaded', this);
    },
    beforeDestroy() {
        /* wwManager:start */
        wwLib.$off('wwFocus', this.setFocus);
        /* wwManager:end */
    }
};
</script>

<style scoped lang='scss'>
.ww-dropdown {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    &.open,
    &:hover {
        .dropdown {
            opacity: 1;
            visibility: visible;
            pointer-events: all;
        }
    }
    /* wwManager:start */
    .ww-orange-button-top {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-100%, -50%);
        z-index: 1;
    }
    /* wwManager:end */
    .triangle {
        width: 20px;
        height: 20px;
        position: relative;
        overflow: hidden;
        float: right;
        right: 50%;
        top: 1px;
        z-index: 10;
        transform: translate(50%, 0%);
        box-shadow: 0 16px 10px -17px rgba(0, 0, 0, 0.5);
    }
    .triangle-after {
        position: absolute;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        top: 13px;
        left: 2px;
        box-shadow: 0px 0px 6px -2px rgba(0, 0, 0, 0.5);
    }

    .dropdown-button-wrapper {
        width: 100%;
        height: 100%;
        // padding: 10px;
        display: flex;
        align-items: center;
        border-radius: 10px;
        .dropdown-button {
            display: flex;
        }
        .dropdown-icon {
            display: flex;
            .dropdown-button-icon {
                margin-left: 5px;
                margin-right: 5px;
            }
            // .rotate-icon {
            //     transform: rotate(180deg);
            // }
        }
    }
    .dropdown {
        z-index: 10;
        min-width: 100px;
        width: max-content;
        position: absolute;
        top: calc(100% - 1px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.3s ease;
        .dropdown-list-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            .background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            .dropdown-list {
                z-index: 1;
                box-shadow: 0px 0px 3px 0px #bfbfbf;
                border-radius: 10px;
                padding: 10px;
                .dropdown-element {
                    width: 100%;
                    margin-bottom: 5px;
                    &.open,
                    &:hover {
                        border-radius: 10px;
                    }
                }
            }
        }
    }
}

/* wwManager:start */
.ww-orange-button {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    z-index: 1;
}
/* wwManager:end */
</style>

<style lang="scss">
.ww-dropdown {
    .dropdown {
        .dropdown-list {
            .dropdown-element {
                &.open,
                &:hover {
                    // * {
                    //     color: #8f1afe !important;
                    //     border-color: #8f1afe !important;
                    // }
                }
            }
        }
    }
    .dropdown-button-wrapper {
        .dropdown-icon {
            .ww-icon > div {
                transition: all 0.3s ease;
            }
            .rotate-icon {
                .ww-icon > div {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>

