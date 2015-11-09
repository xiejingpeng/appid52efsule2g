/**
 * Created by xiejingpeng on 15/10/27.
 */
var x,y;

var init = function(){
    ip();
}
// 空气质量
var chart_aqi = function(aqi){
    if(!aqi)return;
    var hash={
        co:'一氧化碳',
        no2:'二氧化氮',
        o3:'臭氧',
        pm10:'PM10',
        pm25:'PM2.5',
        so2:'二氧化硫',
    }
    var name=[],val=[],j= 0,city=aqi.city;
    for(var i in city){
        if((i!=='aqi')&&(i!=='qlty')){
            name[j]=(hash[i]+'('+city[i]+')') || '0';//ug/m³
            val[j] = city[i] || '0';
            j++;
        }
    }
    var radarChartData = {
        labels : name,
        datasets : [
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data : val
            }
        ]
    }
    window.myRadar = new Chart(document.getElementById("myChart1").getContext("2d")).Radar(radarChartData, {
        responsive: true
    });
}
// 未来7天天气
var chart_daily_forecast = function(daily_forecast){
    var date=[],max=[],min=[];
    for(var i=0;i<daily_forecast.length;i++){
        date[i] = (daily_forecast[i].date).substring(5,10);//日期
        max[i] = daily_forecast[i].tmp.max;
        min[i] = daily_forecast[i].tmp.min;
    }
    var lineChartData = {
        labels : date,
        datasets : [
            {
                label: "max",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : max,
            },{
                label: "min",
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : min,
            }
        ]

    }

    var ctx = document.getElementById("myChart").getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData, {
        scaleShowGridLines : false,//去网格
        scaleLabel : "<%=value%>℃",//y轴刻度值
        multiTooltipTemplate: "<%if (label){%><%=label%>气温: <%}%><%= value %>℃",
        responsive: true
    })
}
//点击---天气查询
$(document).on('click','#city',function() {
    //base.transf('#pagetwo','flow');
    $('#input').hide();
    var parm = {city:$('[name=city]').val()};
    base.ajax("/city",parm,function (newdata) {
        var data = newdata['HeWeather data service 3.0'][0];
        var basic = data.basic;
        var daily_forecast = data.daily_forecast;
        var now = data.now;
        var aqi = data.aqi;//空气质量
        $('#city_name').text(basic.city);//城市名称
        $('#cond').text(now.cond.txt+now.tmp+'℃');//晴+温度
        $('#fl').text(now.fl);//体感温度
        $('#hum').text(now.hum);//相对湿度
        $('#pcpn').text(now.pcpn);//降水量
        $('#pres').text(now.pres);//气压
        $('#update').text((basic.update.loc).substring(10,16));//更新时间
        //$('#qlty').text(aqi.city.qlty);//空气质量类别
        $('#vis').text(now.vis);//能见度
        $('#dir').text(now.wind.dir);//风向
        $('#sc').text(now.wind.sc);//风力
        $('#spd').text(now.wind.spd);//风速
        chart_aqi(aqi);//空气质量
        chart_daily_forecast(daily_forecast);//未来7天数据图
    });
})
//跳转地图页面
$(document).on('click','#map_data',function() {
    var parm = {
        city:$('#city_name_input').val(),
        x:x,
        y:y,
    };
    base.ajax("/map_data",parm,function (newdata) {});
})
//ip查询定位--城市名称
var ip = function(){
    var parm = {};
    var url = '/ip';
    base.ajax(url,parm,function (newdata) {
        var data = newdata.retData.content;
        x = data.point.x;//经度(粗糙)12958160.97
        y = data.point.y;//纬度(粗糙)4825907.72
        var address = data.address;//地址
        $('#ip').text(address);
        var reg = new RegExp('市','g')
        $('#city_name_input').val(address.replace(reg,''));//输入框默认填充
    });
}
//地理定位函数
var local = {
    //成功
    locationSuccess: function(position){
        var coords = position.coords;
        var latlng = new google.maps.LatLng(
            // 维度
            coords.latitude,
            // 精度
            coords.longitude
        );
        var myOptions = {
            // 地图放大倍数
            zoom: 12,
            // 地图中心设为指定坐标点
            center: latlng,
            // 地图类型
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // 创建地图并输出到页面
        var myMap = new google.maps.Map(
            document.getElementById("map"),myOptions
        );
        // 创建标记
        var marker = new google.maps.Marker({
            // 标注指定的经纬度坐标点
            position: latlng,
            // 指定用于标注的地图
            map: myMap
        });
        //创建标注窗口
        var infowindow = new google.maps.InfoWindow({
            content:"您在这里<br/>纬度："+
            coords.latitude+
            "<br/>经度："+coords.longitude
        });
        //打开标注窗口
        infowindow.open(myMap,marker);
    },
    //失败
    locationError: function(error){
        switch(error.code) {
            case error.TIMEOUT:
                showError("A timeout occured! Please try again!");
                break;
            case error.POSITION_UNAVAILABLE:
                showError('We can\'t detect your location. Sorry!');
                break;
            case error.PERMISSION_DENIED:
                showError('Please allow geolocation access for this to work.');
                break;
            case error.UNKNOWN_ERROR:
                showError('An unknown error occured!');
                break;
        }
    }
}
var local_geolocation = function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(local.locationSuccess, local.locationError,{
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAcuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 5000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 3000
        });
    }else{
        console.info("浏览器不支持定位!");
    }
}

init();





