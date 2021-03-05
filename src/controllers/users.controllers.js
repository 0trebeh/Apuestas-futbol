const pool = require('../utils/dbconnection');
const { mail } = require('../utils/mailer');
const query = require('../utils/queries');


const getUsers = async (req, res) => {
  const client = await pool.connect();
  try{
    const response = await client.query(query.getUsers);
    res.status(200).json(response.rows);
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

const getUserById = async (req, res) => {
  const client = await pool.connect();
  try{
    const id = parseInt(req.params.id);
    const response = await client.query(query.getUserById, [id]);
    res.status(200).json(response.rows);
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

const getLogin = async (req, res) => {
  const client = await pool.connect();
  try{
    const { username, password } = req.body;
    const response = await client.query(query.getLogin, [
      username, 
      password
    ]);
    if(response.rows[0].user_id){
      res.status(200).json(response.rows);
    }else{
      res.status(404).json('Login failed');
    }
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

const createUser = async (req, res) => {
  const client = await pool.connect();
  try{
    const { username, email, password } = req.body;
    const response = await client.query(query.createUser, [
      username, 
      email,
      password
    ]);

    //send email of welcome
    await mail(username, email)
    .catch(res.json(error));
    res.status(200).json(response.rows);
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

const updateUser = async (req, res) => {
  const client = await pool.connect();
  try{
    const id = parseInt(req.params.id);
    const { username, email, password, avatar } = req.body;

    const response = await client.query(query.updateUser, [
        username,
        email,
        password,
        avatar,
        id
    ]);
    res.status(200).json(response.rows);
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

const deleteUser = async (req, res) => {
  const client = await pool.connect();
  try{
    const id = parseInt(req.params.id);
    await client.query(query.deleteUser, [ id ]);
    res.status(200).json(`User ${id} deleted Successfully`);
  }catch{
    res.status(505);
  }finally{
    client.release(true);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getLogin,
  createUser,
  updateUser,
  deleteUser
};
