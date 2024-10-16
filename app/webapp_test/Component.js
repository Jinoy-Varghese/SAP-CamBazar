/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "project1/model/models",
        "sap/m/MessageBox"
    ],
    function (UIComponent, Device, models,MessageBox) {
        "use strict";

        return UIComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.getRouter().attachRouteMatched(this._onRouteMatched, this);


            },
            _onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                if (sRouteName !== "Routehome_view_01" && sessionStorage.getItem("loggedIn") !== "true") {  
                    this.getRouter().navTo("Routehome_view_01"); // Redirect to login page
                }
            }
        });
    }
);