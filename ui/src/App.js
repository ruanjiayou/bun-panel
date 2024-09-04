import logo from './logo.svg';
import { useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { observer, useLocalStore, Observer } from "mobx-react-lite"
import './App.css';
import apis from './apis'

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
            return <div key={group.id}>
              <div>{group.name}</div>
              {group.apps.forEach(app => {
                return <div key={app.id}>
                  {app.name}
                </div>
              })}
            </div>
          })}
        </div>
        <div className='footer' dangerouslySetInnerHTML={{ __html: local.config.footer || '' }}></div>
      </div>
    )}</Observer>

  );
}

export default App;
