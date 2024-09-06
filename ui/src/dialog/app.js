import { Observer } from "mobx-react-lite";
import { Modal, Uploader, Select } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";

export default function DialogApp({ visible, groups, data, onClose, onSave }) {
  return <Observer>{() => (
    <Modal title={data.id ? "修改" : "添加"} style={{ alignItems: 'center' }} visible={visible} onClose={onClose} onSave={onSave}>
      <div style={{ marginLeft: 20 }}>
        <FormItem>
          <FormLabel>名称</FormLabel>
          <input value={data.name} onChange={e => {
            data.name = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>描述</FormLabel>
          <input value={data.desc} onChange={e => {
            data.desc = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>图标</FormLabel>
          <div>
            <Uploader id="app" value={data.cover} onUpload={resp => {
              if (resp.status === 200 && resp.data.code === 0) {
                data.cover = resp.data.data.filepath;
              }
            }} />
            <input value={data.cover} onChange={e => {
              data.cover = e.target.value.trim();
            }} />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>分组</FormLabel>
          <Select value={data.gid} items={groups.map(g => ({ value: g.id, title: g.name }))} onChange={v => {
            data.gid = v;
          }}></Select>
        </FormItem>
        <FormItem>
          <FormLabel>打开方式</FormLabel>
          <Select value={data.open} items={[{ value: 1, title: '新标签页' }, { value: 2, title: '当前页', }, { value: 3, title: '新窗口' }]} onChange={(v) => {
            data.open = v;
          }}></Select>
        </FormItem>
        <FormItem>
          <FormLabel>公网地址</FormLabel>
          <input value={data.url_wan} onChange={e => {
            data.url_wan = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>内网地址</FormLabel>
          <input value={data.url_lan} onChange={e => {
            data.url_lan = e.target.value.trim();
          }} />
        </FormItem>
      </div>
    </Modal>
  )}</Observer>
}