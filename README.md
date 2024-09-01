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
- groups: 分组表, id/index/name/fold
- apps: 应用表, id,name,desc,cover,url,url_internal,group_id,type,open,bg_color
- engines: id/name/inuse/
- config: 配置表, 
  - mode: local/network
  - engine: 默认无
  - title: 系统名称
  - logo: 系统 logo
  - bg: 系统背景

## api
- 上传图片: post /images
- 图片列表: get /images
- 应用列表: get /apps
- 添加应用: post /apps
- 修改应用: put /apps/:id
- 修改系统配置: put /config