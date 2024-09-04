import logo from './logo.svg';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { observer, useLocalStore, Observer } from "mobx-react-lite"
import './App.css';
import apis from './apis'
import styled from 'styled-components';

const Group = styled.div`
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
`
const GroupTitle = styled.div`
  color: white;
  margin: 20px 0;
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

function App() {
  const local = useLocalStore(() => ({
    booted: false,
    configs: [],
    config: {},
    groups: [],
  }));
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
    if (resp2.status === 200 && resp3.status === 200) {
      const groups = resp2.data.data.map(g => { g.apps = []; return g; });
      resp3.data.data.forEach(app => {
        const group = groups.find(g => g.id === app.gid);
        if (group) {
          group.apps.push(app);
        }
      });
      local.groups = groups;
      console.log(groups)
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
      <div className="App">
        <div style={{ height: '5vh' }}>

        </div>
        <div className='title'>{local.config.title}</div>
        {local.config.show_search && <div className='search'>
          <input />
        </div>}
        <div className='application'>
          {local.groups.map(group => {
            return <Group key={group.id}>
              <GroupTitle>{group.name}</GroupTitle>
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
        <div className='footer' dangerouslySetInnerHTML={{ __html: local.config.footer || '' }}></div>
      </div>
    )}</Observer>

  );
}

export default App;
