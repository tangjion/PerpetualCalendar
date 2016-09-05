var dateObjArr = [];
var calenderHtml = function (dateObj) {

    /**
     * 日历操作头部
     */
    this.renderOpt = function(){
        var opt = '<div class="calendar_left pkg_double_month"><p class="date_text">' + dateObj.year + '年' + dateObj.month + '月</p>';
        return opt;
    }

    /**
     * 日历星期头部
     */
    this.renderHead = function(){
        var head = '<ul class="calendar_num basefix"><li class="bold">六</li><li>五</li><li>四</li><li>三</li><li>二</li><li>一</li><li class="bold">日</li></ul>';
        return head;
    }

    /**
     * 获得日历表格
     */
    this.renderContTable = function(){
        dateUtil.dateObj = dateObj;
        var days = dateUtil.getDays();
        var week = dateUtil.getWeek();
        var caleTable = '<table id="calendar_tab" class="calendar_right"><tbody>';
        var index = 0;
        for (var i = 1; i <= 42; i++) {
            if (index == 0) {
                caleTable += "<tr>";
            }
            var c = week > 0 ? week : 0;
            if ((i - 1) >= week && (i - c) <= days) {
                var price = dateUtil.getPrice((i - c));
                var priceStr = "";
                var classStyle = "class='on'";
                if (price != -1) {
                    priceStr = "<dfn>¥</dfn>" + price;
                    // classStyle = "class='on'";
                }
                if (price != -1&&dateObj.year==new Date().getFullYear()&&dateObj.month==new Date().getMonth()+1&&i-c==new Date().getDate()) {
                    classStyle = "class='on today'";
                }
                //判断今天
                if(dateObj.year==new Date().getFullYear()&&dateObj.month==new Date().getMonth()+1&&i-c==new Date().getDate()){
                    caleTable += '<td  ' + classStyle + ' date="' + dateObj.year + "-" + dateObj.month + "-" + (i - c) + '" price="' + price + '"><a><span class="date basefix">今天</span><span class="team basefix" style="display: none;">&nbsp;</span><span class="calendar_price01">' + priceStr + '</span></a></td>';
                }
                else{
                    caleTable += '<td  ' + classStyle + ' date="' + dateObj.year + "-" + dateObj.month + "-" + (i - c) + '" price="' + price + '"><a><span class="date basefix">' + (i - c) + '</span><span class="team basefix" style="display: none;">&nbsp;</span><span class="calendar_price01">' + priceStr + '</span></a></td>';
                }
                if (index == 6) {
                    caleTable += '</tr>';
                    index = -1;
                }
            }
            else {
                caleTable += "<td></td>";
                if (index == 6) {
                    caleTable += "</tr>";
                    index = -1;
                }
            }
            index++;
        }
        caleTable += "</tbody></table>";
        return caleTable;
    }
}
/**
 * 日历工具对象
 * @param dateObj
 */
var dateUtil = {

    dateObj: null,
    /**
     * 根据日期获得星期
     * @returns {number}
     */
    getWeek: function() {
        var _thisDate = new Date(dateUtil.dateObj.year, dateUtil.dateObj.month - 1, 1);
        return _thisDate.getDay();
    },

    /**
     * 获得一个月的天数
     * @returns {Date}
     */
    getDays: function() {
        var new_year = dateUtil.dateObj.year,
            new_month = dateUtil.dateObj.month,
            new_date = new Date(new_year, new_month, 1);
        var days = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate();
        return days;
    },

    getCurrent: function () {
        var dt = dateUtil.dateObj.date;
        dateUtil.dateObj.year = dt.getFullYear();
        dateUtil.dateObj.month = dt.getMonth() + 1;
        dateUtil.dateObj.day = dt.getDate();
    },

    getPrice: function(day) {
        var dt = dateUtil.dateObj.year + "-";
        if(dateUtil.dateObj.month < 10){
            dt += "0" + dateUtil.dateObj.month;
        }else{
            dt += dateUtil.dateObj.month;
        }

        if(day < 10){
            dt += "-0" + day;
        }else{
            dt += "-" + day;
        }

        for(var i = 0; i < dateUtil.dateObj.priceArr.length; i++){
            if(dateUtil.dateObj.priceArr[i].Date == dt){
                return dateUtil.dateObj.priceArr[i].Price.split('.')[0];
            }
        }
        return -1;
    },

    chooseClick: function (sender) {
        var date = sender.getAttribute("date");
        var price = sender.getAttribute("price");
        var el = document.getElementById("calendar");
        if (el != null) {
            el.value = date;
            alert("日期是："+date);
            alert("价格是：￥"+price);
            // pickerEvent.remove();
        }
    },

    remove: function () {
        var p = document.getElementsByClassName("calendar")[0];
        if (p != null) {
            document.body.removeChild(p);
        }
    },
}

