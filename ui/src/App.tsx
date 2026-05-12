/* eslint-disable react-hooks/exhaustive-deps */

import './App.css';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import apis from './apis/'
import DialogGroup from './dialog/group.js';
import DialogEngine from './dialog/engine.js';
import { Icon, toast } from './components/index.js'
import { FormItem, FormLabel, Center } from './components/style.js';
import DialogApp from './dialog/app.js';
import DialogConfig from './dialog/config.js';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import getRealUrl from './utils/realImageUrl.js';
import { omit, throttle } from 'lodash';
import UserInfo, { User } from 'user-info';
import { proxy, useSnapshot } from 'valtio'
import { store, type IApp, type IEngine, type IGroup } from "@/store";
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

const AppItem = SortableElement<{ app: IApp }>(({ app }: { app: IApp }) => {
  const state = useSnapshot(store)
  const url = state.allow_mix ? (state.config.network === 'LAN' ? app.url_lan || app.url_wan : app.url_wan || app.url_lan) : (state.config.network === 'LAN' ? app.url_lan : app.url_wan);
  return <Cell key={app.id}
    className={`cell ${(state.sort_gid === app.gid || !url) ? '' : 'spin-colorful'} ${!url ? ' disabled' : ''}`}
    onMouseDown={e => {
      if (state.sort_gid === app.gid) {
        // sort
      } else {
        // click
        e.stopPropagation();
      }
    }}
    onContextMenu={(e) => {
      e.stopPropagation();
      e.preventDefault();
      store.temp_app = app;
      store.showEditApp = true;
    }}
  >
    <Card
      style={{ alignItems: app.cover ? 'left' : 'center', justifyContent: app.cover ? 'left' : 'center', backgroundColor: state.sort_gid === app.gid ? '#b0b9be82' : '', cursor: state.sort_gid === app.gid ? 'all-scroll' : '' }}
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

const AppList = SortableContainer<{ items: IApp[] }>(({ items }: { items: IApp[] }) => {
  const state = useSnapshot(store)
  return <CardWrap>
    {items.map((item, index) => <AppItem key={item.id} disabled={state.sort_gid !== item.gid} index={index} app={item} />)}
  </CardWrap>
});
const GroupHandle = SortableHandle<{ group: IGroup }>(({ group }: { group: IGroup }) => (
  <span onContextMenu={e => {
    e.stopPropagation();
    e.preventDefault();
    store.temp_group = group;
    store.showEditGroup = true;
  }}>{group.name}</span>
))
const GroupItem = SortableElement<{ group: IGroup }>(({ group }: { group: IGroup }) => {
  const state = useSnapshot(store)
  return (<div key={group.id} >
    <Fragment>
      <GroupTitle>
        <GroupHandle group={group} />
        <div style={{ display: group.id ? 'flex' : 'none', cursor: 'pointer', visibility: state.sort_gid === group.id ? 'visible' : 'hidden' }}>
          <Icon type={'sort'} size={24} style={{ marginLeft: 5, marginTop: -2, fill: state.sort_gid === group.id ? '#00aaff' : 'white' }} onClick={() => {
            store.sort_gid = state.sort_gid === group.id ? '' : group.id;
          }} />
        </div>
      </GroupTitle>
      {group.fold === 0 && <AppList axis="xy" items={group.apps!} onSortEnd={({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
          const [old] = group.apps!.splice(oldIndex, 1);
          group.apps!.splice(newIndex, 0, old!);
          apis.updateApps(group.apps!.map((app, nth) => ({ id: app.id, nth: nth + 1 })));
        }
      }} />}
    </Fragment>
  </div>)
})
const GroupList = SortableContainer<{ items: IGroup[] }>(({ items }: { items: IGroup[] }) => {
  return <div className='application'>
    {items.map((group, index) => <GroupItem key={group.id} group={group} index={index} />)}
  </div>
});
function App() {
  const state = useSnapshot(store)
  const [inputing, setInputing] = useState(false);
  const initConfig = useCallback(async () => {
    const resp = await apis.getConfigs();
    if (resp.code === 0) {
      resp.data.forEach(config => {
        const name = config.name as string;
        store.config[name] = config.value as string;
      });
      store.configs = resp.data;
      document.querySelector('title')!.innerText = state.config.title;
    }
  }, []);
  const initEngine = useCallback(async () => {
    const resp4 = await apis.getEngines();
    if (resp4.code === 0) {
      store.engines = resp4.data;
      store.engines.forEach((v, idx) => v.id = idx)
      store.defaultEngine = store.engines.find(it => it.name === store.config.engine)
    }
  }, []);
  const initAppGroup = useCallback(async () => {
    const resp2 = await apis.getGroups();
    const resp3 = await apis.getApps();
    if (resp2.code === 0 && resp3.code === 0) {
      const groups = resp2.data.map((g: IGroup) => { g.apps = []; return g; });
      const others: IGroup = { id: '', name: '未分组', fold: 1, nth: 0, apps: [] }
      store.apps = resp3.data;
      resp3.data.forEach(app => {
        const group = groups.find((g: IGroup) => g.id === app.gid);
        if (group) {
          app.nth = group.apps.length;
          group.apps.push(app);
        } else {
          app.nth = others.apps!.length;
          others.apps!.push(app);
        }
      });
      groups.push(others);
      store.groups = groups;
    }
  }, []);
  const init = useCallback(async () => {
    await initConfig();
    await initEngine();
    await initAppGroup();
  }, []);
  const search = useCallback(async (q: string) => {
    if (q) {
      const url = state.defaultEngine!.url;
      window.open(url.includes('%s') ? url.replace('%s', q) : url + q);
    }
  }, []);
  const deleteGroup = useCallback(async (id: string) => {
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
    const resp = !(state.temp_group.id)
      ? await apis.createGroup({ name: state.temp_group.name, fold: state.temp_group.fold, nth: state.temp_group.nth })
      : await apis.updateGroup(state.temp_group.id, { name: state.temp_group.name, fold: state.temp_group.fold, nth: state.temp_group.nth });
    if (resp.status === 200 && resp.data.code === 0) {
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveEngine = useCallback(async () => {
    const resp = !state.temp_engine.id
      ? await apis.createEngine(state.temp_engine)
      : await apis.updateEngine(state.temp_engine.name!, omit(state.temp_engine, ['id']));
    if (resp.status === 200 && resp.data.code === 0) {
      store.showEditEngine = false;
      await initEngine();
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveApp = useCallback(async () => {
    const resp = !state.temp_app.id
      ? await apis.createApp(state.temp_app)
      : await apis.updateApp(state.temp_app.id, state.temp_app);
    if (resp.status === 200 && resp.data.code === 0) {
      await initAppGroup();
      toast({ content: '操作成功' });
    } else if (resp.status !== 200) {
      toast({ content: '请求失败' });
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onWheel = useMemo(() => {
    return throttle(offset => {
      let index = -1;
      if (state.defaultEngine) {
        index = state.engines.findIndex(v => v.name === state.defaultEngine?.name);
      }
      if (index !== -1 && state.engines.length !== 0) {
        index += offset > 0 ? 1 : -1;
        if (state.engines[index]) {
          store.defaultEngine = state.engines[index]
        } else if (index === -1) {
          store.defaultEngine = state.engines[state.engines.length - 1]
        } else if (index === state.engines.length) {
          store.defaultEngine = state.engines[0]
        }
      }
    }, 100)
  }, [])
  useEffectOnce(() => {
    if (!state.booted) {
      store.booted = true;
      store.allow_mix = localStorage.getItem('__panel_allow_mix') ? true : false;
      init();
    }
  });
  return (
    <div className="App" style={{ backgroundImage: state.config.background_url ? `url(${getRealUrl(state.config.background_url)})` : '' }}>
      <div className='topnav'>
        <MenuWrap>
          <Icon title="混合url" type={state.allow_mix ? 'allow_mix' : 'not_allow_mix'} onClick={() => {
            store.allow_mix = !state.allow_mix;
            localStorage.setItem('__panel_allow_mix', state.allow_mix ? '1' : '0')
          }} />
          <Icon title="网络模式" type={state.config.network === 'LAN' ? 'local' : 'network'} size={20} onClick={async () => {
            store.config.network = state.config.network === 'LAN' ? 'WAN' : 'LAN';
            await apis.updateConfig('network', state.config.network);
          }} />
          <Icon title="配置" type={'setting'} size={20} onClick={() => {
            store.showMenu = !state.showMenu;
          }} />
          <UserInfo onLogout={() => {

          }} />
        </MenuWrap>
      </div>
      <div className='title'>
        <div style={{ backgroundImage: `url("${getRealUrl("/uploads/cf03e199-aa4b-4787-aa44-b479eb008abb.jpg")}")`, color: "transparent" }}>{state.config.title}</div>
      </div>
      {[1, "1"].includes(state.config.show_search) && <div className='search'>
        <Center style={{ position: 'relative' }} onWheel={(e) => {
          onWheel(e.nativeEvent.deltaY)
        }}>
          {
            state.defaultEngine && <img src={process.env.PUBLIC_URL + state.defaultEngine.icon} style={{ marginRight: 5, width: 24 }} alt="engine" onClick={() => store.show_engine_dialog = !state.show_engine_dialog} />
          }
          <div id="dialog_engine" style={{ display: state.show_engine_dialog ? 'block' : 'none', position: 'absolute', top: 40, left: 10, padding: '0 10px 10px', borderRadius: 5, backgroundColor: '#575757bf', zIndex: 2 }}>
            {state.engines.map(engine => <img src={process.env.PUBLIC_URL + engine.icon} alt={engine.name} key={engine.name} style={{ width: 24, marginTop: 10 }} onClick={async () => {
              store.defaultEngine = engine;
              store.config.engine = engine.name;
              store.show_engine_dialog = false;
              await apis.updateConfig('engine', engine.name);
              await initConfig();
            }} />)}
            <Center><Icon type={'add'} style={{ marginTop: 10 }} onClick={() => {
              store.temp_engine = {} as IEngine;
              store.showEditEngine = true;
              store.show_engine_dialog = false;
            }} /></Center>
          </div>
        </Center>
        <input id="search" autoComplete='off' placeholder='搜索答案' onCompositionStart={() => {
          setInputing(true);
        }} onCompositionEnd={() => {
          setInputing(false)
        }} onKeyDown={e => {
          if (!inputing && e.key === 'Enter') {
            const q = e.currentTarget.value.trim();
            e.currentTarget.value = '';
            search(q);
          }
        }} />
        <div style={{ padding: 8, marginRight: 5, cursor: 'pointer' }} onClick={(e) => {
          const elem = document.getElementById('search') as HTMLInputElement;
          search(elem.value.trim())
          elem.value = '';
        }}>
          <Icon type="search" size={20} />
        </div>
      </div>}
      <Group className='group'>
        <GroupList axis="y" lockAxis='y' items={store.groups} useDragHandle={true} onSortEnd={({ oldIndex, newIndex }) => {
          if (oldIndex !== newIndex && state.groups[oldIndex]!.id && state.groups[newIndex]!.id) {
            const [old] = store.groups.splice(oldIndex, 1);
            store.groups.splice(newIndex, 0, old!);
            apis.updateGroups(state.groups.filter(g => !!g.id).map((g, nth) => ({ id: g.id, nth: nth + 1 })))
          }
        }} />
      </Group>
      <DialogConfig visible={state.showMenu} onClose={() => store.showMenu = false} onSave={async (data: any) => {
        await apis.batchUpdateConfig(data);
        await initConfig();
      }}>
        <FormItem>
          <FormLabel>搜索引擎管理</FormLabel>
          <div style={{ width: 150 }}>
            {state.engines.map(engine => (
              <HoverItem key={engine.name}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <img src={getRealUrl(engine.icon)} style={{ width: 20, marginRight: 5 }} alt="engine" />
                  {engine.name}
                </div>
                <Icon type="edit" size={18} onClick={() => { store.temp_engine = engine; store.showEditEngine = true; }} />
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
              store.showEditEngine = true;
              store.temp_engine = {} as IEngine;
            }}>
              添加搜索 <Icon type="add" size={16} style={{ fill: '#666', marginLeft: 5 }} />
            </Center>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>分组管理</FormLabel>
          <div style={{ width: 150 }}>
            {state.groups.map(group => (
              group.id && <HoverItem key={group.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {group.name}
                </div>
                <span style={{ display: 'flex', cursor: 'pointer' }} >
                  <Icon type="edit" size={18} onClick={() => { store.temp_group = group as IGroup; store.showEditGroup = true; }} />
                  <Icon type="del" size={18} color='#333' onClick={deleteGroup} />
                </span>
              </HoverItem>
            ))}
            <Center className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc', borderRadius: 3 }} onClick={() => {
              store.temp_group = {
                name: '',
                nth: state.groups.length + 1,
                fold: 0,
              };
              store.showEditGroup = true
            }}>
              添加分组<Icon type="add" size={16} style={{ fill: '#666', marginLeft: 5 }} />
            </Center>
          </div>
        </FormItem>
      </DialogConfig>
      <DialogGroup visible={state.showEditGroup} onAdd={(id: string) => {
        store.temp_app = { gid: id, name: '', desc: '', cover: '', url_lan: '', url_wan: '', open: 1, type: 1 };
        store.showEditApp = true
      }} onClose={() => {
        store.showEditGroup = false;
      }} onSave={onSaveGroup} />
      <DialogApp
        visible={state.showEditApp}
        onClose={() => store.showEditApp = false}
        onSave={onSaveApp}
        afterDelete={() => {
          store.remAppById(state.temp_app.id!)
        }}
      />
      <DialogEngine visible={state.showEditEngine} data={state.temp_engine} onClose={() => {
        store.showEditEngine = false;
      }} onSave={onSaveEngine} />
      <div className='footer' dangerouslySetInnerHTML={{ __html: state.config.footer || '' }}></div>
    </div>
  )
}

export default App;
