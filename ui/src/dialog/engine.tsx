import React from 'react'
import { Modal, Uploader } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";
import getRealUrl from "../utils/realImageUrl.js";
import { useSnapshot } from 'valtio'
import { store } from '@/store.js';

export default function DialogEngine({ visible, onClose, onSave }: any) {
  const state = useSnapshot(store)
  const data = state.temp_engine;
  return (
    <Modal title={data.id ? "修改" : "添加"} style={{ height: 200, alignItems: 'center' }} visible={visible} onClose={onClose} onSave={onSave}>
      <div>
        <FormItem>
          <FormLabel>标志</FormLabel>
          <input value={data.name} onChange={e => {
            store.temp_engine.name = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>名称</FormLabel>
          <input value={data.title} onChange={e => {
            store.temp_engine.title = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>图标</FormLabel>
          <div>
            <Uploader id="engine" value={getRealUrl(data.icon)} onUpload={(resp: any) => {
              if (resp.status === 200 && resp.data.code === 0) {
                store.temp_engine.icon = resp.data.data.filepath;
              }
            }} />
            <input value={data.icon} onChange={e => {
              store.temp_engine.icon = e.target.value.trim();
            }} />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>url</FormLabel>
          <input value={data.url} onChange={e => {
            store.temp_engine.url = e.target.value.trim();
          }} />
        </FormItem>
      </div>
    </Modal>
  )
}