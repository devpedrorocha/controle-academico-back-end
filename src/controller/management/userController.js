import users from "../../model/User.js";
import bcrypt from "bcrypt";
import crud from "../crud.js";
import jwt from "jsonwebtoken";
import blacklist from "../../../redis/manipulation-blacklist.js";
import enrolledClass from "../../model/EnrolledClass.js"
import classes from "../../model/Class.js";
import crypto from "crypto"
import moment from "moment";
import {adicionaChave} from "../../../redis/manipula-allowlist.js";
import role from "../../model/Role.js"

//fazer a logica de aparecer os papeis no front (aparecer só os existentes)

function criaTokenJWT (usuario) {
    const payload = { id: usuario._id, cpf: usuario.cpf };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "60m" });
    return token
}

async function criaTokenOpaco(usuario) {
    const tokenOpaco = crypto.randomBytes(24).toString("hex")
    const dataDeExpiracao = moment().add(5, "d").unix()
    await adicionaChave(tokenOpaco, usuario._id.toString(), dataDeExpiracao)
    return tokenOpaco
}

const createUser = async (req, res) => {
    const body = req.body;
    if (!body.name) return res.status(400).send("Corpo da requisição incorreto");
    const salt = bcrypt.genSaltSync(12);
    const user = await crud.create(body, users);
    if (user.message) return res.status(400).send(user.message)
    res.status(201).send({success: true, data:user});
    const newPassword = bcrypt.hashSync(user.password, salt);
    user.password = newPassword;
    await user.save();
}

const readUser = async (req, res) => {
    const checkResponse = await crud.read(users, 'register');
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(200).send({success: true, data:checkResponse});
}

const readUsersById = async (req, res) => {
    const { id } = req.params;
    const checkResponse = await crud.readById(id, users);
    if (checkResponse.message == 'não encontrado') return res.status(404).send(checkResponse.message);
    if (checkResponse.error) return res.status(400).send(checkResponse.error)
    res.status(200).json({success: true, data: checkResponse});
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, users);
    if (check.message) return res.status(404).send(check.message);
    return res.status(204).send();
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {register} = await users.findOne({_id: id})
        if(register.length <= 0){
            const check = await crud.remove(id, users);
            if (check.message) return res.status(404).send(check.message);
            return res.status(204).send();  
        } else {
            for(let idRegister in register){
                const enrolled  =  await enrolledClass.findOne({_id: register[idRegister]})
                const idEnrolled = enrolled.classGroup
                const findClass = await classes.findOne({_id: idEnrolled})
                const classesUpdate = findClass.enrolled.filter(element => {
                    return element.toString() !== register[idRegister].toString()
                })
                const teste = await classes.findOneAndUpdate({_id: findClass._id }, {enrolled: classesUpdate})
                await teste.save()
                await enrolledClass.findByIdAndRemove(register[idRegister])
            }
            const check = await crud.remove(id, users);
            if (check.message) return res.status(404).send(check.message);
            return res.status(204);
        }
    } catch (error) {
        res.status(400).send(error)
    }

}
const loginUser = async (req, res) => {
    try {
        const { cpf, password } = req.body;
        const checkUser = await users.findOne({ cpf: cpf });
        const passwordCheck = bcrypt.compareSync(password, checkUser.password);
        if (!passwordCheck) return res.status(400).send("Email ou senha incorretos");
        const accessToken = criaTokenJWT(checkUser)
        res.header('Authorization', accessToken);
        const refreshToken = await criaTokenOpaco(checkUser);
        res.header('Refresh-token', refreshToken);
        let userUpdate = await users.findByIdAndUpdate(checkUser._id, {
            authKey: accessToken
        }).populate({path: "register", populate: {path: "classGroup"}})
        const arrayDeClassGroup = []
        for(let enrolledIndex in userUpdate.register) {
            const roleRegister = await role.findById(userUpdate.register[enrolledIndex].role);
            const classGroupRegister = await classes.findById(userUpdate.register[enrolledIndex].classGroup).populate("subject")
            arrayDeClassGroup.push({classGroup: classGroupRegister, role: roleRegister})
        }
        res.status(200).send({success: true, data: userUpdate, register: arrayDeClassGroup});
    } catch (err) {
        res.status(400).send("Email ou senha incorretoss");
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.token;
        await blacklist.addTokenInBlacklist(token);
        res.status(201).send({success: true, data: "logout feito"})
    } catch (error) {
        res.status(400).send(error)
    }
}
const userControll = {
    createUser,
    updateUser,
    readUser,
    readUsersById,
    deleteUser,
    loginUser,
    logoutUser
}


export default userControll;


/*      static registerUser = (res, req) => {
         //recebe o papel e a turma e procura no banco 
     } */ 