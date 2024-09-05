import { useLocalStore, Observer } from "mobx-react-lite"
import { useEffectOnce } from "react-use"
import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #0000008a;
`
const Mask = styled.div`

`
const Title = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Main = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-65%);
  min-width: 600px;
  min-height: 400px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`
const Body = styled.div`
  flex: 1;
  overflow-y: auto;
`
const Footer = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`
const Button = styled.div`
  cursor: pointer;
  height: 35px;
  line-height: 35px;
  text-align: center;
  width: 80px;
  background-color: #39c;
  color: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const local = {
  total: 0,
  current: 1000,
}
export default function Modal({ title, children, visible, onSave, onClose }) {
  const store = useLocalStore(() => ({
    index: local.current + 1,
    loading: false,
  }))
  useEffectOnce(() => {
    if (local.total === 0) {
      local.current = 1000;
    }
    local.total++;
    return () => {
      local.total--;
    }
  })
  return <Observer>{() => (
    visible && <Container style={{ zIndex: store.index }}>
      <Main>
        <Title>
          <span>{title}</span>
          <span style={{ cursor: 'pointer' }} onClick={() => {
            if (onClose) {
              onClose();
            }
          }}>
            <svg t="1725503348064" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36100" width="24" height="24"><path d="M572.16 512l183.466667-183.04a42.666667 42.666667 0 1 0-60.586667-60.586667L512 451.84l-183.04-183.466667a42.666667 42.666667 0 0 0-60.586667 60.586667l183.466667 183.04-183.466667 183.04a42.666667 42.666667 0 0 0 0 60.586667 42.666667 42.666667 0 0 0 60.586667 0l183.04-183.466667 183.04 183.466667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z" p-id="36101"></path></svg>
          </span>
        </Title>
        <Body>
          {children}
        </Body>
        <Footer>
          <Button onClick={async () => {
            if (local.loading) {
              return;
            }
            if (onSave) {
              try {
                local.loading = true;
                await onSave();
                onClose();
              } finally {
                local.loading = false;
              }

            }
          }}>{local.loading && <span className="spin" style={{ display: 'flex', alignItems: 'center', width: 18, marginRight: 10 }}>
            <svg t="1725517327429" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="68147" width="32" height="32"><path fill="#fff" d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27c40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8z m756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4S687 811.7 646 829c-42.4 17.9-87.4 27-133.9 27s-91.5-9.1-133.9-27c-40.9-17.3-77.7-42.1-109.3-73.8-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47c5.3-4.1 3.5-12.5-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-0.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8 0.1-4.5-3.5-8.2-8-8.2z" p-id="68148"></path></svg>
          </span>}保存</Button>
        </Footer>
      </Main>
    </Container>
  )}</Observer>
}