var renderUtil = {

    renderView: function () {
        $('.calendar').remove();
        var html = '<div class="calendar">';
        for(var i = 0,len = dateObjArr.length; i < len; i++){
            var calenderLayout = new calenderHtml(dateObjArr[i]);
            html += '<div class="calendar_box">';
            html += calenderLayout.renderOpt();
            if(i === 0){
                html += '<a onclick="renderUtil.clickLast(dateObjArr.length)" title="上一月" id="picker_last" class="pkg_circle_top">上一月</a>';
            }
            if(i === len - 1){
                html += '<a onclick="renderUtil.clickNext(dateObjArr.length)" title="下一月" id="picker_next" class="pkg_circle_bottom ">下一月</a>';
            }
            html += '</div>';
            html += calenderLayout.renderHead();
            html += calenderLayout.renderContTable();
            html += '</div>'
        }
        html += '</div>';
        $(document.body).append(html);
        var tds = $('.calendar_right td');
        for (var i = 0; i < tds.length; i++) {
            if (tds[i].getAttribute("date") != null && tds[i].getAttribute("date") != "") {
                tds[i].onclick = function () {
                    dateUtil.chooseClick(this)
                };
            }
        }
    },
    clickNext: function (num) {
        for(var i = 0; i < num; i++){
            dateObjArr[i].month = dateObjArr[i].month + 1;
            if(dateObjArr[i].month > 12){
                dateObjArr[i].year = dateObjArr[i].year + 1;
                dateObjArr[i].month = dateObjArr[i].month - 12;

            }
        }
        this.renderView();
    },
    clickLast: function (num) {
        for(var i = 0; i < num; i++){
            dateObjArr[i].month = dateObjArr[i].month - 1;
            if(dateObjArr[i].month < 1){
                dateObjArr[i].year = dateObjArr[i].year - 1;
                dateObjArr[i].month = 12 + dateObjArr[i].month;

            }
        }
        this.renderView();
    }
}

var calendar = function () {
    /**
     * 初始化
     * @param layoutNum
     */
    this.init = function (layoutNum,data) {
        var date = new Date();
        if(!layoutNum || layoutNum === 1){
            dateObjArr.push({
                date: date,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                priceArr: data
            });
        }else{
            for(var i = 0; i < layoutNum; i++){
                var currMonth = date.getMonth() + (i + 1),
                    currYear = date.getFullYear();
                if(currMonth > 12){
                    currYear = currYear + 1;
                    currMonth = currMonth - 12;
                }
                dateObjArr.push({
                    date: date,
                    year: currYear,
                    month: currMonth,
                    priceArr: data
                });
            }
        }
        renderUtil.renderView(layoutNum);
    }
}

// $(document).bind("click", function (event) {
//     var e = event || window.event;
//     var elem = e.srcElement || e.target;
//     while (elem) {
//         if (elem.className == "calendar") {
//             return;
//         }
//         elem = elem.parentNode;
//     }
//     dateUtil.remove();
// });