sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
],
function (Controller,MessageBox,Fragment,JSONModel,Sorter,Filter,FilterOperator,FilterType) {
    "use strict";

    return Controller.extend("capfiori.controller.CAP_VIEW_01", {
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

        //Username : jinoy
        //Password : jinoy123

        onNavigateToList: function () {
            let username = this.getView().byId("input0").getValue();
            let password = this.getView().byId("input1").getValue();
        
            if (username === '' || password === '') {
                MessageBox.error("Invalid Username/Password");
            } else {


                var oModel2 = this.getOwnerComponent().getModel();
                let aFilters = [
                    new Filter("username", FilterOperator.EQ, username),
                    new Filter("password", FilterOperator.EQ, password)
                ];
                let oBinding = oModel2.bindList("/users");
                oBinding.filter(aFilters);

                oBinding.requestContexts().then((aContexts) => {
                    if (aContexts.length > 0) {
                        aContexts.forEach((oContext) => {
                            let oUser = oContext.getObject();
                            console.log("User found:", oUser);
                            // alert("Welcome, " + oUser.name);
                        });
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
                }).catch((err) => {
                    console.error("Error fetching data: ", err);
                    MessageBox.error("An error occurred while fetching data. Please try again.");
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
                        oRouter.navTo("RouteCAP_VIEW_01");
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
                    name: "capfiori.view.policyDoc",
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
            oView.byId("Panel5").setVisible(false);
            

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
        add_item : function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel5");
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
                    name: "capfiori.view.profile_dropdown",
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

        //----------smart table operations-----------
        onRefresh : function () {
			var oBinding = this.byId("ordersTable").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("Before refreshing, please save or revert your changes");
				return;
			}
			oBinding.refresh();
			MessageBox.show("Data Refreshed");
		},
        onSearch: function () {
            var oView = this.getView(),
                sValue = oView.byId("searchField").getValue();
        
            if (sValue) {
                var oFilter = new Filter("title", FilterOperator.Contains, sValue);
                oView.byId("ordersTable").getBinding("items").filter(oFilter, FilterType.Application);
            } else {
                oView.byId("ordersTable").getBinding("items").filter([]);
            }
        },
        //----------end of smart table operations-----------
        add_item_data: function() {
            var cam_code = this.getView().byId("cam_code").getValue();
            var item_name = this.getView().byId("item_name").getValue();
            var stock = this.getView().byId("stock").getValue();
            var Item_Price = this.getView().byId("Item_Price").getValue();

            // Get the OData model
            var oModel = this.getView().getModel();

            var oContext = oModel.bindList("/Books").create({
                "ID" : cam_code,
                "title" : item_name,
                "author_ID" : Item_Price,
                "stock" : stock
            });
            oContext.created().then(function () {
                alert("sales order successfully created");
            }).catch(function(err) {
                console.error("Error creating book: ", err);
                MessageBox.error("An error occurred while creating the book. Please try again.");
            });
        }

    });
});
