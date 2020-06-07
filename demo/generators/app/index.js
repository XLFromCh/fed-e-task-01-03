const Generantor=require('yeoman-generator') 
module.exports=class extends Generantor{
    writing(){
        this.fs.write(
            this.destinationPath('test.txt'),
            Math.random().toString()
        )
    }
}