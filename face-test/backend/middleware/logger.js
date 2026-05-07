const chalk = require('chalk');

// 请求日志中间件
function logger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  // 记录响应结束时间
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // 根据状态码着色
    let statusColor;
    if (statusCode >= 500) statusColor = chalk.red;
    else if (statusCode >= 400) statusColor = chalk.yellow;
    else if (statusCode >= 300) statusColor = chalk.cyan;
    else statusColor = chalk.green;

    // 根据方法着色
    let methodColor;
    switch (method) {
      case 'GET': methodColor = chalk.blue; break;
      case 'POST': methodColor = chalk.green; break;
      case 'PUT': methodColor = chalk.yellow; break;
      case 'DELETE': methodColor = chalk.red; break;
      default: methodColor = chalk.white;
    }

    console.log(
      `${chalk.gray(new Date().toISOString())} ` +
      `${methodColor(method.padEnd(6))} ` +
      `${statusColor(statusCode.toString().padEnd(3))} ` +
      `${url.padEnd(40)} ` +
      `${chalk.magenta(`${duration}ms`)}` +
      ` ${chalk.dim(ip)}`
    );
  });

  next();
}

// 错误日志
function errorLogger(err, req, res, next) {
  console.error(chalk.red('❌ Error:'), {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
  });

  next(err);
}

module.exports = { logger, errorLogger };