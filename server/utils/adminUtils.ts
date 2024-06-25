import Admin from '../models/adminModel.js';

// Get admin by ObjectID
const getAdmin = async (adminID) => {
    try {
        const admin = await Admin.findById(adminID);
        if (!admin) return null;
        return admin;
    } catch (error) {
        return null;
    }
};

export default getAdmin;
