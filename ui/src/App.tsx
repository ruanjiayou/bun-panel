/* eslint-disable react-hooks/exhaustive-deps */

import './App.css';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import apis from './apis/'
import DialogGroup from './dialog/group.js';
import DialogEngine from './dialog/engine.js';
import DialogApp from './dialog/app.js';
import DialogConfig from './dialog/config.js';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { throttle } from 'lodash';
import UserInfo, { User } from 'user-info';
import { useSnapshot } from 'valtio'
import { store, type IApp, type IEngine, type IGroup } from "@/store";
import { Icon } from './components/index.js'
import { Center } from './components/style.js';
import {
  Group,
  GroupTitle,
  CardWrap,
  Card,
  Cell,
  MenuWrap,
  AppDesc,
  AppIcon,
  AppTitle,
} from './style.js'

function Loading() {
  return <span className="spin" style={{ position: 'absolute', left: '50%', top: '50%', display: 'flex', alignItems: 'center', width: '3rem', height: '3rem', marginLeft: '-1.5rem', marginTop: '-1.5rem' }}>
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="68147" width="100%" height="100%"><path fill="#fff" d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27c40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8z m756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4S687 811.7 646 829c-42.4 17.9-87.4 27-133.9 27s-91.5-9.1-133.9-27c-40.9-17.3-77.7-42.1-109.3-73.8-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47c5.3-4.1 3.5-12.5-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-0.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8 0.1-4.5-3.5-8.2-8-8.2z" p-id="68148"></path></svg>
  </span>
}

const AppItem = SortableElement<{ app: IApp }>(({ app }: { app: IApp }) => {
  const state = useSnapshot(store)
  const url = state.config.network === 'LAN' ? app.url_lan : app.url_wan;
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
      {app.cover && <AppIcon src={app.cover} />}
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
        <div style={{ display: !group.fold ? 'flex' : 'none', cursor: 'pointer', visibility: state.sort_gid === group.id ? 'visible' : undefined }}>
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
  const user = useSnapshot(User)
  const [inputing, setInputing] = useState(false);

  const init = useCallback(async () => {
    store.access_token = user.access_token;
    store.refresh_token = user.refresh_token;
    await store.initConfig();
    await store.initEngine();
    store.initAppGroup();
  }, []);
  const search = useCallback(async (q: string) => {
    if (q) {
      const url = state.defaultEngine!.url;
      window.open(url.includes('%s') ? url.replace('%s', q) : url + q);
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
  useEffect(() => {
    if (user.access_token) {
      init()
    }
  }, [user.access_token])
  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const refresh_token = search.get('refresh_token')
    if (refresh_token) {
      User.setRefreshToken(refresh_token)
      window.location.replace(window.location.origin + window.location.pathname)
    }
  }, [])
  return (
    <div className="App" style={{ backgroundImage: state.config.background_url ? `url(${state.config.background_url})` : '' }}>
      <div className='topnav'>
        <MenuWrap>
          <Icon size={24} title="网络模式" type={state.config.network === 'LAN' ? 'local' : 'network'} onClick={async () => {
            store.config.network = state.config.network === 'LAN' ? 'WAN' : 'LAN';
            await apis.updateConfig('network', state.config.network);
          }} />
          <Icon size={24} title="配置" type={'setting'} onClick={() => {
            store.showMenu = !state.showMenu;
          }} />
          <UserInfo
            afterLogin={() => {
              window.location.reload()
            }}
            afterLogout={() => {
              store.access_token = '';
              store.refresh_token = '';
              window.location.reload()
            }} />
        </MenuWrap>
      </div>
      {state.isRefresh && <div style={{ zIndex: 1000, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#00000080' }}>
        <Loading />
      </div>}
      <div className='title'>
        <div style={{ backgroundColor: '#00000070', borderRadius: 40, display: 'inline-block' }}>
          <div className='bg' style={{
            backgroundImage: `url("/images/panel/cf03e199-aa4b-4787-aa44-b479eb008abb.jpg")`,
          }}>{state.config.title}</div>

        </div>
      </div>
      {
        [1, "1"].includes(state.config.show_search) && <div className='search'>
          <Center style={{ position: 'relative' }} onWheel={(e) => {
            onWheel(e.nativeEvent.deltaY)
          }}>
            {
              state.defaultEngine && <img src={state.defaultEngine.icon} style={{ marginRight: 5, width: 24 }} alt="engine" onClick={() => store.show_engine_dialog = !state.show_engine_dialog} />
            }
            <div id="dialog_engine" style={{ display: state.show_engine_dialog ? 'block' : 'none', position: 'absolute', top: 40, left: 10, padding: '0 10px 10px', borderRadius: 5, backgroundColor: '#575757bf', zIndex: 2 }}>
              {state.engines.map(engine => <img src={engine.icon} alt={engine.name} key={engine.name} style={{ width: 24, marginTop: 10 }} onClick={async () => {
                store.defaultEngine = engine;
                store.config.engine = engine.name;
                store.show_engine_dialog = false;
                await apis.updateConfig('engine', engine.name);
                await store.initConfig();
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
        </div>
      }
      <Group className='group'>
        {state.booted ? (state.groups.length === 0 ? <span>empty</span> : null) : <Loading />}
        <GroupList axis="y" lockAxis='y' items={state.groups.slice() as IGroup[]} useDragHandle={true} onSortEnd={({ oldIndex, newIndex }) => {
          if (oldIndex !== newIndex && state.groups[oldIndex]!.id && state.groups[newIndex]!.id) {
            const [old] = store.groups.splice(oldIndex, 1);
            store.groups.splice(newIndex, 0, old!);
            apis.updateGroups(store.groups.filter(g => !!g.id).map((g, nth) => ({ id: g.id, nth: nth + 1 })))
          }
        }} />
      </Group>
      {state.showMenu && <DialogConfig />}
      {state.showEditGroup && <DialogGroup />}
      {state.showEditApp && <DialogApp />}
      {state.showEditEngine && <DialogEngine />}
      <div className='footer' dangerouslySetInnerHTML={{ __html: state.config.footer || '' }}></div>
    </div >
  )
}

export default App;
