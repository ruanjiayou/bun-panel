# bun-panel
> bunjs开发,基于 sqlite 的 nas 导航面板.
> 
![图片](./screen_shot_1.png)

## usage
- start api server:
  - bun install
  - bun run dev
- start ui server:
  - cd ui
  - bun install
  - bun start

## run in docker
- docker pull ruanjiayou/bun-panel
- docker run ruanjiayou/bun-panel -p 5555:5555 -v ./data://usr/src/app/data --name bun-panel

## TODO
- [x] api design
- [x] api develope
- [x] api test
- [x] 添加修改分组和应用
- [x] 删除应用
- [x] 分组和应用排序
- [x] push to npm
- [x] push to docker
- [x] 修改app cover界面没实时同步
- [x] 分组按钮改为hover显示
- [x] group hover effect 
- [x] logger日志
- [ ] ~~Dockfile里build ui~~ (bun run build fail)

## design
- groups: 分组表, id,nth,name,fold(是否折叠)
- apps: 应用表, id,name,desc,cover,url_lan,url_wan,gid,type,open,bg_color
- engines: title,name,icon,url
- images: id,filepath,created_time,title
- config: 配置表, name,title,value(string)
  - mode: local/network
  - engine: 默认google
  - title: 系统名称 Bun-Panel
  - logo: 系统 logo
  - background_url: 系统背景

## api
- group
  - `get    /api/groups`
  - `post   /api/groups`
  - `put    /api/groups/:id`
  - `delete /api/groups/:id`
- app
  - `get    /api/apps`
  - `post   /api/apps`
  - `put    /api/apps/:id`
  - `delete /api/apps/:id`
- engine
  - `get    /api/engines`
  - `post   /api/engines`
  - `put    /api/engines/:name`
  - `delete /api/engines/:name`
- images
  - `get    /api/images`
  - `post   /api/images`
  - `delete /api/images/:id`
- config
  - 批量修改: `put    /api/config/`
  - `put    /api/configs/:name`
  - `get    /api/configs`
  - `delete /api/configs/:name`