import { Icon, Modal, Switch, toast } from '../components/index.js'
import { FormItem, FormLabel } from "../components/style.js";
import { useSnapshot } from 'valtio'
import { store } from "@/store.js";
import apis from '@/apis/index.js';
import { useState } from 'react';
import { cloneDeep } from 'lodash';
import { User } from 'user-info';

export default function DialogGroup({ }) {
  const state = useSnapshot(store)
  const user = useSnapshot(User)
  const disabled = !user.isLogin;
  const [data, setData] = useState<any>(cloneDeep(state.temp_group));
  return (
    <Modal
      title={data.id ? "修改" : "添加分组"}
      style={{ height: 150, alignItems: 'center' }}
      visible={true}
      disabled={disabled}
      onClose={() => { store.showEditGroup = false; }}
      onSave={async () => {
        const resp = !(data.id)
          ? await apis.createGroup({ name: data.name, fold: data.fold, nth: data.nth })
          : await apis.updateGroup(data.id, { name: data.name, fold: data.fold, nth: data.nth });
        if (resp.code === 0) {
          toast({ content: '操作成功' });
          store.initAppGroup()
        } else if (resp.status !== 200) {
          toast({ content: '请求失败' });
        } else {
          toast({ content: resp.data.message });
        }
      }}
    >
      <div>
        <FormItem>
          <FormLabel>分组名称</FormLabel>
          <input disabled={disabled} id="group_name" defaultValue={data.name} onChange={e => {
            setData({ ...data, name: e.target.value.trim() });
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>是否折叠</FormLabel>
          <div>
            <Switch disabled={disabled} checked={data.fold} onSwitch={checked => { setData({ ...data, fold: checked ? 1 : 0 }); }}>{data.fold ? '是' : '否'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel style={{ paddingTop: 3 }}>添加应用</FormLabel>
          <div style={{ border: '1px dashed grey', borderRadius: 5, padding: '5px 15px' }} onClick={() => {
            if (disabled) return;
            store.temp_app = { gid: data.id, name: '', desc: '', cover: '', url_lan: '', url_wan: '', open: 1, type: 1 };
            store.showEditApp = true
            store.showEditGroup = false;
          }}>
            <Icon type={'add'} style={{ fill: 'grey', }} size={16} title="添加应用" />
          </div>
        </FormItem>
      </div>
    </Modal>
  )
}