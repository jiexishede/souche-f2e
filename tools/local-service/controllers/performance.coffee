func_click = __F 'performance/click'
module.exports.controllers = 
    "/click":
        get:(req,res)->
            if not req.query 
                res.send 'error'
                return
            req.query.user_ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
            phone_match = req.query.cookie.match(/noregisteruser=([0-9]*?);/)
            if phone_match
                req.query.user_phone = phone_match[1]
            tag_match = req.query.cookie.match(/usertag=([0-9a-zA-Z_]*?);/)
            if tag_match
                req.query.user_tag = tag_match[1]
            func_click.add req.query,(error,click)->
                res.send 'ok'
            