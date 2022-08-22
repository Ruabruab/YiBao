//日照市地图
$(function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('map'));
    // 指定图表的配置项和数据
    $.get('js/rizhao.json', function (rizhaoJson) {
        echarts.registerMap('rizhao', rizhaoJson);
        var geoCoordMap = {
            '东港区': [119.457703, 35.426152, 946941, 750460235.20, 1154601764.76],
            '岚山区': [119.315844, 35.119794, 708280, 48704402.30, 82473798.54],
            '莒县': [118.832859, 35.588115, 433818, 144135417.78, 197901604.50],
            '五莲县': [119.206745, 35.751936, 1362233, 296221703.32, 452661279.04]
        };
        $.get('http://47.93.214.211:8080/ads_diqu_move', function (data) {
            // console.log(data)
            var data3 = {};
            var data4 = [];
            for (i = 0; i < data.length; i++) {
                var data2 = [];
                data2.push({
                    'name': data[i].ryqh,
                });
                // console.log(data2)
                data3 = {
                    'name': data[i].jzqh,
                    'value': data[i].num
                }
                data2.push(data3)
                data4.push(data2)
            }
            ;
            var BJData = data4;
            var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
            var convertData2 = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = geoCoordMap[dataItem[0].name];
                    var toCoord = geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push([{
                            coord: fromCoord,
                            value: dataItem[1].value
                        }, {
                            coord: toCoord
                        }]);
                    }
                }
                return res;
            };
            var color = ['#f44336', '#fc9700', '#ffde00', '#3cfc01', '#00eaff'];
            var series = [];
            [
                ['东港区', BJData]
            ].forEach(function (item, i) {
                series.push({
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 10
                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 0.3,
                            curveness: 0.3
                        }
                    },
                    data: convertData2(item[1])
                }, {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        period: 5, //动画时间，值越小速度越快
                        brushType: 'stroke', //波纹绘制方式 stroke, fill
                        scale: 3 //波纹圆环最大限制，值越大波纹越大
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right', //显示位置
                            offset: [5, 0], //偏移设置
                            formatter: function (params) { //圆环显示文字
                                return params.data.name;
                            },
                            fontSize: 13
                        }
                    },
                    symbol: 'circle',
                    symbolSize: function (val) {
                        return 10;
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            color: color[i]
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                }, {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        period: 4,
                        brushType: 'stroke',
                        scale: 4
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            //offset:[5, 0],
                            color: '#0f0',
                            formatter: '{b}',
                            textStyle: {
                                color: "#0f0"
                            }
                        },
                        emphasis: {
                            show: true,
                            color: "#f60"
                        }
                    },
                    symbol: 'pin',
                    symbolSize: 50,
                    data: [{
                        name: item[0],
                        value: geoCoordMap[item[0]].concat([83]),
                    }],
                });
            });

            var option = {
                // backgroundColor: '#ffffff',
                title: {
                    text: '就诊人员流动',
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)',
                        fontSize: 30,
                    },
                    right: '10%',
                    top: '3%'
                },
                tooltip: {
                    // trigger: 'item'
                    trigger: 'item',
                    backgroundColor: 'rgba(166, 200, 76, 0.82)',
                    borderColor: '#FFFFCC',
                    showDelay: 0,
                    hideDelay: 0,
                    enterable: true,
                    transitionDuration: 0,
                    extraCssText: 'z-index:100',
                    formatter: function (params) {
                        //根据业务自己拓展要显示的内容
                        if (params.seriesType == "effectScatter") {
                            // console.log(params.data.value)
                            console.log(params.data.value[0])
                            return "地点：" + params.data.name + "<br/>" + '<br/>总人次：' + params.data.value[2] +
                                '<br/>' +
                                '<br/>统筹费用：' + params.data.value[3] +
                                '<br/>' +
                                '<br/>总费用:' + params.data.value[4];
                        } else if (params.seriesType == "lines") {
                            return "人次：" + params.data.value;
                        }
                        var res = "";
                        return res;
                    }
                },
                legend: {
                    orient: 'vertical',
                    top: 'bottom',
                    left: 'right',
                    textStyle: {
                        color: '#fff'
                    },
                    selectedMode: 'single'
                },
                visualMap: { //图例值控制
                    min: 100000,
                    max: 3000000,
                    calculable: true,
                    show: true,
                    color: ['#f44336', '#fc9700', '#ffde00', '#3cfc01', '#00eaff'],
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                },
                geo: {
                    map: 'rizhao',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: false, //是否允许缩放
                    itemStyle: {
                        normal: {
                            color: 'rgba(46, 63, 81, 127)', //地图背景色
                            borderColor: '#445973', //省市边界线00fcff 516a89
                            borderWidth: 1
                        },
                        emphasis: {
                            color: 'rgba(35, 41, 58, 127)' //悬浮背景
                        }
                    }
                },
                series: series
            };
            myChart.setOption(option);
            myChart.on('click', function () {
                document.getElementById('MyDiv5').style.display = 'block';
                document.getElementById('fade5').style.display = 'block';
                var myChart = echarts.init(document.getElementById('showjiaohu'));

                // 指定图表的配置项和数据
                function show() {
                    $.get('http://47.93.214.211:8080/ads_sum_diqu').done(function (data1) {
                        var data = [];
                        for (i = 0; i < data1.length; i++) {
                            data.push({
                                'name': data1[i].jzqh,
                                'value': data1[i].num
                            })
                        }
                        ;
                        $.get('js/rizhao.json', function (rizhaoJson) {
                            data.sort(function (a, b) {
                                return a.value - b.value;
                            });
                            const mapOption = {
                                title: {
                                    text: '地区人次',
                                    left: 'center',
                                    textStyle: {
                                        color: 'rgba(238, 245, 245, 1)',
                                        fontSize: '30',
                                    }
                                },
                                visualMap: {
                                    left: 'right',
                                    min: 100000,
                                    max: 5000000,
                                    inRange: {
                                        // prettier-ignore
                                        color: ['#313695', '#fdae61', '#f46d43', '#a50026']
                                    },
                                    text: ['High', 'Low'],
                                    calculable: true
                                },
                                series: [
                                    {
                                        id: 'population',
                                        type: 'map',
                                        roam: true,
                                        map: 'rizhao',
                                        animationDurationUpdate: 1000,
                                        universalTransition: true,
                                        data: data
                                    }
                                ]
                            };
                            const barOption = {
                                title: {
                                    text: '地区人次',
                                    left: 'center',
                                    textStyle: {
                                        color: 'rgba(238, 245, 245, 1)'
                                    }

                                },
                                xAxis: {
                                    type: 'value',
                                    axisLabel: {

                                        textStyle: {
                                            color: 'rgba(238, 245, 245, 1)'
                                        }
                                    },
                                },
                                yAxis: {
                                    type: 'category',
                                    axisLabel: {
                                        rotate: 30
                                    },
                                    axisLabel: {

                                        textStyle: {
                                            color: 'rgba(238, 245, 245, 1)'
                                        }
                                    },
                                    data: data.map(function (item) {
                                        return item.name;
                                    })
                                },
                                animationDurationUpdate: 1000,
                                series: {
                                    type: 'bar',
                                    id: 'population',
                                    data: data.map(function (item) {
                                        return item.value;
                                    }),
                                    itemStyle: {
                                        color: function (params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#313695', '#fdae61', '#f46d43', '#a50026'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    },

                                    universalTransition: true
                                }
                            };
                            let currentOption = mapOption;
                            myChart.setOption(mapOption);
                            setInterval(function () {
                                currentOption = currentOption === mapOption ? barOption : mapOption;
                                myChart.setOption(currentOption, true);
                            }, 2000);
                        });
                    });
                }

                show();
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            })
        })
    });
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
//雷达图
$(function () {
    $.get('http://47.93.214.211:8080/ads_age', function (data) {
        var data_in = [];
        var data1 = [];
        var data2 = [];
        for (i = 0; i < data.length; i++) {
            data_in.push({
                'text': data[i].age,
                'color': 'rgba(238, 245, 245, 1)'
            });
            data1.push(data[i].tcfy);
            data2.push(data[i].num)
        }
        var myChart = echarts.init(document.getElementById('rader'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
            legend: {
                textStyle: {
                    color: "rgba(239, 221, 221, 1)"
                }, top: 10
            },
            radar: [
                {
                    indicator: data_in,
                    center: ['50%', '50%'],
                    radius: 70,
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    axisName: {
                        formatter: '{value}',
                        color: 'rgba(211, 253, 250, 0.8)'
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(211, 253, 250, 0.8)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(211, 253, 250, 0.8)'
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'radar',
                    emphasis: {
                        lineStyle: {
                            width: 4
                        }
                    },
                    data: [
                        {
                            value: data1,
                            name: '统筹费用',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value;
                                },
                                color: 'rgba(238, 245, 245, 1)'
                            }
                        },
                        {
                            value: data2,
                            name: '人次',
                            areaStyle: {
                                color: 'rgba(255, 228, 52, 0.6)'
                            },
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value;
                                }
                            }
                        }
                    ]
                }
            ]
        };
        var option1 = option;
        myChart.setOption(option);
        myChart.on('click', function () {
            document.getElementById('MyDiv2').style.display = 'block';
            document.getElementById('fade2').style.display = 'block';
            option1.radar[0].radius = 150;
            option1.legend.top = "15%";
            // option1.title.text='统筹费用和人次';
            var myChart1 = echarts.init(document.getElementById('showrader'));
            myChart1.setOption(option1);
            window.addEventListener("resize", function () {
                myChart1.resize();
            });
        })
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })

})
//光柱图
// $(function () {
//     var myChart = echarts.init(document.getElementById('guangzhu'));
//     // 指定图表的配置项和数据

