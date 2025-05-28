import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename:function(req, file, cb){
        const uniquefn = Date.now() + "-" + file.originalname;
        cb(null, uniquefn)
    }
})

const upload = multer({storage:storage});
export default upload