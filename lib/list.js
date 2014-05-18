'use strict';

var http = require('http')
var common = require('totoro-common')
var colorful = require('colorful')

var logger = require('./logger')
var handleCfg = require('./handle-cfg')


// list all available browsers
module.exports = function(cfg) {
  cfg = handleCfg(cfg, true)

  var listUrl = 'http://' + cfg.host + ':' + cfg.port + '/__list'
  http.get(listUrl, function(res) {
    var data = ''

    res.on('data', function(chunk) {
      data += chunk
    })

    res.on('end', function() {
      var labors = JSON.parse(data)
      if(Object.keys(labors).length) {
        Object.keys(labors).forEach(function(type, index, list) {
          console.info()
          console.info(colorful.cyan('  ' +  firstCapital(type) + ':'))
          var browsers = labors[type]
          Object.keys(browsers).sort().forEach(function(k) {
            var free = browsers[k].free
            var busy = browsers[k].busy
            var all = free + busy

            if (free) {
              console.info('  ' + k + ' [' + free + '/' + all + ']')
            } else {
              console.info('  ' + k + colorful.gray(' [' + free + '/' + all + ']'))
            }

          })
        })
        console.info()
      } else {
        console.info(colorful.red('  No active browser.'))
      }
    })
  }).on('error', function(e) {
    logger.error('Server is not available, please check your config or try again later.')
  })
}

function firstCapital(str) {
  return str[0].toUpperCase() + str.slice(1)
}

