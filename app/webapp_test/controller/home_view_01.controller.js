sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller,MessageBox,Fragment,JSONModel,Filter, FilterOperator) {
    "use strict";

    return Controller.extend("project1.controller.home_view_01", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Routelist_view_01").attachPatternMatched(this._onObjectMatched, this);
            // Initialize the model
            var oUserModel = new JSONModel();
            this.getView().setModel(oUserModel, "userModel");
        },
        _onObjectMatched: function (oEvent) {
            var user_name = oEvent.getParameter("arguments").name;
            var pass_word = oEvent.getParameter("arguments").pass;
            var oUserModel = this.getView().getModel("userModel");
            oUserModel.setProperty("/username", user_name);
            oUserModel.setProperty("/password", pass_word);
        },
        alertButton: function () {
            let username = this.getView().byId("input0").getValue();
            let password = this.getView().byId("input1").getValue();
            MessageBox.success("Username : "+username+" \nPassword : "+password);
          },

        //---------------start of login/logout----------------------//

        //Username : Nancy
        //Password : 5467

          onNavigateToList: function () {
            let username = this.getView().byId("input0").getValue();
            let password = this.getView().byId("input1").getValue();
            if(username == '' || password == ''){
                MessageBox.error("Invalid Username/Password");
            }
            else{
                let oModel = this.getView().getModel();
                oModel.read("/Employees", {
                    filters: [
                        new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.EQ, username),
                        new sap.ui.model.Filter("Extension", sap.ui.model.FilterOperator.EQ, password)
                    ],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            // Navigate to the next view if credentials are valid
                            sessionStorage.setItem("loggedIn", "true");
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("Routelist_view_01", {
                                name: username,
                                pass: password
                            });
                        } else {
                            MessageBox.error("Invalid Username/Password");
                        }
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Failed to fetch data from Northwind service");
                    }
                });

            }
        },
        logout: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            MessageBox.confirm("Are you sure, you want to logout?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        sessionStorage.removeItem("loggedIn");
                        oRouter.navTo("Routehome_view_01");
                    }
                }
            });
        },
        //---------------end of login/logout----------------------
        openPolicyDoc: function(){
            var oView = this.getView();
            if(!this.byId("frag1")){
                Fragment.load({
                    id:oView.getId(),
                    name: "project1.view.policyDoc",
                    controller:this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    oDialog.open();
                })
            }
            else{
                this.byId("frag1").open();
            }
        },
        closePolicyDoc: function(){
            this.byId("frag1").close();
        },
        onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();
			oSideNavigation.setExpanded(!bExpanded);
		},

        //---------------start of panel show/hide----------------------
        hideAllPanels: function () {
            var oView = this.getView();
            oView.byId("Panel1").setVisible(false);
            oView.byId("Panel2").setVisible(false);
            oView.byId("Panel3").setVisible(false);
            oView.byId("Panel4").setVisible(false);
            

            // Add more panels here if needed
        },
        onAboutPress : function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel1");
            oPanel.setVisible(true);
        },
        onListPress : function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel2");
            oPanel.setVisible(true);
        },
        onHomePress : function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel3");
            oPanel.setVisible(true);
        },
        viewOrders : function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel4");
            oPanel.setVisible(true);
        },
        //---------------end of panel show/hide----------------------
        
        //---------------start of profile dropdown fragment----------

        profile_dropdown: function () {
            var oView = this.getView(),
                oButton = oView.byId("profile_button");

            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "project1.view.profile_dropdown",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }
        },
        //---------------end of profile dropdown fragment----------
        onSearch: function (oEvent) {
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            var sOrderId = this.byId("orderIdInput").getValue();
            
            var aFilters = [];
            if (sOrderId) {
                aFilters.push(new Filter("OrderID", FilterOperator.Contains, sOrderId));
            }
            
            oBinding.filter(aFilters);
        },



    });
});
