import { Modal, Uploader, Switch, Select } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";
import React, { useEffect, useRef } from "react";
import { useSnapshot } from 'valtio'
import { store, useLocalProxy, type IEngine } from "@/store.js";
import { cloneDeep } from "lodash";

export default function DialogConfig({ visible, engines, onClose, onSave, children }: any) {
  const state = useSnapshot(store)
  const data = useRef<any>({});
  useEffect(() => {
    data.current = cloneDeep(state.config)
  }, [])
  return (
    <Modal title={"修改"} style={{ height: 400, alignItems: 'center' }} visible={visible} onClose={onClose} onSave={async () => {
      const diff: any = [];
      Object.keys(data.current).forEach(k => {
        if (store.config[k] !== data.current[k]) {
          diff.push({ name: k, value: store.config[k] });
        }
      });
      await onSave(diff);
    }}>
      <div style={{ height: '100%' }}>
        <FormItem>
          <FormLabel>系统名称</FormLabel>
          <input value={state.config.title} onChange={e => {
            store.config.title = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>网络模式</FormLabel>
          <div>
            <Switch checked={state.config.network === 'WAN'} onSwitch={(checked: boolean) => store.config.network = checked ? 'WAN' : 'LAN'}>{state.config.network === 'LAN' ? '内网' : '公网'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>默认搜索引擎</FormLabel>
          <div>
            <Select value={state.config.engine} items={state.engines.map((it: IEngine) => ({ title: it.name, value: it.name }))} onChange={(v: string) => store.config.engine = v}></Select>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>显示搜索引擎</FormLabel>
          <div>
            <Switch checked={state.config.show_search === '1'} onSwitch={(checked: boolean) => store.config.show_search = checked ? '1' : '0'}>{state.config.show_search === '1' ? '显示' : '隐藏'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>自定义页脚</FormLabel>
          <textarea value={state.config.footer || ''} onChange={e => {
            store.config.footer = e.target.value.trim();
          }}></textarea>
        </FormItem>
        <FormItem>
          <FormLabel>壁纸设置</FormLabel>
          <div>
            <Uploader id="bg" value={state.config.background_url} onUpload={(resp: any) => {
              if (resp.code === 0) {
                store.config.background_url = resp.data.filepath;
              }
            }} />
            <input value={state.config.background_url} onChange={e => {
              store.config.background_url = e.target.value.trim();
            }} />
          </div>
        </FormItem>
        {children}
      </div>
    </Modal>
  )
}