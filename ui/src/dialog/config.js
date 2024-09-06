import { Observer, useLocalStore } from "mobx-react-lite";
import { Modal, Uploader, Switch } from "../components/index.js";
import { FormItem, FormLabel } from "../components/style.js";
import { toJS } from "mobx";
import { useEffect } from "react";

export default function DialogConfig({ visible, data, onClose, onSave, children }) {
  const local = useLocalStore(() => ({}));
  useEffect(() => {
    Object.keys(data).forEach(k => {
      local[k] = data[k];
    })
  }, [data, local])
  return <Observer>{() => (
    <Modal title={"修改"} style={{ height: 400, alignItems: 'center' }} visible={visible} onClose={onClose} onSave={async () => {
      const diff = [];
      const now = toJS(local)
      Object.keys(now).forEach(k => {
        if (now[k] !== data[k]) {
          diff.push({ name: k, value: now[k] });
        }
      });
      await onSave(diff);
    }}>
      <div style={{ height: '100%' }}>
        <FormItem>
          <FormLabel>系统名称</FormLabel>
          <input value={local.title} onChange={e => {
            local.title = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>网络模式</FormLabel>
          <div>
            <Switch checked={local.network === 'WAN'} onSwitch={checked => local.network = checked ? 'WAN' : 'LAN'}>{local.network === 'LAN' ? '内网' : '公网'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>显示搜索引擎</FormLabel>
          <div>
            <Switch checked={local.show_search === '1'} onSwitch={checked => local.show_search = checked ? '1' : '0'}>{local.show_search === '1' ? '显示' : '隐藏'}</Switch>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>自定义页脚</FormLabel>
          <textarea onChange={e => {
            local.footer = e.target.value.trim();
          }}></textarea>
        </FormItem>
        <FormItem>
          <FormLabel>壁纸设置</FormLabel>
          <div>
            <Uploader id="bg" value={local.background_url} onUpload={(resp) => {
              if (resp.status === 200 && resp.data.code === 0) {
                local.background_url = resp.data.data.filepath;
              }
            }} />
            <input value={local.background_url} onChange={e => {
              local.background_url = e.target.value.trim();
            }} />
          </div>
        </FormItem>
        {children}
      </div>
    </Modal>
  )}</Observer>
}