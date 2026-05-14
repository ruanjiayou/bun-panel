import { Modal, Uploader, Switch, Select, Icon, toast } from "../components/index.js";
import { Center, FormItem, FormLabel } from "../components/style.js";
import { useState } from "react";
import { useSnapshot } from 'valtio'
import { store, type IEngine, type IGroup } from "@/store.js";
import { cloneDeep } from "lodash";
import apis from "@/apis/index.js";
import { HoverItem } from "@/style.js";

export default function DialogConfig({ }) {
  const state = useSnapshot(store)
  const [data, setData] = useState<any>(cloneDeep(state.config));
  return (
    <Modal
      title={"修改"}
      visible={true}
      style={{ height: 400, alignItems: 'center' }}
      onClose={() => {
        store.showMenu = false
      }}
      onSave={async () => {
        const diff: any = [];
        Object.keys(data).forEach(k => {
          if (store.config[k] !== data[k]) {
            diff.push({ name: k, value: data[k] });
          }
        });
        await apis.batchUpdateConfig(diff);
        await store.initConfig();
      }}>
      <div style={{ height: '100%' }}>
        <FormItem>
          <FormLabel>系统名称</FormLabel>
          <input defaultValue={data.title} onChange={e => {
            setData({ ...data, title: e.target.value.trim() })
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>网络模式</FormLabel>
          <div>
            <Switch checked={data.network === 'WAN'} onSwitch={(checked: boolean) => {
              setData({ ...data, network: checked ? 'WAN' : 'LAN' });
            }}>{state.config.network === 'LAN' ? '内网' : '公网'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>默认搜索引擎</FormLabel>
          <div>
            <Select
              value={data.engine}
              items={state.engines.map((it: IEngine) => ({ title: it.name, value: it.name }))}
              onChange={(v: string) => {
                setData({ ...data, engine: v });
              }}></Select>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>显示搜索引擎</FormLabel>
          <div>
            <Switch checked={data.show_search === '1'} onSwitch={(checked: boolean) => {
              setData({ ...data, show_search: checked ? '1' : '0' });
            }}>{data.show_search === '1' ? '显示' : '隐藏'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>自定义页脚</FormLabel>
          <textarea defaultValue={data.footer || ''} onChange={e => {
            setData({ ...data, footer: e.target.value.trim() })
          }}></textarea>
        </FormItem>
        <FormItem>
          <FormLabel>壁纸设置</FormLabel>
          <div>
            <Uploader id="bg" value={data.background_url} onUpload={(resp: any) => {
              if (resp.code === 0) {
                setData({ ...data, background_url: resp.data.filepath })
              }
            }} />
            <input defaultValue={data.background_url} onChange={e => {
              setData({ ...data, background_url: e.target.value.trim() })
            }} />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>搜索引擎管理</FormLabel>
          <div style={{ width: 150 }}>
            {state.engines.map(engine => (
              <HoverItem key={engine.name}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <img src={engine.icon} style={{ width: 20, marginRight: 5 }} alt="engine" />
                  {engine.name}
                </div>
                <Icon type="edit" size={18} onClick={() => { store.temp_engine = engine; store.showEditEngine = true; }} />
                <Icon type="del" size={16} color='#000' onClick={async () => {
                  const resp = await apis.deleteEngine(engine.name);
                  if (resp.status === 200 && resp.data.code === 0) {
                    await store.initEngine()
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
                  <Icon type="del" size={18} color='#333' onClick={async () => {
                    const resp = await apis.deleteGroup(group.id);
                    if (resp.status === 200 && resp.data.code === 0) {
                      await store.initAppGroup()
                    } else if (resp.status !== 200) {
                      toast({ content: '请求错误' })
                    } else {
                      toast({ content: resp.data.message });
                    }
                  }} />
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
      </div>
    </Modal>
  )
}