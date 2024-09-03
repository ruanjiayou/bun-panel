# bun-panel

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## design
- groups: 分组表, id,nth,name,fold(是否折叠)
- apps: 应用表, id,name,desc,cover,url,url_internal,gid,type,open,bg_color
- engines: title,name,icon,url
- images: id,filepath,created_time,title
- config: 配置表, name,title,value(string)
  - mode: local/network
  - engine: 默认google
  - title: 系统名称 Bun-Panel
  - logo: 系统 logo
  - bg: 系统背景

## api
- group
  - `get    /groups`
  - `post   /groups`
  - `put    /groups/:id`
  - `delete /groups/:id`
- app
  - `get    /apps`
  - `post   /apps`
  - `put    /apps/:id`
  - `delete /apps/:id`
- engine
  - `get    /engines`
  - `post   /engines`
  - `put    /engines/:name`
  - `delete /engines/:name`
- images
  - `get    /images`
  - `post   /images`
  - `delete /images/:id`
- config
  - `put    /configs/:name`
  - `get    /configs`
  - `delete /configs/:name`