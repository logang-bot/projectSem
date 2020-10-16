const {imagen} = require('../models')
const{random} = require('../helpers/libs')
const fs = require('fs-extra')
const path = require('path')

const ctrl={}

async function get(req,res){
    const image = await imagen.findOne({filename: {$regex: req.params.imgid}})
    if(image){
        res.send(image.filename)
        return image.filename
    }
    else{
        return "error"
    }
}

async function cre (req,res){
    const save = async () =>{
        var err = ""
        if (req.file != null) {
            const imgurl = random()
            const images = await imagen.find({ filename: { $regex: imgurl } })
            if (images.length > 0) {
                save()
            }
            else {
                console.log(imgurl)
                const ext = path.extname(req.file.originalname).toLowerCase()
                const imgtmp = req.file.path
                const imgtarg = path.resolve(`src/public/upload/${imgurl}${ext}`)

                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    await fs.rename(imgtmp, imgtarg)
                    const newimg = new imagen({
                        filename: imgurl + ext,
                    })
                    const imgsav = await newimg.save()
                    err = imgsav.filename
                }
                else {
                    await fs.unlink(imgtmp)
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