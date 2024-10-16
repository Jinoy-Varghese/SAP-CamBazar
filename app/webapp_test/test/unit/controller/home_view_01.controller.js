/*global QUnit*/

sap.ui.define([
	"project1/controller/home_view_01.controller"
], function (Controller) {
	"use strict";

	QUnit.module("home_view_01 Controller");

	QUnit.test("I should test the home_view_01 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
