func_click = __F 'performance/click'
module.exports.controllers = 
    "/click":
        get:(req,res)->
            if not req.query || !req.query.cookie
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
    "/click-chart":
        get:(req,res)->
            res.locals.url = req.query.url
            res.locals.time = req.query.time
            res.render 'performance/clicks'
    "/click-data":
        get:(req,res)->
            url = decodeURIComponent req.query.url
            time = req.query.time
            if time
                times = time.split ' to '
                minTime = times[0]+" 00:00:00"
                maxTime = times[1]+" 23:59:59"
            console.log url
            condition = {page_url:url}
            if time
                condition.createdAt = {gt:minTime,lt:maxTime}
            func_click.getAll 1,1000000,condition,"id desc",['page_x','page_y'],(error,clicks)->
                res.send clicks
    "/click-data-area":
        get:(req,res)->
            url = req.query.url
            console.log url
            x_min = req.query.x_min
            x_max = req.query.x_max
            y_min = req.query.y_min
            y_max = req.query.y_max
            func_click.getAll 1,20000,{page_url:url,page_x:{gt:x_min,lt:x_max},page_y:{gt:y_min,lt:y_max}},"id desc",['page_x','page_y'],(error,clicks)->
                res.send clicks