//     data = [
//         {
//             name: "0~8",
//             value: 171056
//         },
//         {
//             name: "8~10",
//             value: 918291
//         },
//         {
//             name: "10~12",
//             value: 690176
//         },
//         {
//             name: "12~14",
//             value: 162040
//         },
//         {
//             name: "14~16",
//             value: 580586
//         },
//         {
//             name: "16~18",
//             value: 544122
//         },
//         {
//             name: "10~20",
//             value: 260803
//         },
//         {
//             name: "20~24",
//             value: 124198
//         }
//     ];
//     xAxisData = [];
//     seriesData1 = [];
//     sum = 0;
//     barTopColor = ["#02c3f1", "#53e568", "#a154e9", "#a154e9","#a154e9", "#a154e9","#a154e9", "#a154e9"];//barcolor
//     barBottomColor = ["rgba(2,195,241,0.1)", "rgba(83, 229, 104, 0.1)", "rgba(161, 84, 233, 0.1)", "rgba(161, 84, 233, 0.1)", "rgba(161, 84, 233, 0.1)", "rgba(161, 84, 233, 0.1)", "rgba(161, 84, 233, 0.1)", "rgba(161, 84, 233, 0.1)"];
//     data.forEach(item => {
//         xAxisData.push(item.name);
//         seriesData1.push(item.value);
//         sum += item.value;
//     });
//     option = {
//         // backgroundColor: '#061326',
//         grid: {
//             top: '25%',
//             bottom: '25%',
//             right:'0%',
//             left:'0%'
//         },
//         xAxis: {
//             data: xAxisData,
//             axisTick: {
//                 show: false
//             },
//             axisLine: {
//                 show: false
//             },
//             axisLabel: {
//                 show: true,
//                 margin: 25,
//                 align: 'center',
//                 formatter: function (params, index) {
//                     return '{a|' + (seriesData1[index] / sum * 100).toFixed(2) + '%}' + '\n' + '{b|' + params + '}';
//                 },
//                 textStyle: {
//                     fontSize: 14,
//                     color: '#ffffff',
//                     rich: {
//                         a: {
//                             fontSize: 12,
//                             color: '#ffffff'
//                         },
//                         b: {
//                             height: 20,
//                             fontSize: 14,
//                             color: '#ffffff'
//                         }
//                     }
//                 }
//             },
//             interval: 0
//         },
//         yAxis: {
//             splitLine: {
//                 show: false
//             },
//             axisTick: {
//                 show: false
//             },
//             axisLine: {
//                 show: false
//             },
//             axisLabel: {
//                 show: false
//             }
//         },
//         series: [{
//             name: '柱顶部',
//             type: 'pictorialBar',
//             symbolSize: [26, 10],
//             symbolOffset: [0, -5],
//             z: 12,
//             itemStyle: {
//                 normal: {
//                     color: function (params) {
//                         // console.log(barTopColor[params.dataIndex])
//                         return barTopColor[params.dataIndex];
//                     }
//                 }
//             },
//             tooltip: {
//                 show: true
//             },
//             label: {
//                 show: true,
//                 position: 'top',
//                 fontSize: 16,

