const express = require('express');
const app = express();
const bp = require("body-parser")
var path = require('path')
var fs = require('fs')
// app.use(bp.urlencoded({extended :true}))
app.use(express.json());
/*app.get("/",(req,res)=>{
    res.sendFile(__dirname +"/"+"form.html");
});*/
app.post("/result", (req, res) => {
    var dir = req.body.path;
    var ext = req.body.txt;

    // console.log(JSON.stringify(req. body));
    // console.log(dir);
    // console.log(ext)

    function recFindByExt(dir, ext, files, result) {

        if (!fs.existsSync(dir)) {
            console.log("No Directory Exist =>", dir);
            return null;
        }

        files = files || fs.readdirSync(dir)
        result = result || []

        files.forEach(
            function (file) {
                var newdir = path.join(dir, file)
                if (fs.statSync(newdir).isDirectory()) {
                    result = recFindByExt(newdir, ext, fs.readdirSync(newdir), result)
                }
                else {
                    if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
                        result.push(newdir)
                    }
                }
            }
        )
        return result;
    }

    var responseText = recFindByExt(dir, ext, fs.readdirSync(dir), []);

    console.log(responseText);
    res.send(responseText);
});
//var result = recFindByExt('/home/radmin/myproject/assignment','txt')

// app.post("/process",(req,res)=>
// {
//     var file_name = req.body.fname;
//     var src = req.body.source;
//     var dest = req.body.destination;
//     //moves the $file to $dir2
//     var file = src + "/" + file_name;
// });

app.post("/process", (req, res) => {

    var file_name = req.body.fname;
    var src = req.body.source;
    var dest = req.body.destination;
    //moves the $file to $dir2
    var file = src + "/" + file_name;

    console.log(JSON.stringify(req.body));
    console.log(src);
    console.log(dest)
    console.log(file_name)


    var responseCode = 0


    moveStatus = (file, dest) => {
        //gets file name and adds it to dir2

        console.log("MoveStatus: File = " + file);
        console.log("MoveStatus: dest = " + dest);

        var f = path.basename(file);
        // var dest = path.resolve(dest, f);
        var status_code=800;

        console.log("MoveStatus: dest after resolving = " + dest);
        console.log("MoveStatus: f = " + f);


        if (fs.existsSync(file)) {
            var renameStat = fs.renameSync(file, dest)
            
            console.log("renameStat = " + renameStat);
            
            var copied = fs.existsSync(dest)
            console.log("copied = " + copied);

            if (copied){
                status_code = 0 ;
            }else{
                status_code = 888 ;
            }
        } else {
            status_code = -1;
        }

        return status_code;
    }

    var statCode = moveStatus(file, dest + "/" + file_name);
    console.log(statCode)

    switch (statCode) {
        case 0: responseCode = 200;
            break;
        case -1: responseCode = 404;
            break;
        default: responseCode = 500;
            break;
    }


    res.sendStatus(responseCode);
});

/*app.get("/",(req,res)=>{
    res.send(result);*/
app.listen(3000, () => {
    console.log("Server is running at port :3000");
})
