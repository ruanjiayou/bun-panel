import { Modal, Uploader, Select, Icon } from "../components/index.js";
import { AlignAround, FormItem, FormLabel, Button } from "../components/style.js";
import { useCallback, useState } from "react";
import apis from "../apis/index.js";
import { useSnapshot } from 'valtio'
import { store, type IGroup } from "@/store.js";
import { toast } from '../components/'
import { User } from "user-info";
import { cloneDeep } from "lodash";

export default function DialogApp({ }) {
  const state = useSnapshot(store)
  const user = useSnapshot(User)
  const disabled = !user.isLogin;
  const [data, setData] = useState<any>(cloneDeep(state.temp_app));
  const [isParsing, setParse] = useState(false)
  const parseURL = async (url: string) => {
    if (isParsing) return;
    setParse(true)
    apis.parseURL(url)
      .then(body => {
        if (body.code === 0) {
          store.temp_app.cover = body.data.url;
          setData({ ...data, cover: body.data.url })
        } else {
          alert('解析错误')
        }
      })
      .catch(err => {
        alert('解析失败')
      })
      .finally(() => {
        setParse(false)
      })
  }
  return (
    <Modal title={data.id ? "修改" : "添加"}
      style={{ alignItems: 'center' }}
      visible={true}
      disabled={disabled}
      onClose={() => {
        store.showEditApp = false
      }}
      onSave={async () => {
        const resp = !store.temp_app.id
          ? await apis.createApp(store.temp_app)
          : await apis.updateApp(store.temp_app.id, store.temp_app);
        if (resp.status === 200 && resp.data.code === 0) {
          await store.initAppGroup();
          toast({ content: '操作成功' });
        } else if (resp.status !== 200) {
          toast({ content: '请求失败' });
        } else {
          toast({ content: resp.data.message });
        }
      }}>
      <div>
        <FormItem>
          <FormLabel>名称</FormLabel>
          <input defaultValue={data.name} disabled={disabled} onChange={e => {
            store.temp_app.name = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>描述</FormLabel>
          <input disabled={disabled} defaultValue={data.desc} onChange={e => {
            store.temp_app.desc = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>图标</FormLabel>
          <div>
            <input disabled={disabled || isParsing} defaultValue={data.cover} onBlur={e => {
              store.temp_app.cover = e.target.value.trim();
            }} />
            <Uploader id="app" value={data.cover} disabled={disabled || isParsing} onUpload={(resp: any) => {
              if (resp.code === 0) {
                store.temp_app.cover = resp.data.filepath;
              }
            }}>
              <AlignAround style={{ gap: 10 }}>
                <Button htmlFor='app'>
                  上传文件
                </Button>
                <Button onClick={() => {
                  if (store.temp_app.url_lan || store.temp_app.url_wan) {
                    parseURL(store.temp_app.url_wan! || store.temp_app.url_lan!)
                  } else {
                    alert('请先输入URL')
                  }
                }}>
                  {isParsing && <Icon type='loading' size={14} spin />}
                  从URL解析
                </Button>
              </AlignAround>
            </Uploader>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>分组</FormLabel>
          <Select value={data.gid} disabled={disabled} items={store.groups.map((g: IGroup) => ({ value: g.id, title: g.name }))} onChange={(v: string) => {
            store.temp_app.gid = v;
          }}></Select>
        </FormItem>
        <FormItem>
          <FormLabel>打开方式</FormLabel>
          <Select value={data.open} disabled={disabled} items={[{ value: 1, title: '新标签页' }, { value: 2, title: '当前页', }, { value: 3, title: '新窗口' }]} onChange={(v: string) => {
            store.temp_app.open = v ? 1 : 0;
          }}></Select>
        </FormItem>
        <FormItem>
          <FormLabel>公网地址</FormLabel>
          <input defaultValue={data.url_wan} disabled={disabled} onChange={e => {
            store.temp_app.url_wan = e.target.value.trim();
          }} />
        </FormItem>
        <FormItem>
          <FormLabel>内网地址</FormLabel>
          <input defaultValue={data.url_lan} disabled={disabled} onChange={e => {
            store.temp_app.url_lan = e.target.value.trim();
          }} />
        </FormItem>
      </div >
    </Modal >
  )
}