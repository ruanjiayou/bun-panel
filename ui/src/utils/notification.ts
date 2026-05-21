import shttp from "./shttp";

/**
 * 将 Base64 字符串转换为 Uint8Array
 * @param {string} base64String 
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String: String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUserToPush() {
  // 1. 确保 Service Worker 已经准备就绪
  const registration = await navigator.serviceWorker.ready;

  // 2. 你的 VAPID 公钥（Base64 格式，可以通过 web-push 库生成）
  const publicKey = process.env.WEB_PUSH!;

  try {
    // 3. 向浏览器服务请求订阅
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // 必须为 true，表示每条推送都必须向用户展示
      applicationServerKey: urlBase64ToUint8Array(publicKey) // 传入公钥
    });

    // 4. 将生成的 subscription 发送给你的后端服务器保存
    await shttp.post('https://jiayou.work/gw/user/web-push', subscription, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('订阅成功，凭证已保存到后端服务器！');
  } catch (err) {
    console.error('订阅失败:', err);
  }
}

export async function unsubscribePush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    // 获取当前的订阅对象
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // 🟢 核心代码：主动调用 unsubscribe()
      const successful = await subscription.unsubscribe();
      if (successful) {
        console.log('成功从浏览器推送服务器注销该设备');

        // 第二步：立刻通知你的后端服务器，从数据库删除这个 token
        await shttp.post('https://jiayou.work/gw/user/web-push', subscription, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    } else {
      console.log('用户本来就没有订阅通知');
    }
  } catch (error) {
    console.error('退订失败:', error);
  }
}