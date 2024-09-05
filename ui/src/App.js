import logo from './logo.svg';
import menu from './assets/menu.svg';
import wan from './assets/wan.svg';
import lan from './assets/lan.svg';
import add from './assets/add.svg';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useLocalStore, Observer } from "mobx-react-lite"
import './App.css';
import apis from './apis'
import styled from 'styled-components';
import Modal from './components/Modal/index.js';
import { FullWidth } from './components/style.js';
import toast from './components/Toast/index.js';
import Select from './components/Select/index.js';
import FileUploader from './components/Upload/index.js';

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
`
const Card = styled.a`
  background-color: #3333338a;
  display: flex;
  flex-direction: row;
  min-height: 50px;
  min-width: 200px;
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
`
const AppTitle = styled.div`
  font-size: 16px;
`
const AppDesc = styled.div`
  font-size: 14px;
`
const FormItem = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
`
const FormItemLabel = styled.div`
  width: 150px;
  text-align: right;
  padding-right: 10px;
`
function App() {
  const local = useLocalStore(() => ({
    showMenu: false,
    showCreateApp: false,
    showCreateGroup: false,
    showCreateEngine: false,
    // temp
    app_icon: '',
    app_open: 1,
    app_gid: '',
    booted: false,
    defaultEngine: null,
    configs: [],
    config: {},
    groups: [],
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
    await initEngine();
    if (resp.status === 200 && resp.data.code === 0) {
      local.configs = resp.data.data;
      local.configs.forEach(config => {
        local.config[config.name] = config.value;
      });
    }

    if (resp2.status === 200 && resp3.status === 200) {
      const groups = resp2.data.data.map(g => { g.apps = []; return g; });
      resp3.data.data.forEach(app => {
        const group = groups.find(g => g.id === app.gid);
        if (group) {
          group.apps.push(app);
        }
      });
      local.groups = groups;
    }
  }, []);
  const search = useCallback(async (q) => {
    const url = local.defaultEngine.url;
    window.open(url.includes('%s') ? url.replace('%s', q) : url + q);
  }, []);
  useEffectOnce(() => {
    if (!local.booted) {
      local.booted = true;
      init();
    }
  });
  return (
    <Observer>{() => (
      <div className="App">
        <div style={{ position: 'relative', width: '100%', height: '5vh' }}>
          <MenuWrap>
            <img src={local.config.network === 'WAN' ? wan : lan} alt="memu" style={{ width: 20 }} />
            <img src={menu} alt="memu" style={{ width: 20 }} onClick={() => {
              local.showMenu = !local.showMenu;
            }} />
          </MenuWrap>
        </div>
        <Modal title={"配置"} visible={local.showMenu} onClose={() => local.showMenu = false}>
          <div style={{ marginLeft: 20 }}>
            <FormItem>
              <FormItemLabel>系统名称</FormItemLabel>
              <input value={local.config.title} />
            </FormItem>
            <FormItem>
              <FormItemLabel>网络模式</FormItemLabel>
              <div>
                <Select value={local.config.network} items={[{ value: 'WAN', title: '公网' }, { value: 'LAN', title: '内网' }]} onChange={v => local.config.network = v}></Select>
              </div>
            </FormItem>
            <FormItem>
              <FormItemLabel>显示搜索引擎</FormItemLabel>
              <div>~</div>
            </FormItem>
            <FormItem>
              <FormItemLabel>自定义页脚</FormItemLabel>
              <textarea></textarea>
            </FormItem>
            <FormItem>
              <FormItemLabel>壁纸设置</FormItemLabel>
              <input />
            </FormItem>
            <FormItem>
              <FormItemLabel>搜索引擎管理</FormItemLabel>
              <div style={{ width: 150 }}>
                {local.engines.map(engine => (
                  <div key={engine.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={engine.icon} style={{ width: 20, marginRight: 5 }} alt="engine" />
                      {engine.name}
                    </div>
                    <span style={{ display: 'flex', cursor: 'pointer' }} onClick={async () => {
                      const resp = await apis.deleteEngine(engine.name);
                      if (resp.status === 200 && resp.data.code === 0) {
                        await initEngine()
                      } else if (resp.status !== 200) {
                        toast({ content: '请求错误' })
                      } else {
                        toast({ content: resp.data.message });
                      }
                    }}>
                      <svg t="1725512054089" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="67166" width="20" height="20"><path d="M704 96c33.728 0 61.376 26.016 63.84 59.04l0.16 4.768V253.12l128 0.032v63.808h-64v515.328a95.84 95.84 0 0 1-90.368 95.552L736 928H288c-53.024 0-96-42.848-96-95.68V316.928H128V253.152h128V159.776c0-33.632 26.112-61.184 59.2-63.648L320 96h384z m64 220.96H256v515.328c0 16.384 12.352 29.856 28.256 31.68l3.744 0.224h448c17.664 0 32-14.272 32-31.904V316.96z m-320 95.68v319.04h-64v-319.04h64z m192 0v319.04h-64v-319.04h64z m64-252.832H320V253.12h384V159.808z" fill="#ccc" p-id="67167"></path></svg>
                    </span>
                  </div>
                ))}
                <FullWidth className="pointer" style={{ padding: 3, marginTop: 5, border: '1px dashed #ccc' }} onClick={() => local.showCreateEngine = true}>
                  添加搜索<img src={add} alt="add" style={{ marginLeft: 10, width: 18 }} />
                </FullWidth>
              </div>
            </FormItem>
            <FormItem>
              <FormItemLabel>分组管理</FormItemLabel>
              {local.groups.map(group => (
                <div key={group.id}>{group.name}</div>
              ))}
            </FormItem>
          </div>
        </Modal>
        <div className='title'>{local.config.title}</div>
        {local.config.show_search && <div className='search'>
          <div>{local.defaultEngine && <img src={local.defaultEngine.icon} style={{ marginLeft: 15, width: 24 }} alt="engine" />}</div>
          <input id="search" onCompositionStart={() => {
            setInputing(true);
          }} onCompositionEnd={() => {
            setInputing(false)
          }} onKeyDown={e => {
            if (!inputing && e.key === 'Enter') {
              const q = e.target.value.trim();
              search(q);
            }
          }} />
          <div style={{ paddingRight: 10, cursor: 'pointer' }} onClick={() => {
            const elem = document.getElementById('search');
            search(elem.value.trim())
            elem.value = '';
          }}>
            <svg t="1725504793935" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37084" width="24" height="24"><path d="M975.474921 917.123519l-152.442347-152.502577c150.575215-165.512276 146.419339-421.550372-13.431309-581.40102a421.610602 421.610602 0 0 0-596.217622 596.277851c138.890578 138.890578 350.47887 160.151799 512.136422 64.626882l161.47686 161.537091a62.518829 62.518829 0 1 0 88.477996-88.538227z m-251.038998-222.851318a301.15043 301.15043 0 0 1-425.886938 0 301.15043 301.15043 0 0 1 0-425.886938 301.15043 301.15043 0 1 1 425.886938 425.886938z" p-id="37085" fill='#d4d4d4'></path></svg>
          </div>
        </div>}
        <div className='application'>
          {local.groups.map(group => {
            return <Group key={group.id}>
              <GroupTitle>
                {group.name}
                <div style={{ display: 'flex', marginLeft: 20, cursor: 'pointer' }} onClick={() => {
                  local.app_gid = group.id;
                  local.showCreateApp = true
                }}>
                  <svg t="1725508512494" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="66160" width="20" height="20"><path d="M588.8 435.2h358.4a76.8 76.8 0 1 1 0 153.6h-358.4v358.4a76.8 76.8 0 1 1-153.6 0v-358.4h-358.4a76.8 76.8 0 1 1 0-153.6h358.4v-358.4a76.8 76.8 0 1 1 153.6 0v358.4z" fill="#ccc" p-id="66161"></path></svg>
                </div>
              </GroupTitle>
              <CardWrap>
                {group.apps.map(app => {
                  return <Card key={app.id}
                    style={{ alignItems: app.cover ? 'left' : 'center', justifyContent: app.cover ? 'left' : 'center' }}
                    target={app.open === 1 ? '_blank' : '_self'}
                    href={local.config.net_mode === 'local' ? app.url_internal || app.url : app.url}>
                    {app.cover && <AppIcon src={app.cover} />}
                    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: app.cover ? 'left' : 'center', justifyContent: app.desc ? 'space-around' : 'center' }}>
                      <AppTitle>{app.name}</AppTitle>
                      <AppDesc>{app.desc}</AppDesc>
                    </div>
                  </Card>
                })}
              </CardWrap>

            </Group>
          })}
        </div>
        <Modal title={"添加应用"} visible={local.showCreateApp} onClose={() => local.showCreateApp = false} onSave={async () => {
          const url_wan = document.getElementById('app_url_wan').value.trim();
          const url_lan = document.getElementById('app_url_lan').value.trim();
          const name = document.getElementById('app_name').value.trim();
          const desc = document.getElementById('app_desc').value.trim();
          const resp = await apis.createApp({ name, desc, url_lan, url_wan, type: 1, open: local.app_open, cover: local.app_icon, gid: local.app_gid });
          if (resp.status === 200 && resp.data.code === 0) {
            local.showCreateApp = false;
            toast({ content: '添加成功' });
            init();
          } else if (resp.status !== 200) {
            toast({ content: '请求失败' });
          } else {
            toast({ content: resp.data.message });
          }
        }}>
          <div style={{ marginLeft: 20 }}>
            <FormItem>
              <FormItemLabel>名称</FormItemLabel>
              <input id="app_name" />
            </FormItem>
            <FormItem>
              <FormItemLabel>描述</FormItemLabel>
              <input id="app_desc" />
            </FormItem>
            <FormItem>
              <FormItemLabel>图标</FormItemLabel>
              <div>
                <FileUploader id="app_image" value={local.app_icon} onUpload={resp => {
                  if (resp.status === 200 && resp.data.code === 0) {
                    local.app_icon = resp.data.data.filepath;
                  }
                }} />
              </div>
            </FormItem>
            <FormItem>
              <FormItemLabel>分组</FormItemLabel>
              <Select value={local.app_gid} items={local.groups.map(g => ({ value: g.id, title: g.name }))} onChange={v => {
                local.app_gid = v;
              }}></Select>
            </FormItem>
            <FormItem>
              <FormItemLabel>打开方式</FormItemLabel>
              <Select value={local.app_open} items={[{ value: 1, title: '_blank' }, { value: 2, title: '_self' }]} onChange={(v) => {
                local.app_open = v;
              }}></Select>
            </FormItem>
            <FormItem>
              <FormItemLabel>地址</FormItemLabel>
              <input id="app_url_wan" />
            </FormItem>
            <FormItem>
              <FormItemLabel>内网地址</FormItemLabel>
              <input id="app_url_lan" />
            </FormItem>
          </div>
        </Modal>
        <Modal title="添加分组" visible={local.showCreateGroup} onClose={() => local.showCreateGroup = false}>
          <div style={{ marginLeft: 20 }}>
            <FormItem>
              <FormItemLabel>分组名称</FormItemLabel>
              <input />
            </FormItem>
          </div>
        </Modal>

        <Modal title="添加搜索引擎" visible={local.showCreateEngine} onClose={() => local.showCreateEngine = false} onSave={async () => {
          const name = document.getElementById('engine_name').value.trim();
          const title = document.getElementById('engine_title').value.trim();
          const icon = document.getElementById('engine_icon').value.trim();
          const url = document.getElementById('engine_url').value.trim();
          const resp = await apis.createEngine({ name, title, icon, url });
          if (resp.status === 200 && resp.data.code === 0) {
            local.showCreateEngine = false;
            toast({ content: '添加成功' });
          } else if (resp.status !== 200) {
            toast({ content: '请求失败' });
          } else {
            toast({ content: resp.data.message });
          }
        }}>
          <div style={{ marginLeft: 50 }}>
            <FormItem>
              <FormItemLabel>标志</FormItemLabel>
              <input id="engine_name" />
            </FormItem>
            <FormItem>
              <FormItemLabel>名称</FormItemLabel>
              <input id="engine_title" />
            </FormItem>
            <FormItem>
              <FormItemLabel>图标</FormItemLabel>
              <input id="engine_icon" />
            </FormItem>
            <FormItem>
              <FormItemLabel>url</FormItemLabel>
              <input id="engine_url" />
            </FormItem>
          </div>
        </Modal>
        <div className='footer' dangerouslySetInnerHTML={{ __html: local.config.footer || '' }}></div>
      </div>
    )}</Observer>

  );
}

export default App;
