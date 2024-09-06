import { Observer } from 'mobx-react-lite';
import apis from '../../apis/index.js';
import styled from 'styled-components';

const Button = styled.label`
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
`

function Uploader({ value, id, field = "image", onUpload }) {
  // 使用useState管理文件选择状态

  // 上传文件的处理函数
  const handleFileChange = (event) => {
    // 将文件对象存储在状态中
    const selectedFile = event.target.files[0];
    const fd = new FormData();
    fd.append(field, selectedFile);
    apis.uploadImage(fd).then(resp => {
      onUpload && onUpload(resp)
    });
  };

  return <Observer>{() => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ width: 150, marginBottom: 10 }}>
        {value && <img src={value} style={{ width: '100%' }} alt="preview" />}
      </div>
      <input
        id={id}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button htmlFor={id}>
        上传文件
      </Button>

    </div>
  )}</Observer>;
}

export default Uploader;