// 验证器中间件
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field] || req.query[field] || req.params[field];

      // 必填验证
      if (rules.required && !value) {
        errors.push(`${field} 是必填项`);
        continue;
      }

      // 类型验证
      if (value && rules.type) {
        const actualType = typeof value;
        if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`${field} 必须是数组`);
        } else if (rules.type !== 'array' && actualType !== rules.type) {
          errors.push(`${field} 必须是 ${rules.type} 类型`);
        }
      }

      // 最小长度
      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} 至少需要 ${rules.minLength} 个字符`);
      }

      // 最大长度
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} 不能超过 ${rules.maxLength} 个字符`);
      }

      // 邮箱验证
      if (value && rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field} 必须是有效的邮箱地址`);
        }
      }

      // 数字范围
      if (value && rules.min !== undefined && Number(value) < rules.min) {
        errors.push(`${field} 不能小于 ${rules.min}`);
      }
      if (value && rules.max !== undefined && Number(value) > rules.max) {
        errors.push(`${field} 不能大于 ${rules.max}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: '验证失败',
        details: errors
      });
    }

    next();
  };
}

// 常用验证规则
const rules = {
  username: { required: true, type: 'string', minLength: 3, maxLength: 20 },
  email: { required: true, type: 'string', email: true },
  password: { required: true, type: 'string', minLength: 6, maxLength: 50 },
  title: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  description: { type: 'string', maxLength: 500 },
  id: { required: true, type: 'string' },
};

module.exports = { validate, rules };