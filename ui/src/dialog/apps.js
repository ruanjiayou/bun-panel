import { Observer } from "mobx-react-lite";
import { Modal, Icon } from "../components/index.js";
import apis from "../apis/index.js";
import styled from "styled-components";

const HoverItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
`

export default function DialogApp({ visible, apps, onClose, onSave }) {
  return <Observer>{() => (
    <Modal title={"应用列表"} style={{ alignItems: 'center' }} visible={visible} onClose={onClose} onSave={() => { }}>
      <div style={{ width: '60%', height: 400, margin: '0 auto' }}>
        {apps.map(app => (
          <HoverItem key={app.id}>
            <span>{app.name}</span>
            <Icon type={'del'} color="#666" onClick={async () => {
              await apis.deleteApp(app.id);
              await onSave();
            }} />
          </HoverItem>
        ))}
      </div>
    </Modal>
  )}</Observer>
}