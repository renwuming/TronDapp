import React from 'react'

import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'

var colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
var bgColor = 'rgba(46,39,51,.8)';

var itemStyle = {
  star5: {
    color: colors[0]
  },
  star4: {
    color: colors[1]
  },
  star3: {
    color: colors[2]
  },
  star2: {
    color: colors[3]
  }
};

const strMap = {
  '财富': [
    '2019年你的运气直线上升，福禄自天来，催旺财运气场。再加上人际交往四通八达，近期有着大丰收也是正常的，步步高升。同时你的财帛宫印星重而生财星，偏财旺而容易得意外之财，富有只是时间和机遇的问题。如果能够把握时机，所谋如意，财丰利足。',
    '2019年对你来说，天干相助，地支逢财，又有小吉星兆命，多能从合作中求到财富。亥猪太岁之财又是正财，所以工薪阶层也能从工作中得到财富的提升，形成加薪升职的好运势。对经商求利之人而言，不但多有合作之财，又有异地生财之象，小吉星能促使生肖牛的朋友外出求财吉祥，形成出外洽谈业务成功率较高的信息，总会有机会拿下几笔不错的项目和财富。',
    '步入2019年后，你要留意财运有轻微变化，在财运亨通的时间段，为财运差的时间做好资金储备。偏财方面凭贵人的消息，令你获得不错的偏财进账。',
    '2019年对你来说不算如意，家庭开支会比较多，尤其是子女方面带来的开支会比较大些。如果没有子女的人士在衣食住行上会有很大的开支，应该注意节俭。',
    '2019年的财运堪忧，劫财破财影响比较大，财运被破不仅仅自己的收入少，还容易造成破财、被骗、欺诈、生意投资等都会出问题。对于偏财投资要适合而止，尤其是炒房炒股、投资生意、博彩投机等等，都没有太好的财运，有些风水大雨点小，还容易被人欺骗，不要轻易相信熟人盲目投资。',
    '2019年，切忌外显财富，引起破财败财、被人欺诈、投资有去无回、工作事业诸事不利。一旦漏财，水缸没有底，毫无收回之势。同时极易受到周围他人的影响以及影响周围他人的财运。投资买卖更不得为之，有劫财之象。劫财之人，或同行，或同事，不管是谁，于你都有很大的威胁。'
  ],
  '爱情': [
    '爱情大吉，能够遇到真命桃花，会寻找到属于自己的那份甜蜜，只要意向大胆主动，只要机会来了，一定不会错过，能顺利与自己的真命姻缘好好签收，共同一起走，过着属于自己的那份甜蜜浪漫，属于自己幸福的生活。',
    '2019年有“福德”贵人相助，与另一半关系和谐，感情基础逐渐稳固，日常生活恩爱有加。单身者则容光焕发，魅力四射，更受欢迎，有姻缘星牵引，巧遇桃花的机会大增。',
    '2019稍有桃花，单身者可在工作和生活中认识不少异性朋友，并且自身对爱情较为渴望，一旦认定某个目标，就会积极主动展开追求，成功的概率也会增加。然而产生单相思的概率也会增加，极有可能体会到“落花有意流水无情”的无奈之感。',
    '2019年会常常出现对伴侣产生怨念的情况，导致矛盾摩擦增多，与伴侣之间要坦诚相对，出现问题要多检讨自己，多关心另一半的生活，感情自然牢不可破。另外该年会带来婚外桃花，婚姻生活受到第三者侵扰，自制力差者极有可能会背叛婚姻，陷入婚外情缘。',
    '已婚者夫妻感情变淡，婚姻易出现裂痕。日常生活中不能全然不顾对方感受，进行言语上的伤害，否则夫妻矛盾将会加深，导致家庭永无宁日。单身者今年有机会在社交、职场上结交许多异性，但仅属浅层次的交往而已，难以有实质的进展。部分属龙人因年岁渐长，身边亲友施加较大的压力，加之自身急于摆脱单身的状态，因此会出现急于求成的情况，结果往往会因为相互了解不够而分道扬镳，甚至会因此而误入感情圈套，导致人财两失，对待新的恋情要坚持宁缺毋滥的原则，在进一步了解对方之后才可以展开真正的交往。',
    '与伴侣分开的机会增加，进一步导致感情变淡。容易对另一半不信任，产生患得患失之感。容易与另一半发生口角，性格不合的一面被进一步放大，长期如此则会使关系微妙。建议要管理好自身的情绪，与爱人坦诚相对，寻求对方的支持和理解，才能使得夫妻感情坚如磐石。'
  ],
  '事业': [
    '事业运极佳，这一年事业上有机会取得较大突破。容易得到贵人的帮助，有升职加薪的机会，被贵人帮助发展，催旺自己的官运，通过工作挣钱的机会也很多，很容易遇到有钱的贵人。',
    '2019将拥有比2018更佳的事业运，机缘巧合之下，你会遇到一些意想不到的喜事，从而使得事业更加快速的发展。而2019年的你也会有一个相对积极的状态，在工作中如鱼得水，且势头稳步提升，越来越好。',
    '2019年事业上容易升职加薪，会有小突破，但总体变化不大。容易得到他人的帮助，主要来自同辈同时同学。常常会有喜讯，但总体而言十分鸡肋。2019年是积累的一年，虽没有大的变化，但将是为2020年作为铺垫的最佳时期。',
    '事业稍有压力，没有太大变化。虽有贵人相助，但无奈总体运势低迷，难有起伏。注意这一年将有小事小非，一定要谨慎小心。运势虽为小凶，但若不注意自身，事业将有可能一落千丈，甚至转为大凶。切忌贪小财，不要因小失大。凡事多与朋友家人商量，少听来路不明之人建议。',
    '2019年在职场上困难重重，发展异常困难，尤其是职场方面，若为领导，今年容易出现自己的属下造成的责任，让自己背负责任，为人背黑锅的现象。若为下属，应多注意背后小人。',
    '运势极差，容易牵涉官司、引起诉讼、惹事是非、牢狱之灾等，无缘无故被人起诉，劳民伤财。主诉讼刑杖、入命官难、是非刑罚、引发官司是非无妄之灾，丢官罢职事业艰难，甚至被人冒名顶替作案以致冤枉入狱受罚，被公检法工商税务城管等稽查。'
  ]
}

