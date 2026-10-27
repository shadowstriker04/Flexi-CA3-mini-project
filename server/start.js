import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({path:'server/.env'});
const app=express();
const port=Number(process.env.PORT||4000);
const issues=[
 {id:'CC-1048',title:'Water leak in Science Block',category:'Facilities',location:'Science Block · Floor 2',priority:'HIGH',status:'IN_PROGRESS',reporter:'Ananya Rao',assignee:'Arjun Mehta',created:'Today, 09:42'},
 {id:'CC-1047',title:'Projector not working in Room 204',category:'IT Services',location:'Engineering · Room 204',priority:'MEDIUM',status:'ACKNOWLEDGED',reporter:'Kabir Shah',assignee:'Priya Nair',created:'Yesterday, 16:18'},
 {id:'CC-1046',title:'Add evening shuttle stop',category:'Transport',location:'North Campus',priority:'LOW',status:'OPEN',reporter:'Maya Iyer',assignee:'Unassigned',created:'Yesterday, 11:05'},
 {id:'CC-1045',title:'Cafeteria card reader offline',category:'Dining',location:'Main Cafeteria',priority:'HIGH',status:'RESOLVED',reporter:'Rohan Das',assignee:'Arjun Mehta',created:'Oct 24, 14:30'}
];
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173',credentials:true}));
app.use(express.json());
app.get('/api/v1/health',(req,res)=>res.json({ok:true,service:'CampusCare'}));
app.post('/api/v1/auth/login',(req,res)=>{const email=String(req.body?.email||'').trim().toLowerCase();if(!email)return res.status(400).json({message:'Email is required'});const token=jwt.sign({email,role:'STUDENT'},process.env.JWT_SECRET||'development-only-secret',{expiresIn:'30m'});res.json({token,user:{name:'Aarav Sharma',email,role:'STUDENT'}})});
app.get('/api/v1/issues',(req,res)=>{const data=req.query.status?issues.filter(x=>x.status===req.query.status):issues;res.json({data,meta:{page:1,total:data.length}})});
app.post('/api/v1/issues',(req,res)=>{if(!req.body?.title||!req.body?.location)return res.status(400).json({message:'title and location are required'});const issue={id:'CC-'+(1050+issues.length),title:String(req.body.title),category:String(req.body.category||'Other'),location:String(req.body.location),priority:String(req.body.priority||'MEDIUM'),status:'OPEN',reporter:'Aarav Sharma',assignee:'Unassigned',created:'Just now'};issues.unshift(issue);res.status(201).json({data:issue})});
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Internal server error'})});
app.listen(port,'127.0.0.1',()=>console.log('CampusCare API listening on http://127.0.0.1:'+port));
setInterval(()=>{},2147483647);
