const Koa=require('koa');
const path=require('path') // node.js path模块
const bodyParser = require('koa-bodyparser'); // 表单解析中间件，解析请求体。
const ejs=require('ejs'); // 模板引擎
const session = require('koa-session-minimal'); // 将会话信息储存在本地cookie，保持用户状态。
const MysqlStore = require('koa-mysql-session'); // 可以将用户信息保存在数据库
const router=require('koa-router') // 路由
const views = require('koa-views') // koa-views对需要进行视图模板渲染的应用是个不可缺少的中间件，支持ejs
const koaStatic = require('koa-static') // 静态资源服务加载
const staticCache = require('koa-static-cache') // 文件缓存
const config = require('./config/default.js');

const app = new Koa()

// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
key: 'USER_SID',
store: new MysqlStore(sessionMysqlConfig) // 可以传入一个用于session的外部存储.在实际项目中，会话相关信息往往需要再服务端持久化，因此一般都会使用外部存储来记录session信息。
}))


// 配置静态资源加载中间件
   app.use(koaStatic(
     path.join(__dirname , './public')
   ))

// 这个缓存现在没用到，如果没有这个图片引用路径报错，本地服务器的图片可以正常打开。
//app.use(staticCache(path.join(__dirname, '/public'), { dynamic: true }, { // 没有这上面一层光是下面的不够会报错
//maxAge: 365 * 24 * 60 * 60
//}))
//app.use(staticCache(path.join(__dirname, '/images'), { dynamic: true }, {
//maxAge: 365 * 24 * 60 * 60
//}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(bodyParser({
  formLimit: '1mb'
}))

// router.routes() 加载路由
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())

app.listen(config.port)


