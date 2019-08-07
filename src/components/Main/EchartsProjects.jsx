/***
 * 
 * 访问量图表
 * 
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts'

let dataAxis = []; // 坐标轴标签
let data = []; // 数据
for (let i = 0; i < 50; i++) {
    dataAxis.push(i + 1);
    data.push(Math.ceil((Math.cos(i / 5) * (i / 5) + i / 6) * 5) + 10);
}
var yMax = Math.max(...data)
// 阴影数据
let dataShadow = [];

for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax);
}

const option = {
    title: {
        text: '网站近50天访问量',
        left: 'center',
        textStyle: {
            color: '#ccc',
            fontSize: 10
        }
        // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
    },

    // x轴
    xAxis: {
        data: dataAxis,
        // 坐标标签
        axisLabel: {
            // inside: true,
            textStyle: {
                color: '#ccc'
            }
        },
        // 坐标轴刻度
        axisTick: {
            show: false
        },
        // 坐标轴轴线
        axisLine: {
            show: false
        },
        // x轴的所有图形的z值
        z: 10
    },
    // y轴
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
    },
    // 区域缩放
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    // 提示框
    tooltip: {},
    // 图标类型
    series: [
        // 后阴影
        { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            data: dataShadow,
            animation: false
        },
        // 主图
        {
            name: '访问量',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#83bff6'},
                            {offset: 0.5, color: '#188df0'},
                            {offset: 1, color: '#188df0'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    )
                }
            },
            data: data
        }
    ]
    
    // // 初始动画的缓动效果
    // animationEasing: 'elasticOut',
    // // 数据更新动画的缓动效果
    // animationEasingUpdate: 'elasticOut',
    // // 初始动画的延迟
    // animationDelay: function (idx) {
    //     return idx * 20;
    // },
    // // 数据更新动画的延迟
    // animationDelayUpdate: function (idx) {
    //     return idx * 20;
    // }
};
const EchartsProjects = () => (
    <ReactEcharts
        option={option}
        style={{ height: '212px', width: '100%' }}
        className={'react_for_echarts'}
    />
);

export default EchartsProjects;