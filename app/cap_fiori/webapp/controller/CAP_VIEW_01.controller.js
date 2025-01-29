sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageToast",
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library'

],
    function (Controller, MessageBox, Fragment, JSONModel, Sorter, Filter, FilterOperator, FilterType, MessageToast, Spreadsheet, exportLibrary) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("capfiori.controller.CAP_VIEW_01", {
            onInit: function () {
                sap.ui.getCore().applyTheme("sap_horizon");
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
                MessageBox.success("Username : " + username + " \nPassword : " + password);
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
            logout: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                MessageBox.confirm("Are you sure, you want to logout?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            sessionStorage.removeItem("loggedIn");
                            oRouter.navTo("RouteCAP_VIEW_01");
                        }
                    }
                });
            },
            //---------------end of login/logout----------------------
            openPolicyDoc: function () {
                var oView = this.getView();
                if (!this.byId("frag1")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "capfiori.view.policyDoc",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    })
                }
                else {
                    this.byId("frag1").open();
                }
            },
            closePolicyDoc: function () {
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
                oView.byId("Panel6").setVisible(false);
                oView.byId("Panel7").setVisible(false);
                oView.byId("Panel8").setVisible(false);
                oView.byId("Panel9").setVisible(false);
                oView.byId("Panel10").setVisible(false);

                // Add more panels here if needed
            },
            onAboutPress: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel1");
                oPanel.setVisible(true);
            },
            onListPress: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel2");
                oPanel.setVisible(true);
                this.onRefresh('SalesTable');
            },
            onHomePress: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel3");
                oPanel.setVisible(true);
            },
            viewOrders: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel4");
                oPanel.setVisible(true);
                this.onRefresh('ordersTable');
            },
            add_item: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel5");
                oPanel.setVisible(true);
            },
            update_item: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel6");
                oPanel.setVisible(true);
            },
            purchaseList: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel7");
                oPanel.setVisible(true);
                this.onRefresh('purchaseTable');
            },
            stockListView: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel9");
                oPanel.setVisible(true);
            },
            products: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel10");
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
                    }).then(function (oMenu) {
                        oMenu.openBy(oButton);
                        this._oMenuFragment = oMenu;
                        return this._oMenuFragment;
                    }.bind(this));
                } else {
                    this._oMenuFragment.openBy(oButton);
                }
            },
            //---------------end of profile dropdown fragment----------
            //--------------- smart table operations-------------------

            onRefresh: function (tableName = '') {
                if (tableName != '') {
                    var oBinding = this.byId(tableName).getBinding("items");
                }
                else {
                    var oBinding = this.byId("ordersTable").getBinding("items");
                }

                if (oBinding.hasPendingChanges()) {
                    MessageBox.error("Before refreshing, please save or revert your changes");
                    return;
                }
                oBinding.refresh();
                MessageToast.show("Data Refreshed");
            },
            onSearchLead: function () {
                var oView = this.getView(),
                    sValue = oView.byId("searchField").getValue();
                var oStatusFilter = new Filter("status", FilterOperator.EQ, "L");
                if (sValue) {
                    var oFilter = new Filter("title", FilterOperator.Contains, sValue);
                    var oCombinedFilter = new Filter({
                        filters: [oFilter, oStatusFilter],
                        and: true
                    });
                    oView.byId("ordersTable").getBinding("items").filter(oCombinedFilter, FilterType.Application);
                } else {
                    oView.byId("ordersTable").getBinding("items").filter(oStatusFilter, FilterType.Application);
                }
            },
            onSearchPurchase: function () {
                var oView = this.getView(),
                    sValue = oView.byId("searchFieldPurchase").getValue();
                var oStatusFilter = new Filter("status", FilterOperator.EQ, "P");
                if (sValue) {
                    var oFilter = new Filter("title", FilterOperator.Contains, sValue);
                    var oCombinedFilter = new Filter({
                        filters: [oFilter, oStatusFilter],
                        and: true
                    });
                    oView.byId("purchaseTable").getBinding("items").filter(oCombinedFilter, FilterType.Application);
                } else {
                    oView.byId("purchaseTable").getBinding("items").filter(oStatusFilter, FilterType.Application);
                }
            },
            onSearchSales: function () {
                var oView = this.getView(), sValue = oView.byId("searchFieldSales").getValue();
                if (sValue) { var oFilter = new Filter("item_id", FilterOperator.Contains, sValue); oView.byId("SalesTable").getBinding("items").filter(oFilter, FilterType.Application); } else { oView.byId("SalesTable").getBinding("items").filter([]); }
            },
            createColumnConfig: function() {
                var aCols = [];
                aCols.push({ label: 'Id', property: 'ID', type: EdmType.String, template: '{0}' });
                aCols.push({ label: 'Item Name', property: 'title', type: EdmType.String });
                aCols.push({ label: 'Sales Price', property: 'author_ID', type: EdmType.Number, scale: 2, delimiter: true });
                aCols.push({ label: 'Warrenty', property: 'stock', type: EdmType.Number, scale: 0 });
                return aCols;
            },
            onExport: function() { var aCols, oRowBinding, oSettings, oSheet, oTable; if (!this._oTable) { this._oTable = this.byId('ordersTable'); } oTable = this._oTable; oRowBinding = oTable.getBinding('items'); console.log("Row Binding Data:", oRowBinding); if (!oRowBinding) { MessageBox.error("No data available for export."); return; } var aData = oRowBinding.getContexts().map(context => context.getObject()); console.log("Data to be exported:", aData); if (aData.length === 0) { MessageBox.error("No data available for export."); return; } aCols = this.createColumnConfig(); oSettings = { workbook: { columns: aCols, hierarchyLevel: 'Level' }, dataSource: aData, fileName: 'Table export sample.xlsx', worker: false  }; oSheet = new Spreadsheet(oSettings); oSheet.build().finally(function() { oSheet.destroy(); }); }

            //----------end of smart table operations-----------
            //----------CRUD operations-----------

            ,add_item_data: function () {
                var cam_code = this.getView().byId("cam_code").getValue();
                var item_name = this.getView().byId("item_name").getValue();
                var stock = this.getView().byId("stock").getValue();
                var Item_Price = this.getView().byId("Item_Price").getValue();
                var oFileUploader = this.getView().byId("fileUploader");
                console.log("FileUploader:", oFileUploader);

                // Access the file input element directly
                var oFileInput = oFileUploader.getDomRef().querySelector("input[type='file']");
                var oFile = oFileInput.files;
                console.log("Selected files:", oFile);
                if (!oFile || oFile.length === 0) {
                    MessageBox.error("Please select a file to upload.");
                    return;
                }

                // Create a new FormData object to handle the file upload
                var formData = new FormData();
                formData.append("file", oFile[0]);

                // Perform the file upload using CAPM
                fetch("/upload", { // Adjust the URL to your CAPM endpoint
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("File uploaded successfully:", data);

                        // Get the OData model
                        var oModel = this.getView().getModel();

                        // Proceed with creating the OData entry
                        var oContext = oModel.bindList("/Books").create({
                            "ID": cam_code,
                            "title": item_name,
                            "author_ID": Item_Price,
                            "stock": stock,
                            "attachments": [{
                                "file_url": data.file_url // Use the file URL returned by the backend
                            }],
                            "status": "L",
                            "active_status": "Y"
                        });
                        oContext.created().then(() => {
                            MessageBox.success("Product Added Successfully");
                            this.getView().byId("cam_code").setValue(null);
                            this.getView().byId("item_name").setValue(null);
                            this.getView().byId("stock").setValue(null);
                            this.getView().byId("Item_Price").setValue(null);
                            oFileUploader.clear(); // Clear the file uploader
                        }).catch((err) => {
                            console.error("Error adding Item: ", err);
                            MessageBox.error("An error occurred while adding the Item. Please try again.");
                        });
                    })
                    .catch(err => {
                        console.error("Error uploading file:", err);
                        MessageBox.error("An error occurred while uploading the file. Please try again.");
                    });
            },

            onActionPress: function (oEvent, menuName) {
                // Get the context of the pressed button
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext();
                this._oSelectedContext = oContext; // Store the context for later use

                // Load the ActionSheet fragment if not already loaded
                if (!this._oActionSheet) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "capfiori.view.ActionSheet",
                        controller: this
                    }).then(function (oActionSheet) {
                        this._oActionSheet = oActionSheet;
                        this.getView().addDependent(this._oActionSheet);
                        this._oActionSheet.openBy(oButton);
                        if (menuName === "Purchased") {
                            this.getView().byId('sendTo').setVisible(false);
                            this.getView().byId('addToCart').setVisible(true);
                            this.getView().byId('Invoice').setVisible(false);
                        } else if (menuName === "Leads") {
                            this.getView().byId('sendTo').setVisible(true);
                            this.getView().byId('addToCart').setVisible(false);
                            this.getView().byId('Invoice').setVisible(false);
                        }
                        else if (menuName === "orderList") {
                            this.getView().byId('sendTo').setVisible(false);
                            this.getView().byId('addToCart').setVisible(false);
                            this.getView().byId('Invoice').setVisible(true);
                        }
                    }.bind(this));
                } else {
                    this._oActionSheet.openBy(oButton);
                    if (menuName === "Purchased") {
                        this.getView().byId('sendTo').setVisible(false);
                        this.getView().byId('addToCart').setVisible(true);
                    } else if (menuName === "Leads") {
                        this.getView().byId('sendTo').setVisible(true);
                        this.getView().byId('addToCart').setVisible(false);
                    } else if (menuName === "orderList") {
                        this.getView().byId('sendTo').setVisible(false);
                        this.getView().byId('addToCart').setVisible(false);
                        this.getView().byId('Invoice').setVisible(true);
                    }
                }
            },
            formatter: { 
                getColorScheme: function(status) 
                { alert(status);
                    if (status === 'L') { 
                        return 1; 
                    } 
                    else if (status === 'P') { 
                        return 6;  
                    } 
                    return 5; 
                    } 
                },
            formatFileName: function (fileUrl) {
                console.log("Attachments:", fileUrl); // Debug statement
                if (Array.isArray(fileUrl) && fileUrl.length > 0) {
                    var file = fileUrl[0]; // Access the first element of the array
                    console.log("file properties:", Object.keys(file)); // Log the properties of the file object
                    if (file.file_url) {
                        return "../../uploads/" + file.file_url.split('/').pop();
                    }
                }
                return "no image link";
            },
            stockFormatFileName: function (file_url) {
                console.log("Attachments:", file_url); // Debug statement
                if (file_url) {
                    // Extract the file name from the file_url
                    var fileName = file_url.split('/').pop();
                    // Prepend the desired URL path
                    var formattedUrl = "../../uploads/" + fileName;
                    console.log("Formatted URL:", formattedUrl); // Log the formatted URL
                    return formattedUrl;
                }
                return "no image link";
            },
            
            
            onViewPress: function () {
                var oView = this.getView();
                if (!this.byId("viewPopup")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "capfiori.view.viewItem",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.setBindingContext(this._oSelectedContext); //to send all data related to the id to the fragment.
                        oDialog.open();
                    }.bind(this));
                }
                else {
                    var oDialog = this.byId("viewPopup");
                    oDialog.setBindingContext(this._oSelectedContext); //to send all data related to the id to the fragment.
                    oDialog.open();
                }
            },
            closeViewPopup: function () {
                this.byId("viewPopup").close();
            },
            onEditPress: function () {
                var oData = this._oSelectedContext.getObject();
                MessageToast.show("Edit action for Item ID: " + oData.ID);
                this.update_item();
                var product_model = this.getOwnerComponent().getModel();
                let aFilters = [
                    new Filter("ID", FilterOperator.EQ, oData.ID)
                ];
                let oBinding = product_model.bindList("/Books");
                oBinding.filter(aFilters);

                oBinding.requestContexts().then((aContexts) => {
                    if (aContexts.length > 0) {
                        aContexts.forEach((oContext) => {
                            let oUser = oContext.getObject();
                            console.log("Cam Found in DB:", oUser);
                            this.getView().byId("update_cam_code").setValue(oUser.ID);
                            this.getView().byId("update_item_name").setValue(oUser.title);
                            this.getView().byId("update_stock").setValue(oUser.stock);
                            this.getView().byId("update_Item_Price").setValue(oUser.author_ID);
                        });

                    } else {
                        MessageBox.error("Invalid ID");
                    }
                }).catch((err) => {
                    console.error("Error fetching data: ", err);
                    MessageBox.error("An error occurred while fetching data. Please try again.");
                });
            },
            onDeletePress: function () {
                var oContext = this._oSelectedContext;
                var sBookId = oContext.getProperty("ID");
                MessageBox.confirm("Are you sure you want to delete Item ID: " + sBookId + "?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oContext.delete("$direct").then(function () {
                                MessageToast.show("Book ID: " + sBookId + " deleted.");
                            }).catch(function (oError) {
                                MessageBox.alert("Could not delete Item: " + oError.message, {
                                    icon: MessageBox.Icon.ERROR,
                                    title: "Error"
                                });
                            });
                        }
                    }
                });
            },
            update_item_data: function () {
                var cam_code = this.getView().byId("update_cam_code").getValue();
                var item_name = this.getView().byId("update_item_name").getValue();
                var stock = this.getView().byId("update_stock").getValue();
                var Item_Price = this.getView().byId("update_Item_Price").getValue();

                var update_oModel = this.getView().getModel();
                var sPath = "/Books('" + cam_code + "')";
                var oContext = update_oModel.bindContext(sPath).getBoundContext();

                // Lock UI until submitBatch is resolved
                var oView = this.getView();
                function resetBusy() {
                    oView.setBusy(false);
                }
                oView.setBusy(true);

                // Update the properties of the entity
                oContext.setProperty("title", item_name);
                oContext.setProperty("author_ID", Item_Price);
                oContext.setProperty("stock", stock);

                // Submit the changes to the server
                update_oModel.submitBatch("auto").then(function () {
                    resetBusy();
                    MessageBox.success("Camera Details Successfully updated");
                }).catch(function (err) {
                    resetBusy();
                    console.error("Error updating Camera: ", err);
                    MessageBox.error("An error occurred while updating the Item. Please try again.");
                });
            },
            sendTo: function () {
                var oContext = this._oSelectedContext;
                var cam_code = oContext.getProperty("ID");

                MessageBox.confirm("Are you sure you want to send " + cam_code + " to Sales ?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: (oAction) => {
                        if (oAction === MessageBox.Action.YES) {

                            var update_oModel = this.getView().getModel();
                            var sPath = "/Books('" + cam_code + "')";
                            var oContext = update_oModel.bindContext(sPath).getBoundContext();

                            // Lock UI until submitBatch is resolved
                            var oView = this.getView();
                            function resetBusy() {
                                oView.setBusy(false);
                            }
                            oView.setBusy(true);

                            oContext.setProperty("status", "P");

                            update_oModel.submitBatch("auto").then(function () {
                                resetBusy();
                                MessageBox.success("Lead Confirmed");
                                this.onRefresh('ordersTable');
                            }).catch(function (err) {
                                resetBusy();
                                console.error("Error updating Camera: ", err);
                                MessageBox.error("An error occurred while updating the Item. Please try again.");
                            });
                        }
                    }
                });
            },
            //----------end of CRUD operations-----------
            //----------start of Cart operations-----------
            myCart: function () {
                this.hideAllPanels();
                var oPanel = this.byId("Panel8");
                oPanel.setVisible(true);
                var cart = JSON.parse(localStorage.getItem("cart")) || [];
                var totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);
                var oCartModel = new sap.ui.model.json.JSONModel({ cart: cart, totalPrice: totalPrice });
                this.getView().setModel(oCartModel, "cartModel");

                // Bind the cart data to the list
                var oList = this.byId("cartList");
                oList.setModel(oCartModel);
                oList.bindItems({
                    path: "cartModel>/cart",
                    template: new sap.m.ObjectListItem({
                        title: "{cartModel>name}",
                        number: "₹{cartModel>price}",
                        attributes: [
                            new sap.m.ObjectAttribute({ text: "{cartModel>description}" })
                        ]
                    })
                });

                if (cart.length == 0) {
                    this.byId("emptyCartIcon").setVisible(true);
                    this.byId("nonEmptyCart").setVisible(false);
                }
                else {
                    this.byId("nonEmptyCart").setVisible(true);
                    this.byId("emptyCartIcon").setVisible(false);

                }
                // Update the total price
                this.byId("totalPrice").setText("₹" + totalPrice);
            },
            addToCart: function () {
                var oContext = this._oSelectedContext;

                var itemId = oContext.getProperty("ID");
                var itemName = oContext.getProperty("title");
                var itemDescription = oContext.getProperty("stock");
                var itemPrice = oContext.getProperty("author_ID");

                var cart = JSON.parse(localStorage.getItem("cart")) || [];
                var itemExists = cart.some(item => item.id === itemId);
                if (!itemExists) {
                    cart.push({ id: itemId, name: itemName, description: itemDescription, price: itemPrice });
                    localStorage.setItem("cart", JSON.stringify(cart));
                    MessageToast.show("Item added to cart");
                } else {
                    MessageToast.show("Item is already in the cart");
                }
                var cartIds = cart.map(item => item.id);
                console.log("Cart IDs:", cartIds);
            },
            clearCart: function () {
                localStorage.removeItem("cart");
                this.myCart();
                MessageToast.show("Cart has been cleared");
            },
            placeOrder: function () {
                var cart = JSON.parse(localStorage.getItem("cart")) || [];
                if (cart.length === 0) {
                    MessageToast.show("Your cart is empty.");
                    return;
                }
                var oModel = this.getView().getModel();

                // Create a batch group ID
                var sBatchGroupId = "orderBatch";
                // Create a batch request to save all items in the cart to the Sales entity
                cart.forEach(item => {
                    var saleTime = new Date().toISOString().split('.')[0] + 'Z'; // Format the date correctly
                    var oContext = oModel.bindList("/sales").create({
                        "item_id": item.id,
                        "sold_by": 1,
                        "sale_time": saleTime
                    }, {
                        groupId: sBatchGroupId
                    });

                    oContext.created().then(() => {
                    }).catch(oError => {
                        console.error("Error creating sales entry: ", oError);
                    });
                });

                // Submit the batch request
                oModel.submitBatch(sBatchGroupId).then(() => {
                    localStorage.removeItem("cart");
                    this.myCart();
                    // MessageBox.success("Order has been placed successfully.");
                }).catch(oError => {
                    console.error("Error placing order: ", oError);
                    MessageBox.error("An error occurred while placing the order. Please try again.");
                });
                this.updateActiveStatus(cart.map(item => item.id));
            },
            updateActiveStatus: function (bookIds) {
                var oModel = this.getView().getModel();
                var sBatchGroupId = "updateBatch";
                var aPromises = [];
            
                bookIds.forEach(bookId => {
                    var sPath = "/Books('" + bookId + "')";
                    var oContext = oModel.bindContext(sPath).getBoundContext();
            
                    var oPromise = oContext.requestObject().then(function (oData) {
                        var currentStock = oData.stock;
                        console.log("currentStock"+currentStock)
                        if (currentStock !== null && currentStock !== undefined) {
                            var newStock = currentStock - 1;
                            var updateData = {
                                stock: newStock
                            };
                            if (newStock === 0) {
                                updateData.active_status = 'N';
                            }
                            return oContext.setProperty("stock", newStock).then(function () {
                                if (newStock === 0) {
                                    return oContext.setProperty("active_status", 'N');
                                }
                            });
                        } else {
                            console.error("Error: Invalid stock value for Item ID: ", bookId);
                        }
                    }).catch(function (oError) {
                        console.error("Error reading book data for Item ID: ", bookId, oError);
                    });
                    aPromises.push(oPromise);
                });
            
                Promise.all(aPromises).then(() => {
                    oModel.submitBatch(sBatchGroupId).then(() => {
                        MessageBox.success("Order has been placed successfully.");
                    }).catch(err => {
                        console.error("Error submitting batch update: ", err);
                    });
                }).catch(err => {
                    console.error("Error updating stock and status: ", err);
                });
            },
            //---------- Start of theme operations -----------
            onToggleTheme: function(oEvent) {
                var oMenuItem = oEvent.getSource(); 
                var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme(); 
                console.log(sCurrentTheme);
                if (sCurrentTheme === "sap_horizon") { 
                    sap.ui.getCore().applyTheme("sap_horizon_dark"); 
                    oMenuItem.setText("Light Mode");
                    oMenuItem.setIcon("sap-icon://light-mode"); 
                } 
                else { 
                    sap.ui.getCore().applyTheme("sap_horizon"); 
                    oMenuItem.setText("Dark Mode"); 
                    oMenuItem.setIcon("sap-icon://dark-mode");
                } 
            },
            //---------- End of theme operations -----------
            





        });
    });

