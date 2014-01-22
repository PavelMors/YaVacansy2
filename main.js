$(function(){

    var inputText = $(".input_area input[type='text']"),
        tabs =  $(".tablinks > li"),
        firstdate = new Date(),
        numTabs = tabs.length,
        main;

    main = function() {
        var arrTabDate = [],
            arrComands = [],
            activeCmd,
            numTab,
            counter,
            i;

        numTab = (localStorage.length > 0) ? localStorage.getItem('num') : 0;
        $("#tab" + numTab).addClass("active");

        for (i = 0; i < numTabs; i++){
            arrTabDate[i] = 0;
        }

        counter = function addDate(){
            var chengedate,
                olddate = firstdate,
                now;

            return function(numTab){
                now = new Date();
                chengedate = Math.floor((now - olddate));
                olddate = now;
                (arrTabDate[numTab]) ? arrTabDate[numTab] += chengedate : arrTabDate[numTab] = chengedate;            /*---------------ll*/

                return arrTabDate;
            };
        }();

        return {
            changeTab: function(nexttab){
                tabs.removeClass("active");
                $("#tab"+nexttab).addClass("active");
                localStorage.setItem('num', nexttab);
                console.log(localStorage);

                if(numTab !== nexttab){
                    counter(numTab);
                    numTab = nexttab;
                }
    },
            addLog: function(text){
                $(".log_area").append(text);
            },
            run: function(){
                var commandText = inputText.val(),
                    arg,
                    funcArg,
                    funcName;

                if (commandText !== ''){

                    counter(tabs.index($(".tablinks > li.active")));

                    try{
                        arg = commandText.match(/\([\w,?]*\)/)[0];
                        (arg)&&(arg = arg.slice(1, arg.length-1));
                        funcArg = arg.split(',');
                        funcName = commandText.match(/\w+\(/)[0];
                        (funcName)&&(funcName=funcName.slice(0,funcName.length-1));

                        commands[funcName].apply(null,funcArg);
                    }catch (e){
                        main.addLog("Такой команды не существует"+"<br>");
                    }

                    (arrComands.length < 10) ? arrComands.push(commandText) :
                        (arrComands.shift() && arrComands.push(commandText));  /*------save comand -------*/
                    activeCmd = arrComands.length;
                    inputText.val('')
                }
            },
            input_up: function(){
                if (activeCmd < arrComands.length){
                    activeCmd++;
                    inputText.val(arrComands[activeCmd])}
            },
            input_down: function (){
                if (activeCmd > 0){
                    activeCmd--;
                    inputText.val(arrComands[activeCmd])}
            },
            arrDate: arrTabDate

        }
    }();

    var commands = {
        selectTab: function(tabIndex){
            if ((tabIndex >= 0) && (tabIndex < numTabs)) {
                main.changeTab(tabIndex);
                main.addLog("selectTab(" + tabIndex + ")<br>" +
                    "Выбран таб №" + tabIndex + " '" + $("#tab" + (tabIndex) + " a").html() + "'<br>");
            } else {
                 main.addLog("selectTab("+tabIndex+")<br>" +
                    "Не удалось выбрать таб №" + tabIndex + ". Доступны табы с 0 по " + (numTabs - 1) + ".<br>");
            }
        },

        swapTabs: function(tabIndex1, tabIndex2){
            var tab1 = $("#tab" + (tabIndex1)),
                tab2 = $("#tab" + (tabIndex2)),
                tab3 = tab1.next(),
                tab1name = $("#tab" + tabIndex1 + " a").html(),
                tab2name = $("#tab" + tabIndex2 + " a").html();

            if ((tabIndex1 >= 0 && tab1.length > 0) && (tabIndex2 >= 0 && tab2.length > 0)){
                tab1.insertAfter(tab2);
                tab2.insertBefore(tab3);

                main.addLog("swapTabs(" + tabIndex1 + "," + tabIndex2 + ")<br>" +
                    "Поменяли табы №" + tabIndex1 + " '" + tab1name + "'' и №" + tabIndex2 + " '" + tab2name + "' местами.<br>");
            } else {
                main.addLog("swapTabs(" + tabIndex1 + "," + tabIndex2 + ")<br>" +
                    "Ошибка в номере таба.Доступны табы с 0 по" + (numTabs - 1) + ".<br>");
            }
        },

        showStat: function(){
            var delta_time = new Date() - firstdate,
                minutes_all = Math.floor((delta_time) / 60000),
                minutes,
                isMinutes,
                i,
                mainArrLength = main.arrDate.length;

            (minutes_all < 1) ? (minutes_all = '') : minutes_all += " минут ";

            main.addLog("Общее время работы со страницей:" + minutes_all +
                Math.floor(((delta_time) % 60000) / 1000) + " секунд <br>");
            main.addLog("Детализация времени просмотра табов:<br>");

            for (i = 0; i < mainArrLength; i++){
                minutes = Math.floor((main.arrDate[i]) / 60000);
                isMinutes = (minutes < 1) ? '' : minutes + " минут ";
                main.addLog(i + " '" + $("#tab" + i + " a").html() + "': " + isMinutes +
                    Math.floor(((main.arrDate[i]) % 60000) / 1000) + " секунд <br>");
            }
        }
    }

    tabs.click(function(){
        var newTab = tabs.index($(this));
        main.changeTab(newTab);

    });

    $(".input_area input[type='submit']").click(function(){
        main.run();
    });

    inputText.keydown(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);

        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

        (code === 13) && main.run();
        (code === 38) && main.input_up();
        (code === 40) && main.input_down()
    });

});
