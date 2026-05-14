import { Modal, toast, Uploader } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";
import { useSnapshot } from 'valtio'
import { store } from '@/store.js';
import apis from "@/apis/index.js";
import { cloneDeep, omit } from "lodash";
import { useState } from "react";

export default function DialogEngine({ }) {
  const state = useSnapshot(store)
  const [data, setData] = useState<any>(cloneDeep(state.temp_engine));
  return (
    <Modal
      title={data.id ? "修改" : "添加"}
      style={{ height: 200, alignItems: 'center' }}
      visible={true}
      onClose={() => {
        store.showEditEngine = false;
      }}
      onSave={async () => {
        const resp = !data.id
          ? await apis.createEngine(data)
          : await apis.updateEngine(state.temp_engine.name!, data);
        if (resp.status === 200 && resp.data.code === 0) {
          store.showEditEngine = false;
          await store.initEngine();
          toast({ content: '操作成功' });
        } else if (resp.status !== 200) {
          toast({ content: '请求失败' });
        } else {
          toast({ content: resp.data.message });
        }
      }}
    >
      <div>
        <FormItem>
          <FormLabel>标志</FormLabel>
          <input defaultValue={data.name} onChange={e => {
            setData({ ...data, name: e.target.value.trim() })
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>名称</FormLabel>
          <input defaultValue={data.title} onChange={e => {
            setData({ ...data, title: e.target.value.trim() })
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>图标</FormLabel>
          <div>
            <Uploader id="engine" defaultValue={data.icon} onUpload={(resp: any) => {
              if (resp.status === 200 && resp.data.code === 0) {
                setData({ ...data, icon: resp.data.filepath })
              }
            }} />
            <input defaultValue={data.icon} onChange={e => {
              setData({ ...data, icon: e.target.value.trim() })
            }} />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>url</FormLabel>
          <input defaultValue={data.url} onChange={e => {
            setData({ ...data, url: e.target.value.trim() })
          }} />
        </FormItem>
      </div>
    </Modal>
  )
}