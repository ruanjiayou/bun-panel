import { Observer } from "mobx-react-lite";
import { Modal, Uploader } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";
import getRealUrl from "../utils/realImageUrl.js";

export default function DialogEngine({ visible, data, onClose, onSave }) {
  return <Observer>{() => (
    <Modal title={data.id ? "修改" : "添加"} style={{ height: 200, alignItems: 'center' }} visible={visible} onClose={onClose} onSave={onSave}>
      <div>
        <FormItem>
          <FormLabel>标志</FormLabel>
          <input value={data.name} onChange={e => {
            data.name = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>名称</FormLabel>
          <input value={data.title} onChange={e => {
            data.title = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>图标</FormLabel>
          <div>
            <Uploader id="engine" value={getRealUrl(data.icon)} onUpload={resp => {
              if (resp.status === 200 && resp.data.code === 0) {
                data.icon = resp.data.data.filepath;
              }
            }} />
            <input value={data.icon} onChange={e => {
              data.icon = e.target.value.trim();
            }} />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>url</FormLabel>
          <input value={data.url} onChange={e => {
            data.url = e.target.value.trim();
          }} />
        </FormItem>
      </div>
    </Modal>
  )}</Observer>
}