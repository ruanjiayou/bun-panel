/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useLocalStore, Observer } from "mobx-react-lite"
import apis from './apis'
import styled from 'styled-components';
import DialogGroup from './dialog/group.js';
import DialogEngine from './dialog/engine.js';
import { Icon, toast } from './components/index.js'
import { FormItem, FormLabel, AlignAside, Center } from './components/style.js';
import DialogApp from './dialog/app.js';
import DialogApps from './dialog/apps.js';
import DialogConfig from './dialog/config.js';
import { toJS } from 'mobx';

const MenuWrap = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  background-color: #3333337d;
  padding: 8px;
  border-radius: 5px;
`
const Group = styled.div`
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
`
const GroupTitle = styled.div`
  color: white;
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
`
const CardWrap = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  row-gap: 10px;
  flex-flow: wrap;
`
const Card = styled.a`
  background-color: #3333338a;
  display: flex;
  flex-direction: row;
  min-height: 50px;
  min-width: 210px;
  color: white;
  border-radius: 10px;
  padding: 10px;
  text-decoration: none;
  &:hover {
    color: white;
    box-shadow: #666 0px 0px 15px 3px;
    cursor: pointer;
  }
`
const AppIcon = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 15px 0 10px;
  border-radius:10px;
`
const AppTitle = styled.div`
  font-size: 16px;
`
const AppDesc = styled.div`
  font-size: 14px;
