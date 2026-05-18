import { randomUUIDv7 } from 'bun';
import { mkdirSync } from 'fs';
import { parseHTML } from 'linkedom';
import path from 'path';

/**
 * 传入一个网址，自动抓取并下载其 Icon 到指定目录
 * @param urlStr 目标网站地址 (例如: https://github.com)
 * @param filepath 保存图标的路径
 */
export default async function downloadWebsiteIcon(urlStr: string, dir: string, filename: string) {
  const filepath = path.normalize(dir + '/' + filename)
  try {
    // 1. 规范化并解析 URL
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr;
    }
    const targetUrl = new URL(urlStr);
    const domain = targetUrl.hostname;

    console.log(`正在分析网站: ${targetUrl.href}...`);

    // 2. 抓取网页源码
    const response = await fetch(targetUrl.href, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!response.ok) {
      throw new Error(`无法访问该网站, 状态码: ${response.status}`);
    }

    const html = await response.text();

    // 3. 使用 linkedom 解析 HTML
    const { document } = parseHTML(html);

    // 定义我们关心的选择器（按优先级排序）
    const selectors = [
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="alternate icon"]'
    ];

    let iconHref: string | null = null;

    // 遍历选择器寻找图标链接
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        iconHref = element.getAttribute('href');
        if (iconHref) break;
      }
    }

    let iconUrl: string;

    if (iconHref) {
      // 4. 处理找到的 Href，将其转化为绝对路径
      // 处理 Base64 内联图片的情况
      if (iconHref.startsWith('data:')) {
        console.log('检测到 Base64 内联图标，正在直接转换...');
        return await saveBase64Icon(iconHref, dir, filename);
      }
      iconUrl = new URL(iconHref, targetUrl.href).href;
    } else {
      // 5. 兜底策略：源码没找到，尝试直接访问根目录的 /favicon.ico
      console.log('源码中未找到 icon 标签，尝试根目录兜底...');
      iconUrl = new URL('/favicon.ico', targetUrl.origin).href;
    }

    // 6. 下载图标文件
    console.log(`正在下载图标: ${iconUrl}`);
    const iconRes = await fetch(iconUrl);

    if (!iconRes.ok) {
      // 如果根目录兜底也失败了，报错
      if (!iconHref) {
        throw new Error('无法通过源码或根目录获取到有效的图标。');
      }
      throw new Error(`下载图标失败，状态码: ${iconRes.status}`);
    }

    mkdirSync(path.dirname(filepath), { recursive: true })
    let ext = path.extname(new URL(iconUrl).pathname);
    if (!ext || ext.length > 5) {
      // 尝试从 Content-Type 判断
      const contentType = iconRes.headers.get('content-type') || '';
      if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('svg')) ext = '.svg';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
      else ext = '.ico';
    }
    // 使用 Bun.write 直接写入文件流，性能极高
    await Bun.write(filepath + ext, iconRes);
    console.log(`🎉 成功保存图标到: ${filepath + ext}`);
    return filepath + ext;
  } catch (error) {
    console.error(`❌ 抓取失败 [${urlStr}]:`, (error as Error).message);
  }
}

/**
 * 辅助函数：处理并保存 Base64 编码的图标
 */
async function saveBase64Icon(base64Str: string, dir: string, filename: string) {
  const match = base64Str.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    console.error('Base64 格式解析失败');
    return;
  }
  const mimeType = match[1];
  const base64Data = match[2];
  let ext = '.ico';
  if (mimeType.includes('png')) ext = '.png';
  else if (mimeType.includes('svg')) ext = '.svg';

  const buffer = Buffer.from(base64Data, 'base64');
  const filepath = path.normalize(dir + '/' + filename + ext);
  await Bun.write(filepath, buffer);
  console.log(`🎉 成功从 Base64 保存图标到: ${filepath}`);
  return filepath
}
