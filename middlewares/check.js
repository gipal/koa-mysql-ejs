module.exports ={ // 可以防止直接输入url跳转到不应该去的页面
  // 已经登录了
checkNotLogin: (ctx) => {
    if (ctx.session && ctx.session.user) {     
      ctx.redirect('/posts'); // 重定向
      return false;
    }
    return true;
},
  //没有登录
  checkLogin: (ctx) => {
    if (!ctx.session || !ctx.session.user) {     
      ctx.redirect('/signin');
      return false;
    }
    return true;
  }
}