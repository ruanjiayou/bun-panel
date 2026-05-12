import apis from '../../apis/index.js';
import { styled } from '@linaria/react'

const Button = styled.label`
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
`

function Uploader({ value, id, field = "image", onUpload }: any) {
  // 使用useState管理文件选择状态

  // 上传文件的处理函数
  const handleFileChange = (event: any) => {
    // 将文件对象存储在状态中
    const selectedFile = event.target.files[0];
    const fd = new FormData();
    fd.append(field, selectedFile);
    apis.uploadImage(fd).then(resp => {
      onUpload && onUpload(resp)
    });
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ width: 150, marginBottom: 5 }}>
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
  )
}

export default Uploader;