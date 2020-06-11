import * as Mock from 'mockjs'

// 随机名称的对象
const Random = Mock.Random

// 首页列表的mock数据
const ListMock = {
  'lists|8': [
    {
      uid: {
        name: Random.cname(),
        'isVip|1-7': 1
      },
      title: Random.csentence(5, 10),
      content: Random.csentence(10, 20),
      created: Random.date('yyyy-MM-dd'),
      catlog: 'ask',
      'fav|0-100': 40,
      'isEnd|0-3': 0,
      'reads|0-100': 10,
      'answer|0-100': 0,
      'status|0-3': 0,
      'isTop|0-1': 0,
      tags: [
        {
          name: '精华',
          class: 'layui-bg-red'
        },
        {
          name: '热门',
          class: 'layui-bg-blue'
        }
      ]

    }
  ]
}
const ListData = Mock.mock(ListMock).lists
// Tips数据
const TipsMock = {
  'lists|1-3': [
    {
      url: Random.url(),
      title: Random.csentence(3, 10)
    },
    {
      url: Random.url(),
      title: Random.csentence(3, 10)
    },
    {
      url: Random.url(),
      title: Random.csentence(3, 10)
    }
  ]
}
const TipsData = Mock.mock(TipsMock).lists

export { ListData, TipsData }
