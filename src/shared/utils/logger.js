export const Logger = {
  _format: (level, tag, msg, meta) => {
    const ts = new Date().toISOString().substring(11, 23);
    const metaStr = meta && Object.keys(meta).length > 0 ? `| ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}] [${tag}] ${msg} ${metaStr}`;
  },
  info: (tag, msg, meta={}) => console.log(Logger._format('INFO', tag, msg, meta)),
  warn: (tag, msg, meta={}) => console.warn(Logger._format('WARN', tag, msg, meta)),
  error: (tag, msg, err=null, meta={}) => {
    console.error(Logger._format('ERROR', tag, msg, meta));
    if (err) console.error(err);
  },
  perf: (tag, label, action) => {
    const start = performance.now();
    const res = action();
    const duration = (performance.now() - start).toFixed(2);
    console.log(Logger._format('PERF', tag, `${label} took ${duration}ms`));
    return res;
  }
};