import { Observer } from "mobx-react-lite";
import { Icon, Modal, Switch } from '../components/index.js'
import { FormItem, FormLabel } from "../components/style.js";

export default function DialogGroup({ visible, data, onAdd, onClose, onSave }) {
  return <Observer>{() => (
    <Modal title={data.id ? "修改" : "添加分组"} style={{ height: 150, alignItems: 'center' }} visible={visible} onClose={() => onClose()} onSave={onSave}>
      <div style={{ marginLeft: 20 }}>
        <FormItem>
          <FormLabel>分组名称</FormLabel>
          <input id="group_name" value={data.name} onChange={e => {
            data.name = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>是否折叠</FormLabel>
          <div>
            <Switch checked={data.fold} onSwitch={checked => data.fold = checked ? 1 : 0}>{data.fold ? '是' : '否'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel style={{ paddingTop: 3 }}>添加应用</FormLabel>
          <div style={{ border: '1px dashed grey', borderRadius: 5, padding: '5px 15px' }} onClick={() => {
            if (onAdd) {
              onAdd(data.id);
            }
          }}>
            <Icon type={'add'} style={{ fill: 'grey', }} size={16} title="添加应用" />
          </div>
        </FormItem>
      </div>
    </Modal>
  )}</Observer>
}