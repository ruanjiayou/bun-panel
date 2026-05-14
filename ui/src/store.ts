import { useRef } from "react";
import { proxy, useSnapshot } from 'valtio'
import apis from "./apis";

export type IConfig = {
  name: string;
  title: string;
  value: string;
  uid: string;
}
export type IGroup = {
  id: string;
  name: string;
  nth: number;
  fold: number;
  apps?: IApp[];
  uid: string;
}
export type IApp = {
  id: string;
  gid: string;
  name: string;
  desc: string;
  cover: string;
  url_lan: string;
  url_wan: string;
  type: number;
  open: number;
  nth: number;
  uid: string;
}
export type IEngine = {
  name: string;
  title: string;
  icon: string;
  url: string;
  uid: string;
}


export function useLocalProxy<T extends object>(initialState: T) {
  // 保持 proxy 引用不变
  const ref = useRef(proxy(initialState))
  // 订阅变化 - 这会自动触发重新渲染
  const snap = useSnapshot(ref.current)
  return [snap, ref.current] as const;
}

export const store = proxy({
  baseURL: '/gw/panel',
  isRefresh: false,
  access_token: '',
  refresh_token: '',
  showMenu: false,
  showEditApp: false,
  showEditGroup: false,
  showEditEngine: false,
  sort_gid: '',
  show_engine_dialog: false,
  allow_mix: true,
  // temp
  temp_engine: {} as IEngine,
  temp_group: {} as Partial<IGroup>,
  temp_app: {} as Partial<IApp>,

  booted: false,
  defaultEngine: null as undefined | null | IEngine,
  configs: [] as IConfig[],
  config: {} as { [key: string]: any },
  groups: [] as IGroup[],
  apps: [] as IApp[],
  engines: [] as IEngine[],
  remAppById(id: string) {
    const app = this.apps.find(app => app.id === id);
    if (app) {
      const group = this.groups.find(group => group.id === app.gid);
      if (group && group.apps) {
        group.apps = group.apps.filter(app => app.id !== id);
      }
    }
    this.apps = this.apps.filter(app => app.id !== id)
  },
  async initConfig(){
    const resp = await apis.getConfigs();
    if (resp.code === 0) {
      resp.data.forEach(config => {
        const name = config.name as string;
        this.config[name] = config.value as string;
      });
      this.configs = resp.data;
      if (this.config.title) {
        document.querySelector('title')!.innerText = this.config.title;
      }
    }
  },
  async initEngine(){
    const resp4 = await apis.getEngines();
    if (resp4.code === 0) {
      this.engines = resp4.data;
      this.defaultEngine = this.engines.find(it => it.name === this.config.engine)
    }
  },
  async initAppGroup() {
    try {
      const resp2 = await apis.getGroups();
      const resp3 = await apis.getApps();
      if (resp2.code === 0 && resp3.code === 0) {
        const groups = resp2.data.map((g: IGroup) => { g.apps = []; return g; });
        this.apps = resp3.data;
        resp3.data.forEach(app => {
          const group = groups.find((g: IGroup) => g.id === app.gid);
          if (group) {
            app.nth = group.apps.length;
            group.apps.push(app);
          }
        });
        this.groups = groups;
      }
    } catch (err) {

    } finally {
      store.booted = true;
    }
  }
})