/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import { Fragment, useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useLocalObservable, Observer } from "mobx-react-lite"
import apis from './apis'
import DialogGroup from './dialog/group.js';
import DialogEngine from './dialog/engine.js';
import { Icon, toast } from './components/index.js'
import { FormItem, FormLabel, Center } from './components/style.js';
import DialogApp from './dialog/app.js';
import DialogConfig from './dialog/config.js';
import { toJS } from 'mobx';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import getRealUrl from './utils/realImageUrl.js';
import {
  Group,
  GroupTitle,
  CardWrap,
  Card,
  Cell,
  MenuWrap,
  HoverItem,
  AppDesc,
  AppIcon,
  AppTitle,
} from './style.js'

const AppItem = SortableElement(({ local, app }) => {
  const url = local.allow_mix ? (local.config.network === 'LAN' ? app.url_lan || app.url_wan : app.url_wan || app.url_lan) : (local.config.network === 'LAN' ? app.url_lan : app.url_wan);
  return <Cell key={app.id}
    className={`cell ${(local.sort_gid === app.gid || !url) ? '' : 'spin-colorful'} ${!url ? ' disabled' : ''}`}
    onMouseDown={e => {
      if (local.sort_gid === app.gid) {
        // sort
      } else {
        // click
        e.stopPropagation();
      }
    }}
    onContextMenu={(e) => {
      e.stopPropagation();
      e.preventDefault();
      local.temp_app = app;
      local.showEditApp = true;
    }}
  >
    <Card
      style={{ alignItems: app.cover ? 'left' : 'center', justifyContent: app.cover ? 'left' : 'center', backgroundColor: local.sort_gid === app.gid ? '#b0b9be82' : '', cursor: local.sort_gid === app.gid ? 'all-scroll' : '' }}
      target={app.open === 1 ? '_blank' : '_self'}
      href={url}
      onClick={(e) => {
        if (!url) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {app.cover && <AppIcon src={getRealUrl(app.cover)} />}
      <div key={app.cover} className='txt-omit' style={{ display: 'flex', width: 120, height: '100%', flexDirection: 'column', alignItems: app.cover ? 'left' : 'center', justifyContent: 'center' }}>
        <AppTitle className='txt-omit'>{app.name}</AppTitle>
        <AppDesc title={app.desc}>{app.desc}</AppDesc>
      </div>
    </Card>
  </Cell>
});

const AppList = SortableContainer(({ local, items }) => {
  return <CardWrap>
    {items.map((item, index) => <AppItem key={item.id} disabled={local.sort_gid !== item.gid} index={index} local={local} app={item} />)}
  </CardWrap>
});
const GroupHandle = SortableHandle(({ local, group }) => (
  <span onContextMenu={e => {
    e.stopPropagation();
    e.preventDefault();
    local.temp_group = group;
    local.showEditGroup = true;
  }}>{group.name}</span>
))
const GroupItem = SortableElement(({ local, group }) => <div key={group.id} >
  <Observer>{() => (
    <Fragment>
      <GroupTitle>
        <GroupHandle local={local} group={group} />
        <div style={{ display: group.id ? 'flex' : 'none', cursor: 'pointer', visibility: local.sort_gid === group.id ? 'visible' : '' }}>
          <Icon type={'sort'} size={24} style={{ marginLeft: 5, marginTop: -2, fill: local.sort_gid === group.id ? '#00aaff' : 'white' }} onClick={() => {
            local.sort_gid = local.sort_gid === group.id ? null : group.id;
          }} />
        </div>
      </GroupTitle>
      {group.fold === 0 && <AppList axis="xy" local={local} items={group.apps} onSortEnd={({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
          const [old] = group.apps.splice(oldIndex, 1);
          group.apps.splice(newIndex, 0, old);
          apis.updateApps(group.apps.map((app, nth) => ({ id: app.id, nth: nth + 1 })));
        }
      }} />}
    </Fragment>
  )}</Observer>
</div>)
const GroupList = SortableContainer(({ local, items }) => {
  return <div className='application'>
    {items.map((group, index) => <GroupItem key={group.id} local={local} group={group} index={index} />)}
  </div>
});

function App() {
  const local = useLocalObservable(() => ({
    showMenu: false,
    showEditApp: false,
    showEditGroup: false,
    showEditEngine: false,
    sort_gid: null,
    show_engine_dialog: false,
    allow_mix: true,
    // temp
    temp_engine: {},
    temp_group: {},
    temp_app: {},

    booted: false,
    defaultEngine: null,
    configs: [],
    config: {},
    groups: [],
    apps: [],
    engines: [],
    remAppById(id) {
      const app = local.apps.find(app => app.id === id);
      if (app) {
        const group = local.groups.find(group => group.id === app.gid);
        if (group) {
          group.apps = group.apps.filter(app => app.id !== id);
        }
      }
      local.apps = local.apps.filter(app => app.id !== id)
    }
  }));
  const [inputing, setInputing] = useState(false);
  const initConfig = useCallback(async () => {
    const resp = await apis.getConfigs();
    if (resp.status === 200 && resp.data.code === 0) {
      local.configs = resp.data.data;
      local.configs.forEach(config => {
        local.config[config.name] = config.value;
      });
      document.querySelector('title').innerText = local.config.title;
    }
  }, []);
  const initEngine = useCallback(async () => {
    const resp4 = await apis.getEngines();
    if (resp4.status === 200 && resp4.data.code === 0) {
      local.engines = resp4.data.data;
      local.defaultEngine = local.engines.find(it => it.name === local.config.engine)
    }
  }, []);
  const initAppGroup = useCallback(async () => {
    const resp2 = await apis.getGroups();
    const resp3 = await apis.getApps();
    if (resp2.status === 200 && resp3.status === 200) {
      const groups = resp2.data.data.map(g => { g.apps = []; return g; });
      const others = { id: '', name: '未分组', fold: true, apps: [] }
      local.apps = resp3.data.data;
      resp3.data.data.forEach(app => {
        const group = groups.find(g => g.id === app.gid);
        if (group) {
          app.nth = group.apps.length;
          group.apps.push(app);
        } else {
          app.nth = others.apps.length;
          others.apps.push(app);
        }
      });
      groups.push(others);
      local.groups = groups;
    }
  }, []);
  const init = useCallback(async () => {
    await initConfig();
    await initEngine();
    await initAppGroup();
  }, []);
  const search = useCallback(async (q) => {
    if (q) {
      const url = local.defaultEngine.url;
      window.open(url.includes('%s') ? url.replace('%s', q) : url + q);
    }
  }, []);
  const deleteGroup = useCallback(async (id) => {
    const resp = await apis.deleteGroup(id);
    if (resp.status === 200 && resp.data.code === 0) {
      await initAppGroup()
    } else if (resp.status !== 200) {
      toast({ content: '请求错误' })
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveGroup = useCallback(async () => {
    const resp = !(local.temp_group.id)
      ? await apis.createGroup({ name: local.temp_group.name, fold: local.temp_group.fold, nth: local.temp_group.nth })
      : await apis.updateGroup(local.temp_group.id, { name: local.temp_group.name, fold: local.temp_group.fold, nth: local.temp_group.nth });
    if (resp.status === 200 && resp.data.code === 0) {
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveEngine = useCallback(async () => {
    const resp = !local.temp_engine.id
      ? await apis.createEngine(local.temp_engine)
      : await apis.updateEngine(local.temp_engine.id, local.temp_engine);
    if (resp.status === 200 && resp.data.code === 0) {
      local.showEditEngine = false;
      await initEngine();
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveApp = useCallback(async () => {
    const resp = !local.temp_app.id
      ? await apis.createApp(local.temp_app)
      : await apis.updateApp(local.temp_app.id, local.temp_app);
    if (resp.status === 200 && resp.data.code === 0) {
      await initAppGroup();
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  useEffectOnce(() => {
    if (!local.booted) {
      local.booted = true;
      local.allow_mix = localStorage.getItem('__panel_allow_mix') ? true : false;
      init();
    }
  });
  return (
    <Observer>{() => (
      <div className="App" style={{ backgroundImage: local.config.background_url ? `url(${local.config.background_url})` : '' }}>
        <div style={{ position: 'relative', width: '100%', height: '5vh' }}>
          <MenuWrap>
            <Icon title="混合url" type={local.allow_mix ? 'allow_mix' : 'not_allow_mix'} onClick={() => {
              local.allow_mix = !local.allow_mix;
              localStorage.setItem('__panel_allow_mix', local.allow_mix)
            }} />
            <Icon title="网络模式" type={local.config.network === 'LAN' ? 'local' : 'network'} size={20} onClick={async () => {
              local.config.network = local.config.network === 'LAN' ? 'WAN' : 'LAN';
              await apis.updateConfig('network', local.config.network);
            }} />
            <Icon title="配置" type={'setting'} size={20} onClick={() => {
              local.showMenu = !local.showMenu;
            }} />
          </MenuWrap>
        </div>
        <div className='title' style={{ backgroundImage: `url("${getRealUrl("/uploads/cf03e199-aa4b-4787-aa44-b479eb008abb.jpg")}")`, color: "transparent" }}>{local.config.title}</div>
        {[1, "1"].includes(local.config.show_search) && <div className='search'>
          <Center style={{ position: 'relative' }}>
            {
              local.defaultEngine && <img src={process.env.PUBLIC_URL + local.defaultEngine.icon} style={{ marginLeft: 20, marginRight: 5, width: 24 }} alt="engine" onClick={() => local.show_engine_dialog = !local.show_engine_dialog} />
            }
            <div id="dialog_engine" style={{ display: local.show_engine_dialog ? 'block' : 'none', position: 'absolute', top: 40, left: 10, padding: '0 10px 10px', borderRadius: 5, backgroundColor: '#575757bf', zIndex: 2 }}>
              {local.engines.map(engine => <img src={process.env.PUBLIC_URL + engine.icon} alt={engine.name} key={engine.name} style={{ width: 24, marginTop: 10 }} onClick={async () => {
                local.defaultEngine = engine;
                local.config.engine = engine.name;
                local.show_engine_dialog = false;
                await apis.updateConfig('engine', engine.name);
                await initConfig();
              }} />)}
              <Center><Icon type={'add'} style={{ marginTop: 10 }} onClick={() => {
                local.temp_engine = {};
                local.showEditEngine = true;
                local.show_engine_dialog = false;
              }} /></Center>
            </div>
          </Center>
          <input id="search" autoComplete='off' placeholder='搜索答案' onCompositionStart={() => {
            setInputing(true);
          }} onCompositionEnd={() => {
            setInputing(false)
          }} onKeyDown={e => {
            if (!inputing && e.key === 'Enter') {
              const q = e.target.value.trim();
              e.target.value = '';
              search(q);
            }
          }} />
          <div style={{ padding: 8, marginRight: 5, cursor: 'pointer' }} onClick={(e) => {
            const elem = document.getElementById('search');
            search(elem.value.trim())
            e.target.value = '';
            elem.value = '';
          }}>
            <Icon type="search" size={20} />
          </div>
        </div>}
        <Group className='group'>
          <GroupList axis="y" lockAxis='y' useDragHandle={true} local={local} items={local.groups} onSortEnd={({ oldIndex, newIndex }) => {
            if (oldIndex !== newIndex && local.groups[oldIndex].id && local.groups[newIndex].id) {
              const [old] = local.groups.splice(oldIndex, 1);
              local.groups.splice(newIndex, 0, old);
              apis.updateGroups(local.groups.filter(g => !!g.id).map((g, nth) => ({ id: g.id, nth: nth + 1 })))
            }
          }} />
        </Group>
        <DialogConfig visible={local.showMenu} engines={local.engines} data={toJS(local.config)} onClose={() => local.showMenu = false} onSave={async (data) => {
          await apis.batchUpdateConfig(data);
          await initConfig();
        }}>
          <FormItem>
            <FormLabel>搜索引擎管理</FormLabel>
            <div style={{ width: 150 }}>
              {local.engines.map(engine => (
                <HoverItem key={engine.name}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getRealUrl(engine.icon)} style={{ width: 20, marginRight: 5 }} alt="engine" />
                    {engine.name}
                  </div>
                  <Icon type="del" size={16} color='#000' onClick={async () => {
                    const resp = await apis.deleteEngine(engine.name);
                    if (resp.status === 200 && resp.data.code === 0) {
                      await initEngine()
                    } else if (resp.status !== 200) {
                      toast({ content: '请求错误' })
                    } else {
                      toast({ content: resp.data.message });
                    }
                  }} />
                </HoverItem>
              ))}
              <Center className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc', borderRadius: 3 }} onClick={() => {
                local.showEditEngine = true;
                local.temp_engine = {};
              }}>
                添加搜索 <Icon type="add" size={16} style={{ fill: '#666', marginLeft: 5 }} />
              </Center>
            </div>
          </FormItem>
          <FormItem>
            <FormLabel>分组管理</FormLabel>
            <div style={{ width: 150 }}>
              {local.groups.map(group => (
                group.id && <HoverItem key={group.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {group.name}
                  </div>
                  <span style={{ display: 'flex', cursor: 'pointer' }} >
                    <Icon type="edit" size={18} onClick={() => { local.temp_group = group; local.showEditGroup = true; }} />
                    <Icon type="del" size={18} color='#333' onClick={deleteGroup} />
                  </span>
                </HoverItem>
              ))}
              <Center className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc', borderRadius: 3 }} onClick={() => {
                local.temp_group = {
                  name: '',
                  nth: local.groups.length + 1,
                  fold: 0,
                };
                local.showEditGroup = true
              }}>
                添加分组<Icon type="add" size={16} style={{ fill: '#666', marginLeft: 5 }} />
              </Center>
            </div>
          </FormItem>
        </DialogConfig>
        <DialogGroup visible={local.showEditGroup} data={local.temp_group} onAdd={(id) => {
          local.temp_app = { gid: id, name: '', desc: '', cover: '', url_lan: '', url_wan: '', open: 1, type: 1 };
          local.showEditApp = true
        }} onClose={() => {
          local.showEditGroup = false;
        }} onSave={onSaveGroup} />
        <DialogApp
          visible={local.showEditApp}
          data={local.temp_app}
          groups={local.groups}
          onClose={() => local.showEditApp = false}
          onSave={onSaveApp}
          afterDelete={() => {
            local.remAppById(local.temp_app.id)
          }}
        />
        <DialogEngine visible={local.showEditEngine} data={local.temp_engine} onClose={() => {
          local.showEditEngine = false;
        }} onSave={onSaveEngine} />
        <div className='footer' dangerouslySetInnerHTML={{ __html: local.config.footer || '' }}></div>
      </div>
    )}</Observer>

  );
}

export default App;
