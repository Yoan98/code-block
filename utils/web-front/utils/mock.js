const Mock = require('mockjs')

// 随机名称的对象
const Random = Mock.Random

// 首页列表的mock数据
const ListMock = {
  'lists|20': [
    {
      uid: {
        'name': Random.cname(),
        'isVip|1-7': 1
      },
      title: '大前端课程',
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

let ListData = Mock.mock(ListMock)

export { ListData }