function handleData(obj) {
  let data = []
  let { getUserlove, getUsercareer, getUsermoney } = obj.data
  let map = { '财富': getUsermoney, '事业': getUsercareer, '爱情': getUserlove }
  for (let key in map) {
    let score = map[key]
    if (score <= 0) {
      let o = {
        name: key,
        label: {
          fontSize: 14,
        },
        itemStyle: colors[0],
        children: [
          {
            name: '-',
            children: [{
              name: `☆-`,
              children: [{
                detail: '-',
                label: {
                  algin: 'right',
                  rotate: 'tangential',
                }
              }]
            }]
          }
        ]
      }
      data.push(o)
      continue;
    }
    let info = handleScore(score)
    let o = {
      name: key,
      label: {
        fontSize: 14,
      },
      itemStyle: colors[info.color],
      children: [
        {
          name: info.title,
          children: [{
            name: `☆${score}`,
            children: [{
              detail: strMap[key][info.strIndex],
              label: {
                algin: 'right',
                rotate: 'tangential',
              }
            }]
          }]
        }
      ]
    }
    data.push(o)
  }
  return data
}

function handleScore(score) {
  let res = {}
  if (score >= 90) {
    res.title = '大吉'
    res.star = 5
    res.strIndex = 0
  }
  else if (score >= 70) {
    res.title = '吉'
    res.star = 4
    res.strIndex = 1
  }
  else if (score >= 50) {
    res.title = '小吉'
    res.star = 3
    res.strIndex = 2
  }
  else if (score >= 30) {
    res.title = '小凶'
    res.star = 2
    res.strIndex = 3
  }
  else if (score >= 10) {
    res.title = '凶'
    res.star = 1
    res.strIndex = 4
  }
  else {
    res.title = '大凶'
    res.star = 1
    res.strIndex = 5
  }
  res.color = 4 - Math.floor(res.star / 1.5)
  return res
}

