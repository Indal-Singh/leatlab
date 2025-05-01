import { ApiResponse } from "../utils/ApiResponse.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import config from "../config.js";


const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res
                .status(401)
                .json(
                    new ApiResponse(
                        401,
                        null,
                        "All fileds Are required."
                    )
                );
        }

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            res.status(400).json(new ApiResponse(400, "User Already Exits"));
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                role: UserRole.USER
            }
        })

        const token = jwt.sign({
            id: newUser.id
        }, config.jwt_secret, {
            expiresIn: config.jwt_exipry
        })


        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })

        res.status(201).json(new ApiResponse(201, {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        }, "User Craeted Succcessfuly"))


    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json(new ApiResponse(
            500,
            null,
            "Error creating user"
        ))
    }




}

const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res
                .status(401)
                .json(
                    new ApiResponse(
                        401,
                        null,
                        "All fileds Are required."
                    )
                );
        }
        const existingUser = await db.user.findUnique({
            where:{
                email: email
            }
        })
        if (!existingUser) {
            return res.status(400).json(new ApiResponse(400, "User Not Found"));
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json(new ApiResponse(400, "Invalid Password"));
        }
        const token = jwt.sign({
            id: existingUser.id
        }, config.jwt_secret, {
            expiresIn: config.jwt_exipry
        })
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        res.status(200).json(new ApiResponse(200, {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
                image: existingUser.image
            }
        }, "Login Successful"))

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json(new ApiResponse(
            500,
            null,
            "Error creating user"
        ))
        
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        })
        res.status(200).json(new ApiResponse(200, null, "Logout Successful"))
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json(new ApiResponse(
            500,
            null,
            "Error creating user"
        ))
    }
}
const getUser = async (req, res) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: req.user.id
            }
        })
        res.status(200).json(new ApiResponse(200, {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        }, "User Fetched Successfully"))
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json(new ApiResponse(
            500,
            null,
            "Error creating user"
        ))
    }
}

export { register , login, logout, getUser }