import { Observer } from "mobx-react-lite";
import { Modal, Switch } from '../components/index.js'
import { FormItem, FormLabel } from "../components/style.js";

export default function DialogGroup({ visible, data, onClose, onSave }) {
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
            <Switch checked={data.group_fold} onSwitch={checked => data.group_fold = checked}>{data.group_fold ? '是' : '否'}</Switch>
          </div>
        </FormItem>
      </div>
    </Modal>
  )}</Observer>
}