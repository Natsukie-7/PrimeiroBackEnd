import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository"
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid"
import { error } from "console";
import { sign } from "jsonwebtoken";


class UsersServices {
    private usersRepository: UsersRepository;


    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async create({ name, email, password }: ICreate) {

        const findUsers = await this.usersRepository.findUsersByEmail(email)

        if (findUsers) {
            throw new Error('Usuário Existente!!!!');

        };

        const hashPassword = await hash(password, 10)

        const create = await this.usersRepository.create({
            name,
            email,
            password: hashPassword,
        })
        return create;
    }

    async update({ name, newPassword, oldPassword, avatar_url, user_id }: IUpdate) {
        let password
        if (oldPassword && newPassword) {
            const findUserById = await this.usersRepository.findUsersByid(user_id);
            if (!findUserById) {
                throw new Error('Usuário não encontrado')
            }

            const passwordMatch = compare(oldPassword, findUserById.password);
            if (!passwordMatch) {
                throw new Error('Senha Invalida')
            }
            password = await hash(newPassword, 10);
            await this.usersRepository.updatePassword(password, user_id)
        }
        if (avatar_url) {

            const uploadImage = avatar_url?.buffer;
            const uploadS3 = await s3
                .upload({
                    Bucket: "testedeservidor",
                    Key: `${uuid()}-${avatar_url?.originalname}`,
                    // ACL: "public-read",
                    Body: uploadImage,
                })
                .promise();
            await this.usersRepository.update(name, uploadS3.Location, user_id)
        }
        return {
            message: "User Update Sucessfully"
        }
    }

    async auth(email: string, password: string) {
        const findUser = await this.usersRepository.findUsersByEmail(email)
        if (!findUser) {
            throw new Error("User Password Invalid!....")
        }

        const passwordMatch = compare(password, findUser.password);

        if (!passwordMatch) {
            throw new Error("User Password Invalid!....")
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
        if (!secretKey) {
            throw new Error('Theres no token key')
        }

        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15,
        });

        return {
            token,
            user: {
                name: findUser.name,
                email: findUser.email,
            }
        }
    }
}

export { UsersServices }