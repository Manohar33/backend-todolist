const express=require("express");
const bodyparser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser:true});

app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));
app.set("view engine","ejs");
const itemSchema=new mongoose.Schema({
    name:String
});
const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
});
const List=mongoose.model("List",listSchema);
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({
    name:"welcome to todo-list"
});
const item2=new Item({
    name:"hit the + button to add a new item"
});
const item3=new Item({
    name:"<--hit this to delete an item"
});
app.get("/",function(req,res){ 
   
    Item.find({},function(err,found){
        if(found.length===0){
            Item.insertMany([item1,item2.item3],function(err){
                if(err){
                     console.log(err);
                 }else{
                     console.log("done");
                 }
             });
             res.redirect("/")
        }
        else{
            res.render("index",{
                listtitle:"Today",newitem:found
            });
        }
        
    });
    
    
});
app.post("/",function(req,res){
    
    var itemm=req.body.nameitem;
    const listname=req.body.list;


    const gh=new Item({
        name:itemm
    });
    if(listname=="Today"){
        gh.save();
    res.redirect("/");
    }else{
        List.findOne({name:listname},function(err,fg){
            fg.items.push(gh);
            fg.save();
            res.redirect("/"+ listname);
        });
    }
    
    
});
app.get("/:dyn",function(req,res){
    const dyn=_.capitalize(req.params.dyn);
    List.findOne({name:dyn},function(err,jk){
        if(!err){
            if(!jk){
                const list=new List({
                    name:dyn,
                    items:[item1,item2,item3]
                });
                list.save();
                res.redirect("/"+ dyn);
            }else{
                res.render("index",{
                    listtitle:jk.name,newitem:jk.items
                });
            }
            
        }
    });
    

});
app.post("/delete",function(req,res){
    const sa=req.body.box;
    const listName=req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(sa,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:sa}}},function(err,kl){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }


    
});



app.listen(3050,function(){
    console.log("server is running");
});