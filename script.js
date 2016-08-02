function showCalendar(date) {
    curDate = date;

    updateMonthSelector(date);
    updateDateSelector(date);
}

function startUp() {
    showCalendar(new Date(now.getTime()));
    showReportContent(new Date(now.getTime()));
    document.getElementById('weekreportbotton').addEventListener('click', generateWeekReport);
}

function updateMonthSelector(date) {
    var theMonth = document.getElementById("theMonth");
    theMonth.innerHTML = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";

    var img1 = document.querySelector('.month-chooser > img:first-child');
    var img2 = document.querySelector('.month-chooser > img:nth-child(2)');
    img1.addEventListener('click', preMonth);
    img2.addEventListener('click', nextMonth);
    if ((date.getFullYear() == now.getFullYear()) && (date.getMonth() == now.getMonth())) {
        if (!img2.classList.contains("month-disabled")) {
            img2.classList.add("month-disabled");
        }
        img2.removeEventListener('click', nextMonth);
    } else {
        if (img2.classList.contains("month-disabled")) {
            img2.classList.remove("month-disabled");
        }
    }
}

function updateDateSelector(date) {
    var dayCount = getMonthDayCount(date.getFullYear(), date.getMonth());
    var lastMonthDayCount = getMonthDayCount(date.getFullYear(), date.getMonth() - 1);

    var firstWeekDay = getFirstWeekDay(date);
    (firstWeekDay == 0) && (firstWeekDay = 7);

    var calendar = document.getElementById("calendar");
    calendar.addEventListener('click', calendarOnClickHandler);

    var tds = document.querySelectorAll("#calendar td");
    for (var i = firstWeekDay - 1; i >= 0; i--, lastMonthDayCount--) {
        tds[i].innerHTML = '';
        tds[i].dateTime = null;
        tds[i].className = "";
        tds[i].className = "date-empty";
    }

    for (var i = firstWeekDay, j = 1; i < dayCount + firstWeekDay; i++, j++) {
        tds[i].innerHTML = j;
        tds[i].dateTime = new Date(date.getFullYear(), date.getMonth(), j);
        if (formatDate(tds[i].dateTime) == formatDate(now)) {
            tds[i].className = "date-activate";
        } else if (formatDate(tds[i].dateTime) > formatDate(now)) {
            tds[i].className = "date-disabled";
        } else {
            tds[i].className = "";
        }
        if (j == 1) {
            if ((date.getFullYear() < now.getFullYear()) || (date.getMonth() < now.getMonth())) {
                tds[i].className = "date-activate";
            }
        }
    }

    for (j = 1; i < tds.length; i++, j++) {
        tds[i].innerHTML = "&nbsp;";
        tds[i].dateTime = null;
        tds[i].className = "";
    }
}

function formatDate(d) {
    return d.getFullYear() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate());
}

function formatNumber(num) {
    return num < 10 ? ('0' + num) : ('' + num);
}

function calendarOnClickHandler(e) {
    if ((e.target.dateTime) && (e.target.className != "date-disabled")) {
        var arr = document.getElementsByClassName("date-activate");
        for (var index in arr) {
            arr[index].className = '';
        }

        showReportContent(e.target.dateTime);
        e.target.className = "date-activate";

    }
}

