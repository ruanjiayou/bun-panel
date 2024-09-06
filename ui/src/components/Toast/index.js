export default function toast({ content, type, duration = 2 }) {
  console.log(content, 'toast?')
  const toast = document.createElement('div');
  toast.style = 'z-index: 2000;font-size: 16px; color: #444; padding: 5px 15px; position: absolute;left: 50%;top: 15%;transform: translate(-50%, -65%);min-width: 100px;min-height: 30px;background-color: #fff;border-radius: 10px;display: flex;flex-direction: column;align-items: center;justify-content: center;'
  toast.innerHTML = content;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, duration * 1000 || 2000);
}