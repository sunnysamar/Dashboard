sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/m/library",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/m/MessageToast",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/ui/core/message/ControlMessageProcessor",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox"

],
    function (Controller, JSONModel, FlattenedDataset, mobileLibrary, Device,
        MessageBox, Token, MessageToast, MessagePopover, MessagePopoverItem,
        ControlMessageProcessor, Message, coreLibrary, Fragment, Spreadsheet, MessaageBox) {
        "use strict";
        var detailContent;
        var MessageType = coreLibrary.MessageType;
        return Controller.extend("dsb.com.zcdashboard.controller.Main", {
            onInit: async function () {
                var oDeviceData = this.getOwnerComponent().getModel("device").getData();
                if (oDeviceData.browser.mobile) {
                    this.getView().byId("sMainVBoxCls").removeStyleClass("sapFDynamicPageAlignContent")
                } else {
                    this.getView().byId("sMainVBoxCls").addStyleClass("sapFDynamicPageAlignContent")
                }

                //     window.addEventListener('resize', function(event) {
                /*commnetd to check new code as per version                   
                                  /*   const oElement = $('div[id^="sMainVBoxCls"]');
                                    if(document.documentElement.clientWidth <= 600) {
                                        // document.querySelector('.sapFDynamicPageAlignContent').classList.remove("sapFDynamicPageAlignContent");
                                    } else {
                                        a.addClass("sapFDynamicPageAlignContent")
                                        // document.querySelector('.sapFDynamicPageAlignContent').classList.remove("sapFDynamicPageAlignContent");
                                    }
                                }, true); */
                //commnetd to check new code as per version  
                window.addEventListener('resize', function (event) {

                    // const oElement = $('div[id^="sMainVBoxCls"]');
                    if (document.documentElement.clientWidth <= 600) {
                        // oElement.removeClass("sapFDynamicPageAlignContent");
                        if (document.querySelectorAll('div[id*="sMainVBoxCls"]')[0]) {
                            document.querySelectorAll('div[id*="sMainVBoxCls"]')[0].classList.remove("sapFDynamicPageAlignContent");

                        }
                    } else {
                        // oElement.addClass("sapFDynamicPageAlignContent");
                        if (document.querySelectorAll('div[id*="sMainVBoxCls"]')[0]) {
                            document.querySelectorAll('div[id*="sMainVBoxCls"]')[0].classList.add("sapFDynamicPageAlignContent");
                        }
                    }
                }, true);


                this.oDeviceModel = this.getOwnerComponent().getModel("device");
                this.oMessageProcessor = new ControlMessageProcessor();
                this.oMessageManager = sap.ui.getCore().getMessageManager();
                this.oMessageManager.registerMessageProcessor(this.oMessageProcessor);
                debugger
                this.getView().setModel(new JSONModel(), "Data");
                debugger;
                // await this.getDefaultFilterValues();
                this.getFiltersData();
                this.searchKPIData();
                var oModel = this.getOwnerComponent().getModel();
                // this._dataLoadedPromise = new Promise((resolve, reject) => {
                //     oModel.attachRequestCompleted(function (oEvent) {
                //         if (oEvent.getParameter("success")) {
                //             resolve();
                //         } else {
                //             reject(new Error("Data load failed"));
                //         }
                //     });
                // });
                // var oModel = new JSONModel();
                // var odata = await oModel.loadData("../model/Countries.json", false)
                // oModel.attachRequestCompleted(function () {
                // }.bind(this));
                // this.getView().setModel(oModel, "Countries");
                // this.byId("vbi").setVisualFrame({
                //     "minLon": 3,
                //     "maxLon": 19,
                //     "minLat": 46,
                //     "maxLat": 56,
                //     "minLOD": 4
                // });

            },
            onAfterRendering: function () {
                // Wait until data is loaded and the view is rendered
                this._dataLoadedPromise.then(function () {
                    setTimeout(() => {
                        // this._adjustCardHeights();
                    }, 0);
                }.bind(this)).catch(function (oError) {
                    console.error(oError.message);
                });
            },
            onFromDateChange: function (oEvent) {
                var oView = this.getView();
                var oFromDatePicker = oView.byId("d1");
                var oToDatePicker = oView.byId("d2");

                var oFromDate = oFromDatePicker.getDateValue();
                var oToDate = oToDatePicker.getDateValue();

                if (oFromDate && oToDate && oFromDate > oToDate) {


                } else {
                    // Clear error state if the dates are valid
                    oFromDatePicker.setValueState("None");
                    oFromDatePicker.setValueStateText("");

                    oToDatePicker.setValueState("None");
                    oToDatePicker.setValueStateText("");
                }
            }
            ,

            onToDateChange: function (oEvent) {
                var oView = this.getView();
                var oFromDatePicker = oView.byId("d1");
                var oToDatePicker = oView.byId("d2");

                var oFromDate = oFromDatePicker.getDateValue();
                var oToDate = oToDatePicker.getDateValue();

                if (oFromDate && oToDate && oFromDate > oToDate) {


                } else {
                    // Clear error state if the dates are valid
                    oFromDatePicker.setValueState("None");
                    oFromDatePicker.setValueStateText("");

                    oToDatePicker.setValueState("None");
                    oToDatePicker.setValueStateText("");
                }
            },
           
            _validateDateRange: function () {
                var oView = this.getView();
                var oFromDatePicker = oView.byId("d1");
                var oToDatePicker = oView.byId("d2");

                var oFromDate = oFromDatePicker.getDateValue();
                var oToDate = oToDatePicker.getDateValue();
                var bHasError = false;

                // Validate From Date Picker
                if (!oFromDate && !oToDate) {
                    oFromDatePicker.setValueState("Error");
                    oFromDatePicker.setValueStateText("From Date is required");
                    oToDatePicker.setValueState("Error");
                    oToDatePicker.setValueStateText("To Date is required.");
                    MessageBox.alert("From Date and To Date is required");
                    bHasError = true;
                }
                else if (!oFromDate && oToDate) {
                    oFromDatePicker.setValueState("Error");
                    oFromDatePicker.setValueStateText("From Date is required");
                    MessageBox.alert("From Date is required");
                    oToDatePicker.setValueState("None");
                    bHasError = true;

                }
                else if (oFromDate && !oToDate) {
                    oToDatePicker.setValueState("Error");
                    oToDatePicker.setValueStateText("To Date is required");
                    MessageBox.alert("To Date is required");
                    oFromDatePicker.setValueState("None");
                    bHasError = true;

                }
                else if (oFromDate && oToDate && oFromDate > oToDate) {
                    // Set error state for the date pickers
                    oFromDatePicker.setValueState("Error");
                    oFromDatePicker.setValueStateText("From Date cannot be greater than To Date");
                    oToDatePicker.setValueState("Error");
                    oToDatePicker.setValueStateText("To Date cannot be less than From Date");
                    MessageBox.alert("From Date cannot be greater than To Date");
                    bHasError = true;



                } else {
                    // Clear error state if the dates are valid
                    oFromDatePicker.setValueState("None");
                    oFromDatePicker.setValueStateText("");

                    oToDatePicker.setValueState("None");
                    oToDatePicker.setValueStateText("");
                }
                if (bHasError) {
                    return bHasError;
                    return; // Exit the function or show a general message
                }
            }




            , onCompanycodeChange: function (oEvent) {
                // Get the selected company code from the ComboBox
                var sSelectedCompanyCode = oEvent.getParameter("selectedItem").getKey();

                // Get the view and the model
                var oView = this.getView();
                var oModel = oView.getModel("Data");

                // Get all cost center data
                var aAllCostCenters = oModel.getProperty("/Costcenter");

                // Filter cost centers based on the selected company code
                var aFilteredCostCenters = aAllCostCenters.filter(function (oCostCenter) {
                    return oCostCenter.Bukrs === sSelectedCompanyCode;
                });

                // Get the MultiComboBox control
                var oMultiComboBox = oView.byId("cb8");

                // Create a new JSON model for the filtered cost centers
                var oFilteredCostCenterModel = new sap.ui.model.json.JSONModel({
                    Costcenter: aFilteredCostCenters
                });

                // Set the new model to the MultiComboBox
                oMultiComboBox.setModel(oFilteredCostCenterModel);

                // Bind the items aggregation to the new model
                oMultiComboBox.bindItems({
                    path: "/Costcenter",
                    template: new sap.ui.core.Item({
                        key: "{Kostl}",
                        text: "{Ltext}"
                    })
                });



            }
            ,


            _adjustCardHeights: function () {
                var oView = this.getView();
                var nInitialHeight = 0;
                var nIntialOffsetHeight = 0;
                var oDom = ""
                this.getView().setBusy(true);
                var nFinalHeight = 0;
                var nCard = 0;
                setTimeout(function () {

                    // Set the items height to inital height
                    for (var i = 0; i <= 7; i++) {
                        const aItems = this.getView().byId("l" + i) && this.getView().byId("l" + i).getItems() ? this.getView().byId("l" + i).getItems() : [];
                        aItems.forEach((oItem) => {
                            if (oItem && oItem.getDomRef) {
                                var oDomRef = oItem.getDomRef();
                                if (oDomRef) {
                                    oDomRef.style.height = 'auto';
                                }
                            }
                        })
                    }
                    for (var i = 0; i <= 7; i++) {
                        const oDomeRef = this.getView().byId("c" + i).getDomRef()
                        if (oDomeRef.clientHeight > nInitialHeight) {
                            nInitialHeight = oDomeRef.clientHeight;
                            nIntialOffsetHeight = oDomeRef.offsetHeight;
                            oDom = oDomeRef;
                            if (this.getView().byId("l" + i) && this.getView().byId("l" + i).getItems) {

                                nFinalHeight = this.getView().byId("l" + i) ? this.getView().byId("l" + i).getDomRef().offsetHeight : 0;
                                nCard = this.getView().byId("l" + i).getItems().length;
                            }
                        }
                    }

                    for (var i = 0; i <= 7; i++) {
                        const nLocationCardHeight = this.getView().byId("c4").getContent().getDomRef().offsetHeight;
                        const aItems = this.getView().byId("l" + i) && this.getView().byId("l" + i).getItems() ? this.getView().byId("l" + i).getItems() : [];
                        const nListOffsetHeight = this.getView().byId("l" + i) ? this.getView().byId("l" + i).getDomRef().offsetHeight : 0;
                        if (aItems && aItems.length > 0 && aItems.length == nCard && nLocationCardHeight >= nListOffsetHeight) {
                            const nCellLength = nLocationCardHeight / aItems.length;
                            aItems.forEach((oItem) => {
                                var oDomRef = oItem.getDomRef();
                                oDomRef.style.height = nCellLength + 'px';
                            })
                        }
                    }
                    var nHeight = nIntialOffsetHeight + 'px';

                    for (var i = 0; i <= 7; i++) {
                        const oDomeRef = this.getView().byId("c" + i).getDomRef()
                        oDomeRef.style.height = nHeight;
                    }
                    for (var i = 0; i <= 7; i++) {
                        const aItems = this.getView().byId("l" + i) && this.getView().byId("l" + i).getItems() ? this.getView().byId("l" + i).getItems() : [];
                        if (aItems && aItems.length > 0 && aItems.length < nCard) {
                            const nCellLength = nFinalHeight / aItems.length;
                            aItems.forEach((oItem) => {
                                var oDomRef = oItem.getDomRef();
                                oDomRef.style.height = nCellLength + 'px';
                            })
                        }
                    }

                    this.getView().setBusy(false);
                }.bind(this), 1000)

                //   // Measure the height of each card
                //   aCardIds.forEach(function(sCardId) {
                //       var oCard = oView.byId(sCardId);
                //       var oList = oView.byId("l8");

                //             if (oCard && oList) {
                //                 var $list = oList.$(); // Use jQuery to access the DOM element
                //                 if ($list.length) {
                //                     // Calculate the height based on the list content
                //                     var iListContentHeight = $list[0].scrollHeight;
                //                     var iCardPadding = 20; 
                //                 }
                //             }
                //       if (oCard) {
                //           var $card = oCard.$(); // Use jQuery to access the DOM element
                //           var iHeight = $card.outerHeight();
                //           if (iHeight > iMaxHeight) {
                //               iMaxHeight = iHeight;
                //           }
                //       }
                //   });

                // Apply the maximum height to all cards
                //   aCardIds.forEach(function(sCardId) {
                //       var oCard = oView.byId(sCardId);
                //        degger;
                //       if (oCard) {
                //           oCard.$().css("height", iMaxHeight + "px");
                //       }
                //   });
            },

            onGroup: function () {
                this._updateVizFrame(
                    [
                        { name: 'Position', value: '{Postn}' },
                        { name: 'Org unit', value: '{Orgunit}' }
                    ],
                    [
                        { name: 'Employee Count', value: '{Cnt}' }
                    ],
                    ["Org unit"]
                );



            },
            _createDataset: function (dimensions, measures) {
                return new FlattenedDataset({
                    data: {
                        path: "/PoshdSet"
                    },
                    dimensions: dimensions,
                    measures: measures
                });
            },
            _updateVizFrame: function (dimensions, measures, dimensionFeedValue) {
                var oVizFrame = this.byId("idDonutChart");
                var oDataset = this._createDataset(dimensions, measures);

                // Update the dataset
                oVizFrame.setDataset(oDataset);


                // Update the feed for the dimension
                var oFeed = oVizFrame.getFeeds().find(function (feed) {
                    return feed.getUid() === "color";
                });

                if (oFeed) {
                    oFeed.setValues(dimensionFeedValue);
                }
            },
            getDefaultFilterValues: async function () {
                var oDataModel = this.getOwnerComponent().getModel();

                await oDataModel.read("/EmpdefSet", {
                    success: (oData) => {

                        this.getView().getModel("Data").setProperty("/AdminFilter", !/^0+$/.test(oData.results[0].Grp) ? oData.results[0].Grp : '');
                        this.getView().getModel("Data").setProperty("/DeptFilter", !/^0+$/.test(oData.results[0].Dept) ? oData.results[0].Dept : '');
                        this.getView().getModel("Data").setProperty("/SectFilter", !/^0+$/.test(oData.results[0].Sect) ? oData.results[0].Sect : '');
                        this.getView().getModel("Data").setProperty("/ContTypFilter", '');
                        this.getView().getModel("Data").setProperty("/FromDateFilter",
                            !/^0+$/.test(oData.results[0].Validitystartdate) ?
                                oData.results[0].Validitystartdate : '');
                        this.getView().getModel("Data").setProperty("/ToDateFilter",
                            !/^0+$/.test(oData.results[0].Validityenddate) ?
                                oData.results[0].Validityenddate : '');
                        this.getView().getModel("Data").setProperty("/CompanyFilter", '');
                        this.getView().getModel("Data").setProperty("/CostFilter", '');

                        this.getView().getModel("Data").setProperty("/AdminEnabled", /^0+$/.test(oData.results[0].Grp));
                        this.getView().getModel("Data").setProperty("/DeptEnabledd", /^0+$/.test(oData.results[0].Dept));
                        this.getView().getModel("Data").setProperty("/SectEnabled", /^0+$/.test(oData.results[0].Sect));
                        this.getView().getModel("Data").setProperty("/SdateEnabled",
                            /^0+$/.test(oData.results[0].Validitystartdate) ?
                                oData.results[0].Validitystartdate : '');
                        this.getView().getModel("Data").setProperty("/EdateEnabled",
                            /^0+$/.test(oData.results[0].Validityenddate) ?
                                oData.results[0].Validityenddate : '');
                        this.getView().getModel("Data").setProperty("/ConTypEnabled", true);
                        this.getView().getModel("Data").setProperty("/CompanyEnabled", true);
                        this.getView().getModel("Data").setProperty("/CostEnabled", true);
                        this.searchKPIData();
                    },
                    error: (oError) => {

                    }
                });
            },
            getFiltersData: async function () {
                // var oDataModel = this.getOwnerComponent().getModel();
                // var oAdminPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/GroupSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                // var oDeptPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/DepartmentSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                // var oSectPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/SectionSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                // var oContractPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/ContractSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                // var oCompanyPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/CompanycodeSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                // var oCostPromise = new Promise((resolve, reject) => {
                //     oDataModel.read("/CostcenterSet", {
                //         success: (oData) => {
                //             resolve(oData);
                //         },
                //         error: (oError) => {
                //             reject(oError);
                //         }
                //     })
                // })
                debugger;
                const oFilterData = this.getOwnerComponent().getModel("Filters").getData();
                // var aData = await Promise.all([oAdminPromise, oDeptPromise, oSectPromise, oContractPromise, oCompanyPromise, oCostPromise]);
                if (oFilterData) {
                    oFilterData.Admin.unshift({
                        Grp: '',
                        GrpText: ''
                    })
                    this.getView().getModel("Data").setProperty("/Administrations", oFilterData.Admin);
                    oFilterData.Dept.unshift({
                        Dept: '',
                        Dept_Text: ''
                    })
                    this.getView().getModel("Data").setProperty("/Departments", oFilterData.Dept);
                    oFilterData.CostCenter.unshift({
                        Sect: '',
                        SectText: ''
                    })
                    this.getView().getModel("Data").setProperty("/Sections", oFilterData.CostCenter);
                    // aData[3].results.unshift({
                    //     Persk: '',
                    //     Cont_text: ''
                    // })

                    // this.getView().getModel("Data").setProperty("/ContactTypes", aData[3].results);
                    this.getView().getModel("Data").setProperty("/Companycode", oFilterData.CompanyCode);
                    this.getView().getModel("Data").setProperty("/Costcenter", oFilterData.CostCenter);

                }
            },
            searchKPIData: async function () {

debugger
                // var bHasError = this._validateDateRange();
                var bHasError = false;

                if (bHasError) {
                    // Optionally show a message or handle the error

                    return; // Exit the function if validation fails
                }

                else {

                    for (var i = 0; i <= 7; i++) {
                        const oDomeRef = this.getView().byId("c" + i).getDomRef()
                        if (oDomeRef) {
                            oDomeRef.style.height = 'auto';
                        }
                    }
                    this.getView().setBusy(true);
                    var aFilters = this.getAllFilters();
                    var newFilters = this.getNewFilters();
                    // var oDataModel = this.getOwnerComponent().getModel();
                    // var oContractKPI = new Promise((resolve, reject) => {
                    //     oDataModel.read("/Contract_hdSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oGenderPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/GenderHDSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oLocPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/LocationHDSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oEmpPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/EmphdcntSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })

                    // var oEtoverPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/EmptoverSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oProcurPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/ProcurementSet", {
                    //         filters: newFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oBudgetPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/BudgetSet", {
                    //         filters: newFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // debugger;
                    // var oBudgettypePromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/Budget_typeSet", {
                    //         filters: newFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oPoshdPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/PoshdSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })

                    // var oCountryPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/NathdSet", {
                    //         filters: aFilters,
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var oContractPromise = new Promise((resolve, reject) => {
                    //     oDataModel.read("/ContractSet", {
                    //         success: (oData) => {
                    //             resolve(oData);
                    //         },
                    //         error: (oError) => {
                    //             reject(oError);
                    //         }
                    //     })
                    // })
                    // var aData = await Promise.all([oContractKPI, oGenderPromise, oLocPromise, oEmpPromise, oEtoverPromise, oProcurPromise, oBudgetPromise, oBudgettypePromise, oPoshdPromise, oCountryPromise]);
                    debugger
                    const oKPIData = this.getOwnerComponent().getModel("KeyFigures").getData();
                    const oHeadCount = this.getOwnerComponent().getModel("HeadCount").getData();
                    if (oKPIData) {
                        var aValidCotractData = this.handleGroupData(oKPIData.HCContract, "Cnt", "ContText");
                        this.getView().getModel("Data").setProperty("/ContractTypeKPIData", aValidCotractData);
                        var aValidLocationKPIData = this.handleGroupData(oKPIData.Location, "Cnt", "Location");

                        this.getView().getModel("Data").setProperty("/LocationKPIData", aValidLocationKPIData);
                        var aValidGenderKPIData = this.handleGroupData(oKPIData.Gender, "Cnt", "Gender");
                        this.getView().getModel("Data").setProperty("/GenderKPIData", aValidGenderKPIData);
                        var aValidEmpKPIData = this.handleGroupData(oKPIData.EmpData, "Cnt", "EmpType");
                        this.getView().getModel("Data").setProperty("/EmpKPIData", aValidEmpKPIData);
                        var aValidEmpTData = this.handleGroupData(oKPIData.EmpTurnRate, "Percentage", "EmpType");
                        this.getView().getModel("Data").setProperty("/EmpTData", aValidEmpTData);
                        var aValidProcData = this.handleGroupData(oKPIData.Procurement, "Cnt", "Ptype");
                        this.getView().getModel("Data").setProperty("/PrData", aValidProcData);
                        var aValidBudgetData = this.handleGroupData(oKPIData.Budget, "Cnt", "Ptype");
                        this.getView().getModel("Data").setProperty("/BudgetData", aValidBudgetData);
                        var aValidBudgettypeData = this.handleGroupData(oKPIData.BudgetType, "Cnt", "Ptype");
                        this.getView().getModel("Data").setProperty("/BudgettypeData", aValidBudgettypeData);
                        var aPositionData = jQuery.extend(true, [], oHeadCount.HeadCountByPos);
                        this.getView().getModel("Data").setProperty("/PositionData", aPositionData);
                        if (this.getView().byId("sSegBtnId").getSelectedKey() === "group") {
                            this.onGroupPress();

                        } else {
                            this.onUnGroupPress();
                        }
                        // var aValidPosData = this.handleGroupData(aData[7], "Cnt", "Plstx");
                        // debugger;
                        // this.getView().getModel("Data").setProperty("/PosData", aValidPosData);
                        var aValidCountryData = this.handleGroupData(oHeadCount.Country, "Cnt", "Natio");

                        var aCountries = this.getOwnerComponent().getModel("Countries").getProperty("/countries");
                        var aAllCountries = [];
                        aValidCountryData.forEach(function (oCountry) {
                            var oInitialCountry = oCountry;

                            // oCountry.value 
                            var oFoundCountry = aCountries.find(i => i.code === oCountry.text);
                            if (oFoundCountry) {
                                oInitialCountry = Object.assign({}, oFoundCountry, oCountry);
                            }
                            if (parseInt(oCountry.value) < 3) {
                                oInitialCountry.color = "rgb(255, 0, 0)";
                            } if (parseInt(oCountry.value) > 3 && parseInt(oCountry.value) < 8) {
                                oInitialCountry.color = "rgb(255, 165, 0)";
                            } else {
                                oInitialCountry.color = "rgb(0, 128, 0)";
                            }
                            aAllCountries.push(oInitialCountry);
                        }.bind(this))
                        debugger
                        this.getView().getModel("Data").setProperty("/Countries", aAllCountries);
                        this._adjustCardHeights();

                    }

                    // Handle any errors that occur during the fetch operation

                }

                // this.getView().setBusy(false);

            },
            handleGroupData: function (aData, sCountKey, sGroupKey) {
                var groupedData = aData.reduce((acc, item) => {
                    const keyValue = item[sGroupKey];
                    if (!acc[keyValue]) {
                        acc[keyValue] = [];
                    }
                    acc[keyValue].push(item);
                    return acc;
                }, {})
                var aFinalData = [];
                for (var key in groupedData) {
                    var count = 0;
                    groupedData[key].forEach((oData) => {
                        count += parseInt(oData[sCountKey]);
                    })
                    var oItem = {
                        text: key,
                        value: count + ""
                    }
                    aFinalData.push(oItem)
                }
                return aFinalData;
            },
            handleGData: function (aData, sCountKey, sGroupKey) {
                var groupedData = aData.results.reduce((acc, item) => {
                    const keyValue = item[sGroupKey];
                    if (!acc[keyValue]) {
                        acc[keyValue] = [];
                    }
                    acc[keyValue].push(item);
                    return acc;
                }, {})
                var aFinalData = [];
                for (var key in groupedData) {
                    var count = 0;
                    groupedData[key].forEach((oData) => {
                        count += oData[sCountKey];
                    })
                    var oItem = {
                        text: key,
                        value: count
                    }
                    aFinalData.push(oItem)
                }
                return aFinalData;
            },
            getAllFilters: function () {
                var oData = this.getView().getModel("Data").getData();
                var aFilters = [];
                if (oData.AdminFilter) {
                    var oAdminFilter = new sap.ui.model.Filter({
                        path: "Grp",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.AdminFilter
                    });
                    aFilters.push(oAdminFilter);
                }
                if (oData.DeptFilter) {
                    var oDeptFilter = new sap.ui.model.Filter({
                        path: "Dept",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.DeptFilter
                    });
                    aFilters.push(oDeptFilter);
                }
                if (oData.SectFilter) {
                    var oSectFilter = new sap.ui.model.Filter({
                        path: "Sect",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.SectFilter
                    });
                    aFilters.push(oSectFilter);
                }
                if (oData.ContTypFilter) {
                    var oContrtFilter = new sap.ui.model.Filter({
                        path: "Contract",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.ContTypFilter
                    });
                    aFilters.push(oContrtFilter);
                }
                if (oData.FromDateFilter) {
                    var oFromDTFilter = new sap.ui.model.Filter({
                        path: "Validitystartdate",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.FromDateFilter
                    });
                    aFilters.push(oFromDTFilter);
                }
                if (oData.ToDateFilter) {
                    var oToDTFilter = new sap.ui.model.Filter({
                        path: "Validityenddate",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.ToDateFilter
                    });
                    aFilters.push(oToDTFilter);
                }
                return aFilters;

            }, getNewFilters: function () {
                var oData = this.getView().getModel("Data").getData();
                var aFilters = [];
                if (oData.CompanyFilter) {
                    var oCompcodeFilter = new sap.ui.model.Filter({
                        path: "Bukrs",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.CompanyFilter
                    });
                    aFilters.push(oCompcodeFilter);
                }

                if (oData.CostFilter) {
                    var oCostcenterFilter = new sap.ui.model.Filter({
                        path: "Kostl",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.CostFilter
                    });
                    aFilters.push(oCostcenterFilter);
                }
                if (oData.FromDateFilter) {
                    var oFromDTFilter = new sap.ui.model.Filter({
                        path: "Validitystartdate",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.FromDateFilter
                    });
                    aFilters.push(oFromDTFilter);
                }
                if (oData.ToDateFilter) {
                    var oToDTFilter = new sap.ui.model.Filter({
                        path: "Validityenddate",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.ToDateFilter
                    });
                    aFilters.push(oToDTFilter);
                }
                return aFilters;
            },
            onClickItem: function (oEvent) {
                debugger
                this.oSelectedCircle = oEvent.getParameter("instance").getBindingContext("Data").getObject();
                // this.getView().getModel("Data").setProperty("/mapdata", oSelectedCircle)
                // var oButton = oButton = oEvent.getParameters().instance,
                //     oView = this.getView();

                // // create popover
                // if (!this._pPopover) {
                //     this._pPopover = Fragment.load({
                //         id: oView.getId(),
                //         name: "dsb.com.zcdashboard.view.MapArea",
                //         controller: this
                //     }).then(function(oPopover) {
                //         oView.addDependent(oPopover);
                //         oPopover.bindElement("/ProductCollection/0");
                //         return oPopover;
                //     });
                // }
                // this._pPopover.then(function(oPopover) {
                //     const oCircle = new sap.ui.vbm.Circle();
                //     oPopover.openBy(oButton);
                // });
                oEvent.getParameters().instance.openDetailWindow("Circle", "0", "0");
                detailContent = oEvent.getSource().getTooltip();
            },
            onOpenDetail: function (evt) {
                var cont = document.getElementById(evt.getParameter("contentarea").id);
                cont.innerHTML = `<p>Country: ${this.oSelectedCircle.legend ? this.oSelectedCircle.legend : this.oSelectedCircle.text}</p><p>Count: ${this.oSelectedCircle.value}</p>`;
                cont.style.color = "Blue";
            },
            onPressResize: function () {
                if (this.byId("btnResize").getTooltip() == "Minimize") {
                    this.getView().byId("showMap").removeAllItems();
                    var clonedMapPanel = this.getView().byId("sMapPanel").clone()
                    this.getView().byId("showMap").insertItem(clonedMapPanel);
                    this.getView().byId("sMainVBoxCls").setVisible(false)
                    // if (Device.system.phone) {
                    //     // this.byId("vbi").minimize(132, 56, 1320, 560);//Height: 3,5 rem; Width: 8,25 rem
                    // } else {
                    //     // this.byId("vbi").minimize(window.innerWidth, window.innerHeight, 0, 0);//Height: 4,5 rem; Width: 10,5 rem
                    // }
                    this.byId("btnResize").setTooltip("Maximize");
                } else {
                    // this.byId("vbi").maximize();
                    // this.byId("btnResize").setTooltip("Minimize");
                    this.getView().byId("showMap").removeAllItems();
                    // this.getView().byId("showMap").insertItem(this.getView().byId("sMapPanel"));
                    this.getView().byId("sMainVBoxCls").setVisible(true)
                    this.byId("btnResize").setTooltip("Minimize");
                    this._adjustCardHeights();
                }

                debugger
            },
            onPressLegend: function (oEvent) {
                var oControl = oEvent.getSource().getParent().getParent().getContent()[0];
                var oLegentBtn = oEvent.getSource().getParent().getContent()[1];
                if (oControl.getLegendVisible() == true) {
                    oControl.setLegendVisible(false);
                    oLegentBtn.setTooltip("Show legend");
                } else {
                    oControl.setLegendVisible(true);
                    oLegentBtn.setTooltip("Hide legend");
                }
            },
            onGroupcodechange: function (oEvent) {
                // Get the selected company code from the ComboBox
                var sSelectedGroupCode = oEvent.getParameter("selectedItem").getKey();
                debugger;
                // Get the view and the model
                var oView = this.getView();
                // var oModel = this.getOwnerComponent().getModel();
                var oDepartmentSelect = this.byId("cb2");
                 // Clear previous items in the department dropdown
            oDepartmentSelect.removeAllItems();
            var oSectSelect = this.byId("cb3");
                 // Clear previous items in the department dropdown
            oSectSelect.removeAllItems();
                
                // Create a filter string based on the selected group code
// Create a filter for the department based on the selected group
var aFilters = [new sap.ui.model.Filter("Grp", sap.ui.model.FilterOperator.EQ, sSelectedGroupCode)];


// Fetch departments based on the selected group

var oModel = oView.getModel();
oModel.read("/DepartmentSet", {
    filters: aFilters,
    success: (oData) => {
        // Check if there are results
        if (oData.results.length === 0) {
            MessageToast.show("No departments found for the selected group.");
        } else {
            // Populate the department dropdown with fetched data
            oData.results.forEach((department) => {
                oDepartmentSelect.addItem(new sap.ui.core.Item({
                    key: department.Dept,        // Use the actual property name from your OData response
                    text: department.Dept_Text   // Use the actual property name from your OData response
                }));
            });
        }
    },
    error: (oError) => {   
        console.error("Error fetching departments");
    }
});
oModel.read("/SectionSet", {
    filters: aFilters,
    success: (oData) => {
        // Check if there are results
        if (oData.results.length === 0) {
            MessageToast.show("No sections found for the selected group.");
        } else {
            // Populate the department dropdown with fetched data
            oData.results.forEach((section) => {
                oSectSelect.addItem(new sap.ui.core.Item({
                    key: section.Sect,        // Use the actual property name from your OData response
                    text: section.SectText  // Use the actual property name from your OData response
                }));
            });
        }
    },
    error: (oError) => {   
        console.error("Error fetching section");
    }
});

       
                // Get all cost center data
                var aAllDept = oModel.getProperty("/Departments");

                // Filter cost centers based on the selected company code
                // var aFilteredDept = aAllDept.filter(function (oDepartment) {
                //     return oDepartment.Grp === sSelectedGroupCode;
                // });

                // Get the MultiComboBox control
                // var oMultiComboBox = oView.byId("cb2");

                // // Create a new JSON model for the filtered cost centers
                // var oFilteredDeptModel = new sap.ui.model.json.JSONModel({
                //     Dept: aFilteredDept
                // });

                // // Set the new model to the MultiComboBox
                // oMultiComboBox.setModel(oFilteredDeptModel);

                // // Bind the items aggregation to the new model
                // oMultiComboBox.bindItems({
                //     path: "/Departments",
                //     template: new sap.ui.core.Item({
                //         key: "{Dept}",
                //         text: "{Dept_Text}"
                //     })
                // });


            },
            onDeptcodechange:function(oEvent){
// Get the selected company code from the ComboBox
var sSelectedDeptCode = oEvent.getParameter("selectedItem").getKey();
debugger;
// Get the view and the model
var oView = this.getView();
// var oModel = this.getOwnerComponent().getModel();
var oGrpSelect = this.byId("cb1");
 // Clear previous items in the department dropdown
oGrpSelect.removeAllItems();
var oSectSelect = this.byId("cb3");
 // Clear previous items in the department dropdown
oSectSelect.removeAllItems();

// Create a filter string based on the selected group code
// Create a filter for the department based on the selected group
var aFilters = [new sap.ui.model.Filter("Dept", sap.ui.model.FilterOperator.EQ, sSelectedDeptCode)];


// Fetch departments based on the selected group

var oModel = oView.getModel();
oModel.read("/GroupSet", {
filters: aFilters,
success: (oData) => {
// Check if there are results
if (oData.results.length === 0) {
MessageToast.show("No Groups found for the selected department");
} else {
// Populate the department dropdown with fetched data
oData.results.forEach((grp) => {
oGrpSelect.addItem(new sap.ui.core.Item({
    key: grp.Grp,        // Use the actual property name from your OData response
    text: grp.GrpText   // Use the actual property name from your OData response
}));
});
}
},
error: (oError) => {   
console.error("Error fetching Group");
}
});
oModel.read("/SectionSet", {
filters: aFilters,
success: (oData) => {
// Check if there are results
if (oData.results.length === 0) {
MessageToast.show("No sections found for the selected group.");
} else {
// Populate the department dropdown with fetched data
oData.results.forEach((section) => {
oSectSelect.addItem(new sap.ui.core.Item({
    key: section.Sect,        // Use the actual property name from your OData response
    text: section.SectText  // Use the actual property name from your OData response
}));
});
}
},
error: (oError) => {   
console.error("Error fetching section");
}
});
            },
            onSectcodechange:function(oEvent){
                // Get the selected company code from the ComboBox
var sSelectedSectCode = oEvent.getParameter("selectedItem").getKey();
debugger;
// Get the view and the model
var oView = this.getView();
// var oModel = this.getOwnerComponent().getModel();
var oGrpSelect = this.byId("cb1");
 // Clear previous items in the department dropdown
oGrpSelect.removeAllItems();
var oDeptSelect = this.byId("cb2");
 // Clear previous items in the department dropdown
oDeptSelect.removeAllItems();

// Create a filter string based on the selected group code
// Create a filter for the department based on the selected group
var aFilters = [new sap.ui.model.Filter("Sect", sap.ui.model.FilterOperator.EQ, sSelectedSectCode)];


// Fetch departments based on the selected group

var oModel = oView.getModel();
oModel.read("/GroupSet", {
filters: aFilters,
success: (oData) => {
// Check if there are results
if (oData.results.length === 0) {
MessageToast.show("No Groups found for the selected department");
} else {
// Populate the department dropdown with fetched data
oData.results.forEach((grp) => {
oGrpSelect.addItem(new sap.ui.core.Item({
    key: grp.Grp,        // Use the actual property name from your OData response
    text: grp.GrpText   // Use the actual property name from your OData response
}));
});
}
},
error: (oError) => {   
console.error("Error fetching Group");
}
});
oModel.read("/DepartmentSet", {
    filters: aFilters,
    success: (oData) => {
        // Check if there are results
        if (oData.results.length === 0) {
            MessageToast.show("No departments found for the selected section");
        } else {
            // Populate the department dropdown with fetched data
            oData.results.forEach((department) => {
                oDeptSelect.addItem(new sap.ui.core.Item({
                    key: department.Dept,        // Use the actual property name from your OData response
                    text: department.Dept_Text   // Use the actual property name from your OData response
                }));
            });
        }
    },
    error: (oError) => {   
        console.error("Error fetching departments");
    }
});

            },
            onGroupPress: function () {
                var aPositionData = jQuery.extend(true, [], this.getView().getModel("Data").getProperty("/PositionData"));
                aPositionData.forEach((oItem) => {
                    oItem.Plstx = parseInt(oItem.Cnt) <= 10 ? "Others" : oItem.Plstx
                })
                var aValidPosData = this.handleGroupData(aPositionData, "Cnt", "Plstx");

                this.getView().getModel("Data").setProperty("/PosData", aValidPosData);

                const aColors = this.handleSetColorToCharts(aValidPosData);
                this.getView().byId("idDonutChart").setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: false
                        },
                        colorPalette: aColors
                    }
                });
            },
            onUnGroupPress: function () {
                var aPositionData = jQuery.extend(true, [], this.getView().getModel("Data").getProperty("/PositionData"));
                var aValidPosData = this.handleGroupData(aPositionData, "Cnt", "Plstx");
                this.getView().getModel("Data").setProperty("/PosData", aValidPosData);
                const aColors = this.handleSetColorToCharts(aValidPosData);
                this.getView().byId("idDonutChart").setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: false
                        },
                        colorPalette: aColors
                    }
                });
            },
            onExportPress: function (oEvent) {
                const sType = oEvent.getSource().getCustomData()[0].getValue();
                const sModelPropertyKey = oEvent.getSource().getCustomData()[0].getKey().split(",")[0];
                const sTitle = oEvent.getSource().getCustomData()[0].getKey().split(",")[1];
                const sElementId = oEvent.getSource().getCustomData()[0].getKey().split(",")[2];
                if (sType === 'csv') {
                    this.handleDownloadCSVData(sModelPropertyKey, sTitle);
                } else if (sType === 'pdf') {
                    this.handleDownloadPDFData(sTitle, sElementId);
                } else if (sType === 'image') {
                    this.handleDownloadImageData(sTitle, sElementId);
                } else {
                    this.handlePrintPress(sElementId);
                }
            },
            handlePrintPress: function (sElementId) {
                var printContent = this.getView().byId(sElementId).getDomRef().innerHTML;
                var printFrame = document.createElement('iframe');
                printFrame.style.position = 'absolute';
                printFrame.style.width = '0';
                printFrame.style.height = '0';
                printFrame.style.border = 'none';

                document.body.appendChild(printFrame);

                var printDoc = printFrame.contentWindow || printFrame.contentDocument;
                if (printDoc.document) {
                    printDoc = printDoc.document;
                }

                printDoc.open();
                printDoc.write('<style>@media print { @page { margin: 0; } body { margin: 0; } header, footer { display: none !important; } }</style>');
                printDoc.write('</head><body>');
                printDoc.write(printContent);
                printDoc.write('</body></html>');
                printDoc.close();

                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();

                printFrame.parentNode.removeChild(printFrame);
            },
            handleDownloadCSVData: function (sModelPropertyKey, sTitle) {
                var oSettings, oSheet;
                var aCols = [];

                aCols.push({
                    label: 'Text',
                    property: 'text',
                    type: "String"
                });

                aCols.push({
                    label: 'Count',
                    type: "Number",
                    property: 'value'
                });
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level',
                        context: {
                            sheetName: `${sTitle}.xlsx`,
                        }
                    },
                    dataSource: this.getView().getModel("Data").getProperty(`/${sModelPropertyKey}`),
                    fileName: `${sTitle}.xlsx`,
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            handleDownloadPDFData: function (sTitle, sElementId) {
                const oDiv = this.getView().byId("idDonutChart").getDomRef()
                this.getView().setBusy(true);
                html2canvas(oDiv).then(canvas => {
                    const imgData = canvas.toDataURL('image/jpeg');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'JPEG', 0, 0);
                    pdf.save(`${sTitle}.pdf`);
                    this.getView().setBusy(false);
                    MessageBox.success(`${sTitle}.pdf exported successfully`);
                }).catch(error => {
                    this.getView().setBusy(false);
                    MessageBox.success(`Failed to export`);
                });
            },
            handleDownloadImageData: function (sTitle, sElementId) {
                const oDiv = this.getView().byId(sElementId).getDomRef()
                this.getView().setBusy(true);
                html2canvas(oDiv).then(canvas => {
                    const imgData = canvas.toDataURL('image/jpeg');
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${sTitle}.jpeg`; // Set the desired file name
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.getView().setBusy(false);
                    MessageBox.success(`${sTitle}.jpeg exported successfully`);
                }).catch(error => {
                    MessageBox.success(`Failed to export`);
                    this.getView().setBusy(false);
                });
            },
            handleSetColorToCharts: function (aData) {
                const colors = ['#346187', '#b33939', '#218c74', '#EAB543', '#ffe700', '#873476'];
                const aColors = aData.map((oItem) => {
                    if (oItem.value <= 3) {
                        return "#b33939";
                    } else if (oItem.value > 3 && oItem.value <= 8) {
                        return "#ffe700";
                    } else if (oItem.value > 8 && oItem.value <= 10) {
                        return "#EAB543";
                    } else if (oItem.value > 10 && oItem.value <= 16) {
                        return "#218c74";
                    } else if (oItem.value > 16 && oItem.value <= 50) {
                        return "#873476";
                    } else if (oItem.value > 50) {
                        return "#346187";
                    }
                });
                return aColors;
            }

        });
    });
