const {imagen} = require('../models')
const{random} = require('../helpers/libs')
const fs = require('fs-extra')
const path = require('path')

const ctrl={}

//test
async function get(req,res){
    //console.log(req.params)
    /*const allimages = await imagen.find({})
    return res.send(allimages)*/
    var params = req.params
    if(!params)return res.send('es necesario un id')
    var {id} = params
    //return res.send(id)
    var gimg = await imagen.findOne({filename: {$regex: req.params.id}})
    if(gimg) return res.sendFile(gimg.path)
    res.send('error en la peticion')
}
//test

/*async function getCurrent(req,res){
    const image = await imagen.findOne({filename: {$regex: req.params.imgid}})
    if(image){
        res.send(image.filename)
        return image.filename
    }
    else{
        return "error"
    }
}*/

async function cre(req, res) {
    const save = async () => {
        var err = ""
        if (req.files != null) {
            const imgurl = random()
            const images = await imagen.find({ filename: { $regex: imgurl } })
            if (images.length > 0) save()
            else {
                //console.log(ran)
                const imagee = req.files.img
                //imagee.tempFilePath = path
                //console.log(imagee)
                const ext = path.extname(imagee.name)
                const targetPath = path.join(__dirname, `../public/upload/${imgurl}${ext}`)
                const relpath = "img/" + imgurl + ext
                console.log(targetPath)
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    await imagee.mv(targetPath)
                    const newimg = new imagen({
                        path: targetPath,
                        relativepath: relpath,
                        filename: imgurl + ext,
                    })
                    const imgsav = await newimg.save()
                    err = imgsav.relativepath
                }
                else {
                    err = "fail"
                }
            }
        }
        else{
            err = ""
        }
        return err
    }
    return save()
}

module.exports ={
    get, cre
}