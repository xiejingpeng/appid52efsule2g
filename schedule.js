//定时任务
var schedule = require("node-schedule");
var mysql      = require('mysql');
//每天20点执行
var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];

rule.hour = 22;

rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){

    console.log("执行任务");

});