function getMonthDayCount(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function showReportContent(date) {
    document.querySelector(".report-header-title").innerHTML = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "日报";
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    for (var i = 0; i < obj.dailyreportcontents.length; i++) {
        if (obj.dailyreportcontents[i].date == str) {
            var dailyreportcontent = obj.dailyreportcontents[i];
            break;
        }
    }
    var status = 0;
    var reportcontent = "";
    if (dailyreportcontent) {
        var len = dailyreportcontent.tasklist.length
        for (i = 0; i < len; i++) {
            if (dailyreportcontent.tasklist[i].status == 1) {
                status++;
                reportcontent += "<div class='report-item done'>" + dailyreportcontent.tasklist[i].task + "</div>";
            } else {
                reportcontent += "<div class='report-item todo'>" + dailyreportcontent.tasklist[i].task + "</div>";
            }
        }
        document.querySelector(".report-content").innerHTML = reportcontent;
        status = status / len * 5;
    } else {
        document.querySelector(".report-content").innerHTML = '<div class="nothing"><img style ="width:474px; height:230px;" src="images/nothing.png" /></div>';
    }


    var statusStr = "完成度：";
    for (i = 0; status >= 1; status--, i++) {
        statusStr += '<img src="images/icon-star-activate.png" />';
    }
    if (status > 0) {
        statusStr += '<img src="images/icon-star-half.png" />';
        i++;
    }
    for (; i < 5; i++) {
        statusStr += '<img src="images/icon-star.png" />';
    }
    document.querySelector(".report-header-status").innerHTML = statusStr;
    // resize();
}

function preMonth() {
    curDate.setMonth(curDate.getMonth() - 1);
    curDate.setDate(1);
    showCalendar(curDate);
    showReportContent(document.querySelector(".date-activate").dateTime);
}

function nextMonth() {
    curDate.setMonth(curDate.getMonth() + 1);
    curDate.setDate(1);
    showCalendar(curDate);
    showReportContent(document.querySelector(".date-activate").dateTime);
}

function generateWeekReport() {

    var date = document.querySelector(".date-activate").dateTime;
    var saturday = new Date(date);
    if (date.getDay() == 0) {
        saturday.setDate(saturday.getDate() - 1);
    } else {
        saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
    }

    var todoList = [],
        doneList = [];
    for (var i = 1; i <= 5; i++) {
        var oneday = new Date(saturday);
        oneday.setDate(saturday.getDate() - i);
        onedayStr = oneday.getFullYear() + 　"-"　 + (oneday.getMonth() + 1) + "-"　 + oneday.getDate();
        var dailyreportcontent = "";
        for (var j = 0; j < obj.dailyreportcontents.length; j++) {
            if (obj.dailyreportcontents[j].date == onedayStr) {
                dailyreportcontent = obj.dailyreportcontents[j];
                break;
            }
        }
        if (dailyreportcontent) {
            for (var index in dailyreportcontent.tasklist) {
                if (!dailyreportcontent.tasklist[index].status) {
                    if (todoList.indexOf(dailyreportcontent.tasklist[index].task) == -1) {
                        todoList.push(dailyreportcontent.tasklist[index].task);
                    }
                    for (var index2 in doneList) {
                        if (dailyreportcontent.tasklist[index].task == doneList[index2]) {
                            doneList.splice(index2, 1);
                        }
                    }
                } else {
                    if (doneList.indexOf(dailyreportcontent.tasklist[index].task) == -1) {
                        doneList.push(dailyreportcontent.tasklist[index].task);
                    }
                    for (var index3 in todoList) {
                        if (dailyreportcontent.tasklist[index].task == todoList[index3]) {
                            todoList.splice(index3, 1);
                        }
                    }
                }
            }
        }
    }
    var headerStr = "",
        workStr = "",
        planStr = "";
    headerStr = oneday.getFullYear() + 　"/"　 + (oneday.getMonth() + 1) + "/"　 + oneday.getDate() + "-" + saturday.getFullYear() + 　"/"　 + (saturday.getMonth() + 1) + "/" + saturday.getDate() + "周报";
    for (i = doneList.length - 1; i >= 0; i--) {
        workStr += "<li>" + doneList[i] + "</li>";
    }
    for (i = todoList.length - 1; i >= 0; i--) {
        planStr += "<li>" + todoList[i] + "</li>";
    }

    document.querySelector('#weekreport .header h4').innerHTML = headerStr;
    if (workStr) {
        document.querySelector('#work ol').innerHTML = workStr;
    } else {
        document.querySelector('#work ol').innerHTML = "";
    }
    if (planStr) {
        document.querySelector('#plan ol').innerHTML = planStr;
    } else {
        document.querySelector('#plan ol').innerHTML = "";
    }
    document.querySelector('#closebotton').addEventListener('click', close);
    var weekreport = document.getElementById('weekreport');
    if (document.body.scrollTop > 0) {
        weekreport.style.top = (document.body.clientHeight - weekreport.clientHeight) / 2 + document.body.scrollTop + "px";
    } else {

        weekreport.style.top = (document.body.clientHeight - weekreport.clientHeight) / 2 + "px";
    }
    weekreport.style.left = (document.body.clientWidth - weekreport.clientWidth) / 2 + "px";

    document.getElementById('shadow').style.display = "block";
    document.getElementById('weekreport').style.display = "block";
}

function close() {
    document.getElementById('shadow').style.display = "none";
    document.getElementById('weekreport').style.display = "none";
}
var curDate;
var now = new Date();
var obj;

function loadJsonData() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            obj = JSON.parse(xmlhttp.responseText);
            startUp();
            resize();
        }
    }
    xmlhttp.open("GET", "DailyReportContent.json", true);
    xmlhttp.send();
}
loadJsonData();

function resize() {
    var wrapHeight = document.getElementById("wrap").scrollHeight;
    var footer = document.getElementById("footer")
    var allHeight = document.documentElement.clientHeight;
    if (wrapHeight < allHeight) {
        footer.style.position = "absolute";
        footer.style.bottom = "0"
    } else {
        footer.style.position = "";
        footer.style.bottom = "";
    }
}
// window.onload = resize;
window.onresize = resize;
