/* 
* @Author: Administrator
* @Date:   2016-02-15 11:10:30
* @Last Modified by:   Administrator
* @Last Modified time: 2016-02-15 11:14:06
*/

'use strict';
//用户名
var userName = "";
var realName = "";

//用户邮箱
var userEmail = "";
//用户QQ
var userQQ = "";
//用户手机号
var userPhone = "";

//验证用户邮箱格式合法性正则表达式
var userEmailReg =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

/**
 * 进入页面加载
 * [modifyInfoLoadedPanel description]
 * @return {[type]} [description]
 */
function modifyInfoLoadedPanel(){
  catchErrorFun("modifyInfoInit();");
}

/**
 * 页面离开时加载
 * [modifyInfoUnloadedPanel description]
 * @return {[type]} [description]
 */
function modifyInfoUnloadedPanel(){
	$("#prov").empty();
	$("#city").empty();
}

/**
 * 初始化
 * [modifyInfoInit description]
 * @return {[type]} [description]
 */
function modifyInfoInit(){

	if ($("#userPhoneID_").val()){
		$("#userPhoneID_").val("");
	}
	if ($("#userQQID_").val()){
		$("#userQQID_").val("");
	}
	if ($("#userEmailID_").val()){
		$("#userEmailID_").val("");
	}

	userEmail = localStorageUtils.getParam("userEmail");
	userQQ = localStorageUtils.getParam("userQQ");
	userPhone = localStorageUtils.getParam("userPhone");

	//如果有QQ，Email和电话，就不可以修改，只读
	if (userEmail){
		$("#userEmailID_").hide();
		$("#hasMyEmail").html(showEmailonPage(userEmail));
	}else {
		$("#userEmailID_").show();
		$("#hasMyEmail").text("");
	}

	if (userPhone){
		$("#userPhoneID_").hide();
		$("#hasPhone").html(userPhone.substring(3,0)+"****"+userPhone.substring(userPhone.length - 2,userPhone.length));
	}else {
		$("#userPhoneID_").show();
		$("#hasPhone").text("");
	}

	/*if (userQQ){
		$("#userQQID_").hide();
		$("#hasQQ").html(userQQ.substring(3,0)+"****"+userQQ.substring(userQQ.length - 2,userQQ.length));
	}else {
		$("#userQQID_").show();
		$("#hasQQ").text("");
	}*/

	if (userPhone && userEmail){
		$("#saveUserInfoBtn").hide();
	}else {
		$("#saveUserInfoBtn").show();
	}

	//修改按钮点击事件
    $("#saveUserInfoBtn").off('click');
	$("#saveUserInfoBtn").on('click', function() {		
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

		if($("#userEmailID_").css("display") != "none"){
			userEmail = $("#userEmailID_").val();
		}
		if($("#userPhoneID_").css("display") != "none"){
			userPhone = $("#userPhoneID_").val();
		}
		/*if($("#userQQID_").css("display") != "none"){
			userQQ = $("#userQQID_").val();
		}*/

		//验证手机必须填写
		/*if (!userPhone){
			toastUtils.showToast("请填写您的手机号码");
			return;
		}*/

		if (userPhone != "") {
			if (!/^\d{11}$/.test(userPhone)) {
				toastUtils.showToast("请输入正确的11位手机号");
				return;
			}
		}

		if ('' != userEmail) {
			if (!userEmailReg.test(userEmail)) {
				toastUtils.showToast("请输入合法的邮箱");
				return;
			}
		}

		/*if ('' != userQQ) {
			if (userQQ.length < 5 || userQQ.length > 15) {
				toastUtils.showToast("请输入正确的QQ号码");
				return;
			}
		}*/

		//用户省份
		var userProv = localStorageUtils.getParam('userProv') ? localStorageUtils.getParam('userProv') : "";
		//用户城市
		var userCity = localStorageUtils.getParam('userCity') ? localStorageUtils.getParam('userCity') : "";

 var param = '{"ProjectPublic_PlatformCode":2,"MerchantType":3,"EMail":"' + userEmail + '","QQ":"' + userQQ + '","Province":"' + userProv + '","City":"' + userCity + '","MobilePhone":"' + userPhone + '","InterfaceName":"ModifyUserInfo"}';
    ajaxUtil.ajaxByAsyncPost1(null, param, successCallBack_modifyInfo,null);
	});	
}

function successCallBack_modifyInfo(data){

		if (data.SystemState == 64) {
			if (data.ModifyComplete) {
				//更新本地字段
				// localStorageUtils.setParam("userQQ", userQQ);
				localStorageUtils.setParam("userPhone", userPhone);
				localStorageUtils.setParam("userEmail", userEmail);

				toastUtils.showToast("用户资料更新成功");
                setPanelBackPage_Fun('personalInfo');
			} else {
				toastUtils.showToast("用户资料更新失败，稍候请重试");
			}
		} else if (data.Result == "-1") {
			loginAgain();
		} else if (data.SystemState == 32) {
			toastUtils.showToast("用户资料更新失败，请检查数据");
		} else {
			toastUtils.showToast("当前网络不给力，请稍后再试");
		}
}

/**
 * input输入框验证
 * [ValidateNumber description]
 * @param {[type]} e          [description]
 * @param {[type]} pnumber    [description]
 * @param {[type]} maxFandian [description]
 */
function Validatetel(e, pnumber) {
	if (!/^\d\d*$/.test(pnumber))
	{ 
	 e.value = /^\d\d*/.exec(e.value); 
	} 
	return false; 
}

// 邮箱加密显示
function showEmailonPage(str) {
	var index = str.indexOf('@');
	if (index == 1) {
		str = "****" + str.substring(1);
	} else if (index == 2) {
		str = str.substring(0, 1) + "****" + str.substring(2);
	} else if (index >= 3) {
		str = str.substring(0, 3) + "****" + str.substring(index);
	}
	return str;
}