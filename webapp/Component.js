/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "dsb/com/zcdashboard/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("dsb.com.zcdashboard.Component", {
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
                var oCanvasJQueryScript = document.createElement("script");
                oCanvasJQueryScript.setAttribute(
                    "src",
                    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
                );
                document.head.appendChild(oCanvasJQueryScript);


                var oJSPDFJQueryScript = document.createElement("script");
                oJSPDFJQueryScript.setAttribute(
                    "src",
                    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
                );
                document.head.appendChild(oJSPDFJQueryScript);

            }
        });
    }
);