import { Observer } from "mobx-react-lite";
import { Modal, Icon } from "../components/index.js";
import { AlignAside } from "../components/style.js";
import apis from "../apis/index.js";

export default function DialogApp({ visible, apps, onClose, onSave }) {
  return <Observer>{() => (
    <Modal title={"应用列表"} style={{ alignItems: 'center' }} visible={visible} onClose={onClose} onSave={() => { }}>
      <div style={{ width: '60%', margin: '0 auto' }}>
        {apps.map(app => (
          <AlignAside key={app.id} style={{ margin: 10 }}>
            <span>{app.name}</span>
            <Icon type={'del'} onClick={async () => {
              await apis.deleteApp(app.id);
              await onSave();
            }} />
          </AlignAside>
        ))}
      </div>
    </Modal>
  )}</Observer>
}