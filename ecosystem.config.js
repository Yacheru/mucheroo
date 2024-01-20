
module.exports = {
    apps : [{
        name   : 'mucheroo',
        script : './index.js',
        cwd : '.',
        error_file : './logs/pm2/errors.log',
        out_file: './logs/pm2/logs.log'
    }]
}
