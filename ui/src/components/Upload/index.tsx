import apis from '../../apis/index.js';
import { Button } from '../style.js';

function Uploader({ value, id, field = "image", onUpload, disabled = false, children }: any) {
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
      <div style={{ width: 150, margin: '5px 0', backgroundColor: '#eee', minHeight: 50, }}>
        {value && <img src={value} style={{ width: '100%', maxWidth: 100 }} alt="preview" />}
      </div>
      <input
        id={id}
        disabled={disabled}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {
        children || <Button className={disabled ? 'disabled' : ''} htmlFor={id}>
          上传文件
        </Button>
      }
    </div>
  )
}

export default Uploader;