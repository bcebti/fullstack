var express=require("express");
var path=require("path");
var fileUpload=require("express-fileupload");
var mysql=require("mysql");

//@ BangloreComputerEducation.com    Bathinda-9872246056
var app=express();

app.listen(2002,function(){
    console.log("Server Started and ready for listening requests from Client-chrome");
});

//it will find .css and .js files in public folder automatically
app.use(express.static("public"));

//url handler
//req : object which receives data from client
//resp: Object which sends response/result to client
//press ctrl+c to stop the server
app.get("/path",function(req,resp)
{
    //its default type is "Text/html"
        //var filePath=path.resolve();
        //resp.send(filePath); //it gives folder name like __dirname

        var signupFilePath=path.join(process.cwd(),"public","signup.html");
        resp.send(signupFilePath);
    
})
app.get("/",(req,resp)=>{
    var homePage=path.join(__dirname,"public","index.html");
    resp.sendFile(homePage);
})

app.get("/lib",(req,resp)=>{
    var homePage=path.join(__dirname,"public","lib.html");
    resp.sendFile(homePage);
})
app.get("/signup",function(req,resp)
{
    //resp.set("html");
    //resp.send("<h1><center>Signup Here</center></h1>");
    resp.sendFile(__dirname+"/public/signup.html");

})
app.get("/login",function(req,resp)
{
    resp.setHeader("Content-Type","Text/html");    
    resp.write("Hello<br>");
    resp.write("Hi Programmers");
    resp.end();
})
app.get("/info",function(req,resp)
 {
     //global variables
      resp.send("Dir Name="+__dirname+"<br>File Name:="+__filename);  
 })

 app.get("/signup-process",(req,resp)=>{
    //queryString is converted to JSON object by NODE JS
    //req.query : req is an object,query is child object
     //resp.send(req.query);
     console.log(req.query);//json object haing uid and pwd
     resp.send("Welcome:"+req.query.txtUid+" <br>Ur Password:"+req.query.txtPwd);
 })
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 var kuchBhiDbCon=
 {
     host:"localhost",
     user:"root",
     password:"bce",
     database:"2022-jan"
 }

 var dbcon=mysql.createConnection(kuchBhiDbCon);
 dbcon.connect(function(err){
        if(err)
            console.log(err);
            else
            console.log("Badhai Hoooooo");
 });



 app.use(express.urlencoded({'extended':false}));
 //method="post"
    app.use(fileUpload());
 //req.files object will be created

    app.post("/signup-process-2",(req,resp)=>{
    console.log(req.body);
    resp.setHeader("Content-Type","text/html");
    //resp.write("Form Submitted Successfully<br>Welcome: "+req.body.txtUid);
    //resp.write("<br>Password: "+req.body.txtPwd);
    
    //resp.write("<br>Ur Plan="+req.body.plan);
    var socialMediaAccounts=req.body.media;
    //resp.write("<br>Accounts on Social Media="+socialMediaAccounts);
    //resp.write("<br>Residing In="+req.body.city);

    var fileName="nopic.png";
    if(req.files!=null)
    {
    //resp.write("<br>Ur file name="+req.files.profilePic.name);
    var destination=path.join(process.cwd(),"public","uploads",req.files.profilePic.name);
    fileName=req.files.profilePic.name;
    //@www.bangloreComputerEducation.com-Bathinda
    req.files.profilePic.mv(destination,function(err){
        if(err)
            console.log(err);
            else
            console.log("File Uploaded Successfully");
    })
    }
    else
        console.log(req.body);
        var dataAry=[req.body.txtUid,req.body.txtPwd,req.body.plan,req.body.media.toString(),req.body.city,
            fileName,req.body.visited.toString(),req.body.comments];
            dbcon.query("insert into profiles values(?,?,?,?,?,?,?,?,current_date())",dataAry,function(err){
                    if(err)
                    resp.send(err);
                    else
                   resp.send("Record saved Successfully");
            });
 })
 //@www.bangloreComputerEducation.com  - Btahinda-India
 //-------------Updation--------

 app.post("/update-profile",(req,resp)=>
 {
    console.log(req.body);
    resp.setHeader("Content-Type","text/html");
    var socialMediaAccounts=req.body.media;
    var fileName;
    if(req.files!=null)
     {
     var destination=path.join(process.cwd(),"public","uploads",req.files.profilePic.name);
    fileName=req.files.profilePic.name;

    //@www.bangloreComputerEducation.com-Bathinda
    req.files.profilePic.mv(destination,function(err){
        if(err)
            console.log(err);
        else
            console.log("File Uploaded Successfully");
    })
    }
    else
        fileName=req.body.jasoos;
        
        
        console.log(req.body);
       var dataAry=[req.body.txtPwd,req.body.plan,req.body.media.toString(),req.body.city,
            fileName,req.body.visited.toString(),req.body.comments,req.body.txtUid];
            //use col. names in update query
            dbcon.query("update profiles set pwd=?,plan=?,media=?,city=?,picpath=?,visited=?,dilkibaat=? where emailid=?",dataAry,function(err){
                    if(err)
                    resp.send(err);
                    else
                   resp.send("Record Updated Successfully");
            });
 })

 app.get("/lib-book",(req,resp)=>
 {
     console.log(req.query);
     var dataAry=[0,req.query.roll,req.query.book];
     dbcon.query("insert into lib values(?,?,?)",dataAry,function(err){
        if(err)
        resp.send(err);
        else
       resp.send("Record saved Successfully");
});
 })


 app.all("/showAll",(req,resp)=>
 {
    dbcon.query("select * from profiles",(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
 });

 app.all("/showSome",(req,resp)=>
 {
    dbcon.query("select * from profiles where city=?",[req.query.selCity],(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
 });

 app.post("/deleteRecord",(req,resp)=>
 {
    dbcon.query("delete from profiles where emailid=?",[req.body.txtUid],(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result.affectedRows+" Records Deleted"); //it send JSON Array
    })
 });

 app.get("/deleteAjax",(req,resp)=>
 {
    dbcon.query("delete from profiles where emailid=?",[req.query.x],(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result.affectedRows+" Records Deleted"); //it send JSON Array
    })
 });

 

 //@www.bangloreComputerEducation.com-Bathinda

 app.get("/fetchARecord",(req,resp)=>{
    console.log(req.query.kuchBhiUid);
    dbcon.query("select * from profiles where emailid=?",[req.query.kuchBhiUid],(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
 })

 app.get("/fetchCities",(req,resp)=>{
       
    dbcon.query("select distinct city from profiles",(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
 })


