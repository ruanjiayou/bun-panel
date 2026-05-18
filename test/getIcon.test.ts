import { randomUUIDv7 } from 'bun';
import downloadWebsiteIcon from '../src/utils/getIcon'
import path from 'path'
// === 测试运行 ===
// 你可以换成任何你想测试的网址
const filepah1 = await downloadWebsiteIcon('https://github.com', process.cwd() + '/data/panel', randomUUIDv7());
console.log(filepah1)
console.log(path.relative(process.cwd() + '/data', filepah1!))
// const filepath2 = await downloadWebsiteIcon('baidu.com', './data/panel', randomUUIDv7()); // 自动补全 https
// console.log(filepath2)
// const filepath3 = await downloadWebsiteIcon('http://10.0.15.240:8849/nacos/#/', './data/panel', randomUUIDv7())
// console.log(filepath3)