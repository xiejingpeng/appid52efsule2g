var base= {
    transf : function (page,action){
        $.mobile.changePage(page,{ transition: action });
    },
    ajax : function(url,data,callback){
        $.ajax({
            url : url,
            data :data,
            type : 'get',
            dataType: "json",
            //beforeSend: function(request) {
            //    request.setRequestHeader("apikey", 'bb38cc59dc943c0d474fd8df6c423a3f');
            //},
            success : function(data){
                callback(data);
            }
        })
    }
}