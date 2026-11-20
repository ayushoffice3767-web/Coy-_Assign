import express from "express";
import cors from "cors";
import db from "./db.js";
const app=express(),port=process.env.PORT||4000;
app.use(cors());app.use(express.json());
const safe=p=>({id:p.id,name:p.name,age:p.age,photo:p.photo,bio:p.bio,city:p.city,college:p.college,interests:JSON.parse(p.interests)});
app.get("/health",(_,res)=>res.json({status:"ok"}));
app.get("/feed",(_,res)=>{const rows=db.prepare("SELECT p.* FROM profiles p LEFT JOIN swipes s ON s.profile_id=p.id WHERE s.profile_id IS NULL ORDER BY p.id").all();res.json({profiles:rows.map(safe),remaining:rows.length});});
app.post("/swipe",(req,res)=>{
 const {profileId,direction}=req.body||{};
 if(typeof profileId!=="string"||!["like","pass"].includes(direction))return res.status(400).json({error:"profileId and direction ('like' or 'pass') are required"});
 const p=db.prepare("SELECT * FROM profiles WHERE id=?").get(profileId);if(!p)return res.status(404).json({error:"Profile not found"});
 if(db.prepare("SELECT 1 FROM swipes WHERE profile_id=?").get(profileId))return res.status(409).json({error:"Already swiped on this profile"});
 const match=db.transaction(()=>{db.prepare("INSERT INTO swipes(profile_id,direction) VALUES(?,?)").run(profileId,direction);if(direction==="like"&&p.liked_current_user){db.prepare("INSERT OR IGNORE INTO matches(profile_id) VALUES(?)").run(profileId);return true;}return false;})();
 res.status(201).json({success:true,direction,isMatch:match,...(match?{match:safe(p)}:{})});
});
app.get("/matches",(_,res)=>res.json({matches:db.prepare("SELECT p.* FROM profiles p JOIN matches m ON m.profile_id=p.id ORDER BY m.created_at DESC").all().map(safe)}));
app.post("/demo/reset",(_,res)=>{db.transaction(()=>{db.prepare("DELETE FROM matches").run();db.prepare("DELETE FROM swipes").run();})();res.json({success:true});});
app.listen(port,()=>console.log(`API listening on http://localhost:${port}`));
