const LoginLog = require('../models/loginsLog')



const getUserLoginLogs = async (req, res) =>
{
    try{
        const logs = await LoginLog.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(10)
        .select('ipAddress device browser status timestamp');
        return res.status(200).json(logs);
    }catch(error){
        return res.status(400).json({msg:error.message})
    }
    
}


const getAdminLogs = async (req, res) => 
{
    try{
        const logs = await LoginLog.find({ userId: req.params.userId })
        .sort({ timestamp: -1 })
        .select('ipAddress device browser status timestamp');

     return res.status(200).json(logs); 

    }catch(error){
        return res.status(400).json({msg:error.message})
    }
}


module.exports = { getUserLoginLogs, getAdminLogs };