`

function App() {
  const local = useLocalStore(() => ({
    showMenu: false,
    showEditApp: false,
    showEditApps: false,
    showEditGroup: false,
    showEditEngine: false,
    // temp
    temp_engine: {},
    temp_group: {},
    temp_app: {},

    drag_id: '',

    booted: false,
    defaultEngine: null,
    configs: [],
    config: {},
    groups: [],
    apps: [],
    engines: [],
  }));
  const [inputing, setInputing] = useState(false);
  const initEngine = useCallback(async () => {
    const resp4 = await apis.getEngines();
    if (resp4.status === 200 && resp4.data.code === 0) {
      local.engines = resp4.data.data;
      local.defaultEngine = local.engines.find(it => it.name === local.config.engine)
    }
  }, []);
  const init = useCallback(async () => {
    const resp = await apis.getConfigs();
    const resp2 = await apis.getGroups();
    const resp3 = await apis.getApps();
    if (resp.status === 200 && resp.data.code === 0) {
      local.configs = resp.data.data;
      local.configs.forEach(config => {
        local.config[config.name] = config.value;
      });
    }
    await initEngine();
    if (resp2.status === 200 && resp3.status === 200) {
      const groups = resp2.data.data.map(g => { g.apps = []; return g; });
      const others = { id: '', name: '未分组', fold: true, apps: [] }
      local.apps = resp3.data.data;
      resp3.data.data.forEach(app => {
        const group = groups.find(g => g.id === app.gid);
        if (group) {
          group.apps.push(app);
        } else {
          others.apps.push(app);
        }
      });
      groups.push(others);
      local.groups = groups;
    }
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
      await init()
    } else if (resp.status !== 200) {
      toast({ content: '请求错误' })
    } else {
      toast({ content: resp.data.message });
    }
  }, []);
  const onSaveGroup = useCallback(async () => {
    const resp = !(local.temp_group.id)
      ? await apis.createGroup({ name: local.temp_group.name, fold: local.temp_group.fold, nth: local.temp_group.nth })
      : await apis.updateGroup(local.temp_group.id, local.temp_group);
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
      await init();
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
      init();
    }
  });
  return (
    <Observer>{() => (
      <div className="App" style={{ backgroundImage: local.config.background_url ? `url(${local.config.background_url})` : '' }}>
        <div style={{ position: 'relative', width: '100%', height: '5vh' }}>
          <MenuWrap onDropCapture={e => {
            console.log(e)
          }}>
            <Icon type={'del'} size={24} onClick={() => local.showEditApps = true} />
            <Icon type={local.config.network === 'LAN' ? 'lan' : 'wan'} size={24} onClick={async () => {
              local.config.network = local.config.network === 'LAN' ? 'WAN' : 'LAN';
              await apis.updateConfig('network', local.config.network);
            }} />
            <Icon type={'menu'} size={20} onClick={() => {
              local.showMenu = !local.showMenu;
            }} />
          </MenuWrap>
        </div>
        <div className='title'>{local.config.title}</div>
        {[1, "1"].includes(local.config.show_search) && <div className='search'>
          <Center>{local.defaultEngine && <img src={local.defaultEngine.icon} style={{ marginLeft: 20, marginRight: 5, width: 24 }} alt="engine" />}</Center>
          <input id="search" autoComplete='off' placeholder='搜索答案' onCompositionStart={() => {
            setInputing(true);
          }} onCompositionEnd={() => {
            setInputing(false)
          }} onKeyDown={e => {
            if (!inputing && e.key === 'Enter') {
              const q = e.target.value.trim();
              search(q);
            }
          }} />
          <div style={{ padding: 8, marginRight: 5, cursor: 'pointer' }} onClick={() => {
            const elem = document.getElementById('search');
            search(elem.value.trim())
            elem.value = '';
          }}>
            <Icon type="search" size={20} />
          </div>
        </div>}
        <div className='application'>
          {local.groups.map(group => {
            return group.apps.length !== 0 && <Group key={group.id}>
              <GroupTitle>
                {group.name}
                <div style={{ display: group.id ? 'flex' : 'none', marginLeft: 20, cursor: 'pointer', }} onClick={() => {
                  local.temp_app = { gid: group.id, name: '', desc: '', cover: '', url_lan: '', url_wan: '', open: 1, type: 1 };
                  local.showEditApp = true
                }}>
                  <Icon type={"add"} style={{ fill: 'white' }} />
                </div>
              </GroupTitle>
              <CardWrap>
                {group.apps.map(app => {
                  return <Card key={app.id}
                    onDragStart={() => {
                      local.drag_id = app.id;
                    }}
                    draggable
                    style={{ alignItems: app.cover ? 'left' : 'center', justifyContent: app.cover ? 'left' : 'center' }}
                    target={app.open === 1 ? '_blank' : '_self'}
                    href={local.config.network === 'LAN' ? app.url_lan || app.url_wan : app.url_wan}
                    onContextMenu={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      local.temp_app = app;
                      local.showEditApp = true;
                    }}
                  >
                    {app.cover && <AppIcon src={app.cover} />}
                    <div style={{ display: 'flex', width: 120, height: '100%', flexDirection: 'column', alignItems: app.cover ? 'left' : 'center', justifyContent: app.desc ? 'space-around' : 'center' }}>
                      <AppTitle>{app.name}</AppTitle>
                      <AppDesc title={app.desc}>{app.desc}</AppDesc>
                    </div>
                  </Card>
                })}
              </CardWrap>

            </Group>
          })}
        </div>
        <DialogConfig visible={local.showMenu} engines={local.engines} data={toJS(local.config)} onClose={() => local.showMenu = false} onSave={async (data) => {
          await apis.batchUpdateConfig(data);
          await init();
        }}>
          <FormItem>
            <FormLabel>搜索引擎管理</FormLabel>
            <div style={{ width: 150 }}>
              {local.engines.map(engine => (
                <AlignAside key={engine.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={engine.icon} style={{ width: 20, marginRight: 5 }} alt="engine" />
                    {engine.name}
                  </div>
                  <Icon type="del" size={16} onClick={async () => {
                    const resp = await apis.deleteEngine(engine.name);
                    if (resp.status === 200 && resp.data.code === 0) {
                      await initEngine()
                    } else if (resp.status !== 200) {
                      toast({ content: '请求错误' })
                    } else {
                      toast({ content: resp.data.message });
                    }
                  }} />
                </AlignAside>
              ))}
              <Center className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc' }} onClick={() => {
                local.showEditEngine = true;
                local.temp_engine = {};
              }}>
                添加搜索 <Icon type="add" size={16} style={{ marginLeft: 5 }} />
              </Center>
            </div>
          </FormItem>
          <FormItem>
            <FormLabel>分组管理</FormLabel>
            <div style={{ width: 150 }}>
              {local.groups.map(group => (
                group.id && <AlignAside key={group.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {group.name}
                  </div>
                  <span style={{ display: 'flex', cursor: 'pointer' }} >
                    <Icon type="edit" size={18} onClick={() => { local.temp_group = group; local.showEditGroup = true; }} />
                    <Icon type="del" size={18} onClick={deleteGroup} />
                  </span>
                </AlignAside>
              ))}
              <Center className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc' }} onClick={() => {
                local.temp_group = {
                  name: '',
                  nth: local.groups.length + 1,
                  fold: false,
                };
                local.showEditGroup = true
              }}>
                添加分组<Icon type="add" size={16} style={{ marginLeft: 5 }} />
              </Center>
            </div>
          </FormItem>
        </DialogConfig>
        <DialogApp
          visible={local.showEditApp}
          data={local.temp_app}
          groups={local.groups}
          onClose={() => local.showEditApp = false}
          onSave={onSaveApp}
        />
        <DialogApps visible={local.showEditApps} onClose={() => local.showEditApps = false} apps={local.apps} onSave={async () => {
          await init();
        }} />
        <DialogGroup visible={local.showEditGroup} data={local.temp_group} onClose={() => {
          local.showEditGroup = false;
        }} onSave={onSaveGroup} />
        <DialogEngine visible={local.showEditEngine} data={local.temp_engine} onClose={() => {
          local.showEditEngine = false;
        }} onSave={onSaveEngine} />
        <div className='footer' dangerouslySetInnerHTML={{ __html: local.config.footer || '' }}></div>
      </div>
    )}</Observer>

  );
}

export default App;
