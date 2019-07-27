var express = require('express')
var router = express.Router()
var snipModel = require('../models/snip')
var md5 = require('MD5')

/*
 * @api [post] /save
 *  description: "save snip to database"
 *  requestBody:
 *      content: 
 *           application/json:
 *               schema:
 *                   $ref: "#/components/schemas/save"
 *  responses:
 *    200:
 *      description: Snip saved successfully
 * 			
 */             
router.post('/save', function(req, res) {
    var url = req.body.url;
    if (!url)
        return res.send({
            code: 1,
            message: 'No url'
        })
    console.log(req.body)
    snipModel.findByUrl(url, function(err, snip) {
        if (err)
            return ree.send({
                code: 2,
                message: err
            })
        if (!snip) {
            snip = new snipModel(req.body)
            snip.modified = new Date
        } else {

            if (snip.lock && snip.lock.lockType != 0) {
                if (!req.body.unlockPass)
                    return res.json({
                        code: 4,
                        message: "Cannot Modify: Read only"
                    })
                if (md5(req.body.unlockPwd) != snip.lock.password)
                    return res.send({
                        code: 3,
                        message: "Invalid Password"
                    })
            }

            if (req.body.note)
                snip.note = req.body.note
            if (req.body.urls)
                snip.urls = eval(req.body.urls)
            if (req.body.lock) {
                snip.lock = eval(req.body.lock)
                if (snip.lock.lockType != 0)
                    if (snip.lock.password)
                        snip.lock.password = md5(snip.lock.password)
                    else
                        snip.lock.lockType = 0;
            }
            snip.modified = new Date
        }

        if (snip.urls && snip.urls[0] && !snip.urls[0].link)
            snip.urls = [];


        // if (!snip.note && !snip.urls && snip._id) {
        //     snipModel.remove({
        //         _id: snip._id
        //     }, function(err) {
        //         if (err)
        //             return res.send({
        //                 code: 2,
        //                 message: err
        //             })
        //         res.send({
        //             code: 0,
        //             message: "Deleted Successfully"
        //         })
        //     })
        // } else

        snip.save(function(err, snip) {
            if (err)
                return res.send({
                    code: 2,
                    message: err
                })
            res.send({
                code: 0,
                message: "Saved Successfully"
            })
        })
    })
});



router.get('/delete/:url', function(req, res) {
    snipModel.findByUrl('/' + req.params.url, function(err, snip) {
        if (snip) {
            snip.remove(function(err) {
                res.redirect('/')
            })
        } else {
            res.redirect('/')
        }
    })
})

//only when developing..remove later
if (express().get('env') == 'development')
    router.get('/viewall', function(req, res) {
        snipModel.find({}, function(err, s) {
            res.json(s)
        })
    })

router.use(function(req, res, next) {
    var url = req.url;
    if (req.method != 'GET')
        return res.send('Access Denied')
    snipModel.findByUrl(url, function(err, snip) {
        if (err)
            return res.send('Something went wrong')
        var snip = snip || {
            url: url,
            lock: {
                lockType: 0
            }
        }
        var baseUrl = req.headers.host
        url = 'http://' + baseUrl + snip.url
        res.render('snip', {
            baseUrl: baseUrl,
            isNew: snip == null,
            snip: snip,
            url: url,
        })
    })
})

module.exports = router