//             },
//             symbolPosition: 'end',
//             data: seriesData1,
//         }, {
//             name: '柱底部',
//             type: 'pictorialBar',
//             symbolSize: [26, 10],
//             symbolOffset: [0, 5],
//             z: 12,
//             itemStyle: {
//                 normal: {
//                     color: function (params) {
//                         return barTopColor[params.dataIndex];
//                     }
//                 }
//             },
//             data: xAxisData,
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[0],
//                     borderWidth: 2
//                 }
//             },
//             data: [seriesData1[0], "", ""]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[1],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", seriesData1[1], ""]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[2],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[2]]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[3]]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[4],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[4]]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[5],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[5]]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[6],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[6]]
//         },
//         {
//             name: '第一圈',
//             type: 'pictorialBar',
//             symbolSize: [47, 16],
//             symbolOffset: [0, 11],
//             z: 11,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[7],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[7]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[0],
//                     borderWidth: 2
//                 }
//             },
//             data: [seriesData1[0], "", ""]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[1],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", seriesData1[1], ""]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[2],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[2]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[3]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[4]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[5]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[6]]
//         },
//         {
//             name: '第二圈',
//             type: 'pictorialBar',
//             symbolSize: [62, 22],
//             symbolOffset: [0, 17],
//             z: 10,
//             itemStyle: {
//                 normal: {
//                     color: 'transparent',
//                     borderColor: barTopColor[3],
//                     borderWidth: 2
//                 }
//             },
//             data: ["", "", seriesData1[7]]
//         },
//         {
//             type: 'bar',
//             itemStyle: {
//                 normal: {
//                     color: function (params) {
//                         return new echarts.graphic.LinearGradient(
//                             0, 0, 0, 1,
//                             [{
//                                 offset: 1,
//                                 color: barTopColor[params.dataIndex]
//                             },
//                             {
//                                 offset: 0,
//                                 color: barBottomColor[params.dataIndex]
//                             }
//                             ]
//                         );
//                     },
//                     opacity: 0.8
//                 }
//             },
//             z: 16,
//             silent: true,
//             barWidth: 26,
//             barGap: '-100%', // Make series be overlap
//             data: seriesData1
//         }
//         ]
//     };
//     var option1 = option;
//     myChart.setOption(option);
//     myChart.on('click', function () {
//         document.getElementById('MyDiv3').style.display = 'block';
//         document.getElementById('fade3').style.display = 'block';
//         var myChart1 = echarts.init(document.getElementById('showguangzhu'));
//         myChart1.setOption(option1);
//         window.addEventListener("resize", function () {
//             myChart1.resize();
//         });
//     })
//     window.addEventListener("resize", function () {
//         myChart.resize();
//     });
// })
//气泡
$(function () {
    var myChart = echarts.init(document.getElementById('guangzhu'));
    var option;
    $.get('http://47.93.214.211:8080/ads_daytime', function (data) {
        // console.log(data)
        var data_2019 = [];
        var data_2020 = [];
        var data_2021 = [];
        for (i = 0; i < data.length; i++) {
            if (data[i].year == '2019') {
                data_2019.push([data[i].num, data[i].daytime, data[i].year])
            }
            if (data[i].year == '2020') {
                data_2020.push([data[i].num, data[i].daytime, data[i].year])
            } else {
                data_2021.push([data[i].num, data[i].daytime, data[i].year])
            }
        }
        ;

        var option = {
            //   backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
            //     {
            //       offset: 0,
            //       color: '#f7f8fa'
            //     },
            //     {
            //       offset: 1,
            //       color: '#cdd0d5'
            //     }
            //   ]),
            title: {
                text: '结算时间',
                textStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                },
                left: '40%',
                top: '0'
            },
            legend: {
                right: '10%',
                top: '10%',
                data: ['2019', '2020', '2021'],
                textStyle: {
                    color: 'rgba(238, 245, 245, 1),rgba(84, 221, 65, 1)'
                }
            },
            grid: {
                left: '10%',
                top: '20%',
                bottom: '10%'
            },
            xAxis: {
                name: '人次',
                nameTextStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                },
                // splitLine: {
                //   lineStyle: {
                //     type: 'dashed'
                //   }
                // }
                // axisLine: {       //x坐标轴的轴线
                //     show: false
                // },
                // axisTick: {       //x轴的刻度线
                //     show: false
                // },
                // axisLabel: {      //x轴的刻度值
                //     show: false
                // },
                splitLine: {      //x轴的网格线
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                }
            },
            yAxis: {
                name: '时间',
                nameTextStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                },
                // splitLine: {
                //   lineStyle: {
                //     type: 'dashed'
                //   }
                // },
                scale: true,
                splitLine: {      //y轴的网格线
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                },

            },
            series: [
                {
                    name: '2019',
                    data: data_2019,
                    type: 'scatter',
                    symbolSize: function (data) {
                        //   console.log(data[2])
                        return Math.sqrt(data[0]) / 10;
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[0];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                            {
                                offset: 0,
                                color: 'rgb(251, 118, 123)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(204, 46, 72)'
                            }
                        ])
                    }
                },
                {
                    name: '2020',
                    data: data_2020,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[0]) / 10;
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[0];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                            {
                                offset: 0,
                                color: 'rgb(129, 227, 238)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(25, 183, 207)'
                            }
                        ])
                    }
                },
                {
                    name: '2021',
                    data: data_2021,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[0]) / 10;
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[0];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                            {
                                offset: 0,
                                color: 'rgba(202, 229, 21, 1)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(68, 37, 193, 1)'
                            }
                        ])
                    }
                }
            ]
        };
        myChart.setOption(option);

    })

})
//barmove
$(function showbar() {
    var myChart = echarts.init(document.getElementById('barmove'));
    // 指定图表的配置项和数据
    const updateFrequency = 2000;
    const dimension = 0;
    const countryColors = {
        东港区: '#00008b',
        岚山区: '#f00',
        五莲县: '#ffde00',
        莒县: 'rgba(142, 217, 85, 1)'
    };
    $.when(
        {},
        $.getJSON('http://47.93.214.211:8080/ads_barmove')
    ).done(function showbar_fun(n, res1) {
        const datajson = res1[0];
        // console.log(datajson)
        let data_json = [];
        let arrayl = [];
        arrayl.push(['time', 'diqu', 'tcfy']);
        for (i = 0; i < datajson.length; i++) {
            datajson1 = datajson[i].time;
            // console.log(datajson1)
            datajson2 = datajson[i].diqu;
            datajson3 = datajson[i].tcfy;
            arrayl.push([datajson1, datajson2, datajson3])
        }
        // console.log(arrayl)
        const data = arrayl;
        // console.log(data)
        const years = [];
        for (let i = 0; i < data.length; ++i) {
            if (years.length === 0 || years[years.length - 1] !== data[i][0]) {
                years.push(data[i][0]);//push年份
            }
        }
        // console.log(years)
        startIndex = 0;
        startYear = years[startIndex];
        // console.log(startYear)
        // console.log(data.slice(1).filter(function (d) {//截取除第一个数组的数据
        //     // console.log(d[4]);
        //     console.log(startYear);       
        //     return d[4] === startYear;
        //         }))
        var option = {
            // title: {
            //     text: '统筹费用',
            //     left: 'center',
            //     textStyle: {
            //         color: 'rgba(238, 245, 245, 1)'
            //     }

            // },
            grid: {
                top: 20,
                bottom: 30,
                left: 70,
                right: 70
            },
            xAxis: {
                max: 'dataMax',
                axisLabel: {
                    formatter: function (n) {
                        return Math.round(n) + '';
                    },
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                }
            },
            dataset: {
                source: data.slice(1).filter(function (d) {//截取除第一个数组的数据
                    return d[0] === startYear;
                })
            },
            yAxis: {
                type: 'category',
                inverse: true,
                max: 4,
                axisLabel: {
                    show: true,
                    fontSize: 14,
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    },
                    formatter: function (value) {//格式化刻度
                        return value;//valu刻度数的值

                    },
                    rich: {
                        flag: {
                            fontSize: 25,
                            padding: 5
                        }
                    }
                },
                animationDuration: 300,
                animationDurationUpdate: 300
            },
            series: [
                {
                    realtimeSort: true,
                    seriesLayoutBy: 'column',
                    type: 'bar',
                    itemStyle: {
                        color: function (param) {
                            // console.log(countryColors[param.value])
                            return countryColors[param.value[1]] || '#5470c6';
                        }
                    },
                    dimensions: ['time', 'tcfy', 'diqu'],
                    encode: {
                        x: 'diqu',
                        y: 'tcfy'
                    },
                    label: {
                        show: true,
                        precision: 1,
                        position: 'right',
                        valueAnimation: true,
                        fontFamily: 'monospace',
                        textStyle: {
                            color: 'rgba(238, 245, 245, 1)'
                        }
                    }
                }
            ],
            // Disable init animation.
            animationDuration: 0,
            animationDurationUpdate: updateFrequency,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
            graphic: {
                elements: [
                    {
                        type: 'text',
                        right: 10,
                        bottom: 60,
                        style: {
                            text: startYear,
                            font: 'bolder 80px monospace',
                            fill: 'rgba(100, 100, 100, 0.25)'
                        },
                        z: 100
                    }
                ]
            }
        };
        // console.log(option);
        myChart.setOption(option);
        for (let i = startIndex; i < years.length - 1; ++i) {
            (function (i) {
                setTimeout(function () {
                    updateYear(years[i + 1]);
                }, (i - startIndex) * updateFrequency);
            })(i);
        }

        function updateYear(year) {
            let source = data.slice(1).filter(function (d) {
                // console.log(d)
                return d[0] === year;
            });
            // console.log(year);
            option.series[0].data = source;
            // console.log(source)
            option.graphic.elements[0].style.text = year;
            myChart.setOption(option);
        }

        myChart.setOption(option);
        option1 = option;

        myChart.on('click', function () {
            document.getElementById('MyDiv1').style.display = 'block';
            document.getElementById('fade1').style.display = 'block';
            var myChart1 = echarts.init(document.getElementById('showbar'));
            for (let i = startIndex; i < years.length - 1; ++i) {
                (function (i) {
                    setTimeout(function () {
                        updateYear(years[i + 1]);
                    }, (i - startIndex) * updateFrequency);
                })(i);
            }

            function updateYear(year) {
                let source = data.slice(1).filter(function (d) {
                    return d[0] === year;
                });
                // console.log(year);
                option.series[0].data = source;
                option.graphic.elements[0].style.text = year;

                myChart.setOption(option1);
            }

            myChart1.setOption(option1);
            myChart1.setOption(option1);
            window.addEventListener("resize", function () {
                myChart1.resize();
            });
        });
    });
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
//折线
$(function () {
    var myChart = echarts.init(document.getElementById('line'));
    // 指定图表的配置项和数据
    $.get(
        'http://47.93.214.211:8080/ads_zhexian',
        function (_rawData) {
            let datajson = _rawData;
            let data_json = [];
            let arrayl = [];
            arrayl.push(['time', 'diqu', 'tcfy']);
            for (i = 0; i < datajson.length; i++) {
                datajson1 = datajson[i].time;
                // console.log(datajson1)
                datajson2 = datajson[i].diqu;
                datajson3 = datajson[i].tcfy;
                arrayl.push([datajson1, datajson2, datajson3])
            }
            // console.log(arrayl)
            const data = arrayl;
            // console.log(data)
            // console.log(_rawData)
            run(data);
        }
    );

    function run(_rawData) {
        // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
        const countries = [
            '东港区',
            '岚山区',
            '五莲县',
            '莒县'
        ];
        const datasetWithFilters = [];
        const seriesList = [];
        echarts.util.each(countries, function (country) {
            // console.log(country)
            var datasetId = 'dataset_' + country;
            datasetWithFilters.push({
                id: datasetId,
                fromDatasetId: 'dataset_raw',
                transform: {
                    type: 'filter',
                    config: {
                        and: [
                            {dimension: 'time', gte: 2019},
                            {dimension: 'diqu', '=': country}
                        ]
                    }
                }
            });
            seriesList.push({
                type: 'line',
                datasetId: datasetId,
                showSymbol: false,

                name: country,
                // endLabel: {
                //     show: true,
                //     formatter: function (params) {
                //         // console.log(params.value[0])
                //         return params.value[1] + ': ' + params.value[2];
                //     }
                // },
                labelLayout: {
                    moveOverlap: 'shiftY'
                },
                emphasis: {
                    focus: 'series'
                },//维度作为参数
                encode: {
                    x: 'time',
                    y: 'tcfy',
                    label: ['diqu', 'tcfy'],
                    itemName: 'time',
                    tooltip: ['tcfy']
                }
            });
        });
        option = {
            // grid:{
            //     top:48,
            //     left:400,// 调整这个属性
            //     right:50,
            //     bottom:50,
            //     },
            title: {
                text: '住院医保平均统筹费用对比',
                left: 'center',
                textStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                }

            },
            animationDuration: 10000,
            dataset: [
                {
                    id: 'dataset_raw',
                    source: _rawData
                },
                ...datasetWithFilters
            ],
            // title: {
            //   text: 'Income of Germany and France since 1950'
            // },
            tooltip: {
                order: 'valueDesc',
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                axisLabel: {
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                },
            },
            yAxis: {
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                },
            },
            grid: {
                left: '10%',
                top: '20%',
                bottom: '10%'
            },
            series: seriesList
        };
        myChart.setOption(option);
        myChart.setOption(option);
        myChart.on('click', function () {
            document.getElementById('MyDiv4').style.display = 'block';
            document.getElementById('fade4').style.display = 'block';
            var myChart1 = echarts.init(document.getElementById('showzhexian'));
            myChart1.setOption(option);
            window.addEventListener("resize", function () {
                myChart1.resize();
            });
        });
    }

    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
//波纹图
$(function () {
    var myChart = echarts.init(document.getElementById('water'));
    // 指定图表的配置项和数据
    var value = 0.657;
    option = {
        title: {
            text: '统筹费用所占比',
            left: '20%',
            textStyle: {
                color: 'rgba(238, 245, 245, 1)'
            }
        },
        series: [
            {
                type: 'liquidFill',
                radius: '50%',
                center: ['50%', '50%'],

                color: [
                    {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#16FFF1', // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#37D3FF', // 100% 处的颜色
                            },
                        ],
                    },
                ],
                data: [value, value], // data个数代表波浪数
                label: {
                    fontSize: 30,
                },
                backgroundStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(55, 211, 255, 0.42)',
                    color: 'rgba(12, 41, 49, 0.6)',
                },
                outline: {
                    show: false,
                },
            },
        ],
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
//柱状图+南丁格尔玫瑰图
$(function () {
    var myChart = echarts.init(document.getElementById('myd1'));
    $.get('http://47.93.214.211:8080/ads_renci', function (data) {
        // console.log(data[0].numbers);
        var option = {
            grid: {
                left: '0',
                right: '0',
                top: '10%',
                bottom: '24%',
                //containLabel: true
            },
            legend: {
                data: ['退休', '在职', '居民'],
                bottom: 0,
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: "#fff",
                    fontSize: '10',
                },
                itemGap: 5
            },
            title: {
                text: '人员类别总人次',
                left: '20%',
                textStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                }
            },
            tooltip: {
                show: "true",
                trigger: 'item'
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    show: false,
                    //   inside: true,
                    textStyle: {
                        color: "rgba(255,255,255,1)",
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    // formatter:function(val){
                    //     return val.split("").join("\n")
                    // },
                },
                data: ['人次']
            }
            ],
            series: [
                {
                    name: '退休',
                    type: 'bar',
                    barWidth: '20',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#20aa92',
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    zlevel: 2,
                    barGap: '100%',
                    data: [data[0].numbers],
                    label: {
                        formatter: "{c}人次",
                        show: false,
                        position: 'top',
                        textStyle: {
                            fontSize: 12,
                            color: 'rgba(255,255,255,.6)',
                        }
                    },
                },
                {
                    name: '在职',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#f4664e',
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    zlevel: 2,
                    barWidth: '20',
                    data: [data[1].numbers],
                    label: {
                        formatter: "{c}人次",
                        show: false,
                        position: 'top',
                        textStyle: {
                            fontSize: 12,
                            color: 'rgba(255,255,255,.6)',
                        }
                    },
                },
                {
                    name: '居民',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#0c93dc',
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    zlevel: 2,
                    barWidth: '20',
                    data: [data[2].numbers],
                    label: {
                        formatter: "{c}人次",
                        show: false,
                        position: 'top',
                        textStyle: {
                            fontSize: 12,
                            color: 'rgba(255,255,255,.6)',
                        }
                    },
                },


            ]
        };
        myChart.setOption(option);

        // 指定图表的配置项和数据
        // myChart1.showLoading();
        myChart.on('click', function () {
            document.getElementById('MyDiv6').style.display = 'block';
            document.getElementById('fade6').style.display = 'block';
            var myChart = echarts.init(document.getElementById('rose_diagram'));
            // alert(123);
            // myChart1.hideLoading();
            var option = {
                title: {
                    text: '人员类别统筹费用总和',
                    left: 'center',
                    top: '10%',
                    textStyle: {
                        color: 'rgba(238, 245, 245, 1)'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    bottom: '20%'
                },
                series: [
                    {
                        name: 'Radius Mode',
                        type: 'pie',
                        radius: [20, 140],
                        center: ['50%', '50%'],
                        roseType: 'radius',
                        itemStyle: {
                            borderRadius: 5
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        data: [
                            {value: 148376733, name: '退休'},
                            {value: 240453413, name: '在职'},
                            {value: 850691671, name: '居民'},
                        ]
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        })

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })

})
//pie
$(function showpie1() {
    var myChart = echarts.init(document.getElementById('pie'));
    // myChart.showLoading();
    // 指定图表的配置项和数据
    $.get('js/jgdj.json', function (data) {
        // console.log(data);
        data1 = [];
        for (i = 0; i < data.length; i++) {
            data1.push({
                'name': data[i].jgdj,
                'value': data[i].tcfy
            })
        }
        // console.log(data1)
        // myChart.hideLoading();
        var img =
            'data:image/png;base64,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';
        let angle = 0; //角度，用来做简单的动画效果的
        var timerId;
        var trafficWay = data1;
        var data = [];
        // 00FEFF
        var color = ['#FF801C', '#F5FF46', '#00FE65', '#00FEFF', '#ffa800', '#ff5b00', '#ff3000'];
        for (var i = 0; i < trafficWay.length; i++) {
            data.push(
                {
                    value: trafficWay[i].value,
                    name: trafficWay[i].name,
                    itemStyle: {
                        normal: {
                            borderWidth: 5,//大圈半径
                            shadowBlur: 20,
                            borderColor: color[i],
                            shadowColor: color[i],
                        },
                    },
                },
                {
                    value: 2,
                    name: '',
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                            },
                            labelLine: {
                                show: false,
                            },
                            color: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 0, 0)',
                            borderWidth: 0,
                        },
                    },
                }
            );
        }
        var seriesOption = [
            {
                name: '',
                type: 'pie',
                clockWise: false,
                radius: [52.5, 70],//大光圈半径
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outside',
                            color: '#ddd',
                            formatter: function (params) {
                                var percent = 0;
                                var total = 0;
                                for (var i = 0; i < trafficWay.length; i++) {
                                    total += trafficWay[i].value;
                                }
                                percent = ((params.value / total) * 100).toFixed(0);
                                if (params.name !== '') {
                                    return percent + '%';
                                } else {
                                    return '';
                                }
                            },
                        },
                        labelLine: {
                            length: 15,
                            length2: 50,//线长
                            show: true,
                            color: '#00ffff',
                        },
                    },
                },
                data: data,
            },
            // 紫色
            {
                name: '',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 10.6,
                            startAngle: ((0 + angle) * Math.PI) / 180,
                            endAngle: ((90 + angle) * Math.PI) / 180,
                        },
                        style: {
                            stroke: '#00FEFF',
                            fill: 'transparent',
                            lineWidth: 1.5,//蓝色线宽
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: '', //紫点
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 10.6;
                    let point = getCirlPoint(x0, y0, r, 90 + angle);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4,
                        },
                        style: {
                            stroke: '#00FEFF', //绿
                            fill: '#00FEFF',
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            // 蓝色线

            {
                name: '',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 10.6,
                            startAngle: ((180 + angle) * Math.PI) / 180,
                            endAngle: ((270 + angle) * Math.PI) / 180,
                        },
                        style: {
                            stroke: '#00FEFF',
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: '', // 蓝色原点
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 10.6;
                    let point = getCirlPoint(x0, y0, r, 180 + angle);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4,//半径
                        },
                        style: {
                            stroke: '#00FEFF', //绿
                            fill: '#00FEFF',
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            //蓝色线
            {
                name: '',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 11.6,
                            startAngle: ((270 + -angle) * Math.PI) / 180,
                            endAngle: ((40 + -angle) * Math.PI) / 180,
                        },
                        style: {
                            stroke: '#00FEFF',
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            // 蓝色线

            {
                name: '',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 11.6,
                            startAngle: ((90 + -angle) * Math.PI) / 180,
                            endAngle: ((220 + -angle) * Math.PI) / 180,
                        },
                        style: {
                            stroke: '#00FEFF',
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            //蓝点
            {
                name: '',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 11.6;
                    let point = getCirlPoint(x0, y0, r, 90 + -angle);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4,
                        },
                        style: {
                            stroke: '#00FEFF', //粉
                            fill: '#00FEFF',
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: '', //蓝点
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 11.6;
                    let point = getCirlPoint(x0, y0, r, 270 + -angle);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4,
                        },
                        style: {
                            stroke: '#00FEFF', //绿
                            fill: '#00FEFF',
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
        ];

        var option = {
            title: {
                text: '各等级医院统筹费用',
                left: 'center',
                textStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                }

            },
            // backgroundColor: '#000E1A',
            color: color,
            //黄色线
            graphic: {
                elements: [
                    {
                        type: 'image',
                        z: 3,
                        style: {
                            image: img,
                            width: 89,
                            height: 89,
                        },
                        left: 'center',
                        top: 'center',
                        position: [50, 50],
                    },
                ],
            },
            tooltip: {
                show: false,
            },
            legend: {
                icon: 'circle',
                orient: 'horizontal',

                left: '0%',
                top: 'center',
                textStyle: {
                    color: '#fff',
                },
                itemGap: 20,
            },
            toolbox: {
                show: false,
            },
            series: seriesOption,
        };
        //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
        function getCirlPoint(x0, y0, r, angle) {
            let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
            let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
            return {
                x: x1,
                y: y1,
            };
        }
        function draw() {
            angle = angle + 3;
            myChart.setOption(option, true);
            //window.requestAnimationFrame(draw);
        }
        if (timerId) {
            clearInterval(timerId);
        }
        timerId = setInterval(function () {
            //用setInterval做动画感觉有问题
            draw();
        }, 100);
        myChart.setOption(option);
        // $.get('js/data/yllb.json', function (data) {
        //     var data1 = [];
        //     var data2 = {};
        //     var data3 = {};
        //     var data4 = {};
        //     for (i = 0; i < data.length; i++) {
        //         if (data[i].jgdj == '一级') {
        //             var str = {
        //                 name:data[i].yllb,
        //                 value:data[i].tcfy
        //             };
        //             str=[str];

        //         }
        //         if (data[i].jgdj == '二级') {
        //             var str = new Object;
        //             str.name = data[i].yllb;
        //             str.value = data[i].tcfy;
        //             data3.push(str)
        //         }
        //         else {
        //             var str = new Object;
        //             str.name = data[i].yllb;
        //             str.value = data[i].tcfy;
        //             data4.push(str)
        //         }
        //     }
        //     data1.push({
        //         'name': '一级',
        //         'data': data2
        //     }, {
        //         'name': '二级',
        //         'data': data3
        //     }, {
        //         'name': '三级',
        //         'data': data4
        //     }
        //     )
        // console.log(data1)
        const drilldownData = [
            {
                name: '一级',
                data: [
                    {name: '普通门诊', value: 4.162541786E7},
                    {name: '门诊慢特病', value: 6.127758109E7}
                ]
            },
            {
                name: '二级',
                data: [
                    {name: '普通门诊', value: 2348831.55},
                    {name: '门诊慢特病', value: 5.192739049E7}
                ]
            },
            {
                name: '三级',
                data: [
                    {name: '普通门诊', value: 2827805.36},
                    {name: '门诊慢特病', value: 9.618051999E7}
                ]
            }
        ];
        myChart.on('click', event => {
            document.getElementById('MyDiv').style.display = 'block';
            document.getElementById('fade').style.display = 'block';
            var showpie = echarts.init(document.getElementById('showpie'));
            // 基于准备好的dom，初始化echarts实例
            if (event.data) {
                const subData = drilldownData.find(data => {
                    return data.name === event.data.name;
                });
                if (!subData) {
                    return;
                }
                // subData = subData.data;
                showpie.setOption({
                    title: {
                        text: '普通门诊和门诊慢特病',
                        left: 'center',
                        top: '10%'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        bottom: '5%',
                        textStyle: { color: "rgba(238, 227, 227, 1)" }
                    },
                    // dataset: [
                    //     subData.data
                    // ],
                    series: {
                        type: 'pie',
                        id: 'sales',
                        radius: ['35%', '50%'],
                        name: subData.name,
                        data: subData.data,
                        universalTransition: {
                            enabled: true,
                            divideShape: 'clone'
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });
                window.addEventListener("resize", function () {
                    showpie.resize();
                });
            }
        });
        // })

    })

    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
//南丁格尔
$(function () {
    var myChart = echarts.init(document.getElementById('xb'));

    option = {
        title: [
            {
                subtext: '男性',
                left: '45%',
                top: '0%',
                textAlign: 'center',
                subtextStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                }
            },
            {
                subtext: '女性',
                left: '80%',
                top: '0%',
                textAlign: 'center',
                subtextStyle: {
                    color: 'rgba(238, 245, 245, 1)'
                }
            },

        ],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}  {c} ({d}%)'
        },
        legend: {
            left: 'left',
            orient: 'vertical',
            textStyle: {
                color: 'rgba(238, 245, 245, 1)'
            }
        },
        series: [
            {
                name: '病种',
                type: 'pie',
                radius: [20, 90],
                center: ['45%', '60%'],
                roseType: 'radius',
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false
                },
                data: [{
                    name: "呼吸系统疾病",
                    value: 15923
                },
                    {
                        name: "肿瘤",
                        value: 12883
                    },
                    {
                        name: "循环系统疾病",
                        value: 10556
                    },
                    {
                        name: "肌肉骨骼系统或结缔组织疾病",
                        value: 10194
                    },
                    {
                        name: "消化系统疾病",
                        value: 7841
                    },
                    {
                        name: "神经系统疾病",
                        value: 5792
                    },
                    {
                        name: "全身症状、体征或临床所见",
                        value: 5480
                    },
                    {
                        name: "泌尿生殖系统疾病",
                        value: 5313
                    },
                    {
                        name: "免疫系统疾病",
                        value: 3559
                    },
                    {
                        name: "内分泌、营养或代谢疾病",
                        value: 2569
                    }]
            },
            {
                name: '病种',
                type: 'pie',
                radius: [20, 90],
                center: ['80%', '60%'],
                roseType: 'area',
                label: {
                    show: false
                },
                itemStyle: {
                    borderRadius: 5
                },
                data: [{
                    name: "肌肉骨骼系统或结缔组织疾病",
                    value: 13408
                },
                    {
                        name: "肿瘤",
                        value: 12997
                    },
                    {
                        name: "循环系统疾病",
                        value: 11553
                    },
                    {
                        name: "呼吸系统疾病",
                        value: 11514
                    },
                    {
                        name: "消化系统疾病",
                        value: 6588
                    },
                    {
                        name: "泌尿生殖系统疾病",
                        value: 5999
                    },
                    {
                        name: "全身症状、体征或临床所见",
                        value: 5509
                    },
                    {
                        name: "神经系统疾病",
                        value: 4618
                    },
                    {
                        name: "免疫系统疾病",
                        value: 3531
                    },
                    {
                        name: "内分泌、营养或代谢疾病",
                        value: 3317
                    }]
            }
        ]
    };
    myChart.setOption(option);


    window.addEventListener("resize", function () {
        myChart.resize();
    });
})