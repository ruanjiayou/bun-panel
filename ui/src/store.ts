import { useRef } from "react";
import { proxy, useSnapshot } from 'valtio'
import { proxyMap } from 'valtio/utils'

export type IConfig = {
  name: string;
  title: string;
  value: string;
}
export type IGroup = {
  id: string;
  name: string;
  nth: number;
  fold: number;
  apps?: IApp[]
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
}
export type IEngine = {
  id?: number;
  name: string;
  title: string;
  icon: string;
  url: string;
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
  }
})