function handleConfig(data) {
  for (var j = 0; j < data.length; ++j) {
    var level1 = data[j].children;
    for (var i = 0; i < level1.length; ++i) {
      var block = level1[i].children;
      var bookScore = [];
      var bookScoreId;
      for (var star = 0; star < block.length; ++star) {
        var style = (function (name) {
          switch (name) {
            case 5:
              bookScoreId = 0;
              return itemStyle.star5;
            case 4:
              bookScoreId = 1;
              return itemStyle.star4;
            case 3:
              bookScoreId = 2;
              return itemStyle.star3;
            case 2:
              bookScoreId = 3;
              return itemStyle.star2;
            default:
              bookScoreId = 3;
              return itemStyle.star2;
          }
        })(block[star].star);

        block[star].label = {
          downplay: {
            opacity: 0.5
          }
        };

        if (block[star].children) {
          style = {
            opacity: 1,
            color: style.color
          };
          block[star].children.forEach(function (book) {
            book.value = 1;
            book.itemStyle = style;

            book.label = {
              color: style.color
            };

            var value = 1;
            if (bookScoreId === 0 || bookScoreId === 3) {
              value = 5;
            }

            if (bookScore[bookScoreId]) {
              bookScore[bookScoreId].value += value;
            }
            else {
              bookScore[bookScoreId] = {
                color: colors[bookScoreId],
                value: value
              };
            }
          });
        }
      }

      level1[i].itemStyle = {
        color: data[j].itemStyle
      };
    }
  }
  const option = {
    backgroundColor: bgColor,
    color: colors,
    tooltip: {
      position: ['10%', '10'],
      show: true,
      confine: true,
      formatter: function (params) {
        let { data } = params
        while (data.children || data[0] && data[0].children) {
          data = data.children || data[0] && data[0].children
        }
        let res = data.detail || data[0] && data[0].detail
        const L = Math.ceil((res.length - 1) / 30)
        let R = ''
        for (let i = 0; i < L; i++) {
          R += res.substr(i * 30, 30) + '<br/>'
        }
        return R
      },
    },
    series: [{
      type: 'sunburst',
      nodeClick: false,
      center: ['50%', '48%'],
      data: data,
      sort: function (a, b) {
        if (a.depth === 1) {
          return b.getValue() - a.getValue();
        }
        else {
          return a.dataIndex - b.dataIndex;
        }
      },
      label: {
        rotate: 'radial',
        fontWeight: 'bold',
        color: bgColor
      },
      itemStyle: {
        borderColor: bgColor,
        borderWidth: 2
      },
      levels: [{}, {
        r0: 0,
        r: 40,
        label: {
          rotate: 0
        }
      }, {
        r0: 40,
        r: 105
      }, {
        r0: 115,
        r: 140,
        itemStyle: {
          shadowBlur: 2,
          shadowColor: colors[2],
          color: 'transparent'
        },
        label: {
          rotate: 'tangential',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#ffff66',
        }
      }, {
        r0: 140,
        r: 145,
        itemStyle: {
          shadowBlur: 80,
          shadowColor: colors[0]
        },
        label: {
          position: 'outside',
          textShadowBlur: 5,
          textShadowColor: '#333',
        },
        downplay: {
          label: {
            opacity: 0.8
          }
        }
      }]
    }]
  };
  return option
}

let eventFlag = false

export default class PieReact extends React.Component {
  /**
   * 初始化id id是随机生成的一串唯一的字符串
   */
  constructor(props) {
    super(props)

    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'pie' + id
    }
  }
  /**
   * 生成图表，主要做了一个判断，因为如果不去判断dom有没有生成，
   * 在后面如果定期去更新图表，每次生成一个dom节点会导致浏览器
   * 占用的cpu和内存非常高，踩过坑。
   * 这里的config就是引入的配置文件中的config,文件头部会有说明
   */
  initPie(id, option) {
    if (!id) return
    let target = document.getElementById(id)
    let myChart = echarts.getInstanceByDom(target);
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    myChart.setOption(option)
    if (eventFlag) return
    eventFlag = true
    // myChart.on('mouseover', function (params) {
    //   let { data } = params
    //   while (data.children || data[0] && data[0].children) {
    //     data = data.children || data[0] && data[0].children
    //   }
    //   let res = data.name || data[0] && data[0].name
    //   console.log(res)
    // });
  }
  componentDidMount() {

  }
  componentDidUpdate() {
    let data = handleData(this.props)
    let option = handleConfig(data)


    setTimeout(() => {
      this.initPie(this.state.pieId, option);
    }, 100);
  }
  render() {
    return (
      <div id={this.state.pieId} style={{ width: "100%", height: "100%" }}></div>
    )
  }
}
