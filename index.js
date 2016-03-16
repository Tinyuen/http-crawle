var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var requestUrl = 'http://bizhi.sogou.com/label/index/44?f=jingpintopic&from=index';

request(requestUrl,function(error,response,body){
    if(!error && response.statusCode == 200){
        //console.log(body);
        // 解析 body
        parseDom(body);
    }
});

//解析dom
function parseDom(dom_content){
    var $ = cheerio.load(dom_content);
    var imgs = $('img').toArray();

    // 循环娶到的图片的数组
    var len = imgs.length;
    for(var i=0;i<len;i++){
        var imgSrc = imgs[i].attribs.src;
        console.log(imgSrc);
        var filename = parseFileName(imgSrc);
        downLoadFile(imgSrc,filename,function(){
            console.log('download ' + filename + ' complete...');
        })
    }
}

// 解析文件名
function parseFileName(address){
    var file_name = path.basename(address);
    return file_name;
}

// 下载图片
function downLoadFile(uri,filename,callback){
    request.head(uri,function(err,res,body){
        if(err){
            console.log('error:' + err);
            return false;
        }
        request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close',callback);
    });
}