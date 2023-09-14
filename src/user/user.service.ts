import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto'
import {UpdateUserDto} from './dto/update-user.dto'
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>
    ,@InjectRepository(Profile) private profileRepository: Repository<Profile>,){}


    async createUser(user: CreateUserDto){

        const userFound = await this.userRepository.findOne({
            where: {
                username: user.username
            }
        })

        if (userFound){
            return new HttpException('El usuario ya existe', HttpStatus.CONFLICT)
        }

        const newUser = this.userRepository.create(user) 
        return this.userRepository.save(newUser)
    }

    getUsers(){
        return this.userRepository.find()
    }

    async getUser(id: number){
        const userFound = await this.userRepository.findOne({
            where:{
                id
            }
        })

        if (!userFound){
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return userFound
    }

    async deleteUser(id: number){
        const userFound = await this.userRepository.findOne({where: {id}})

        if (!userFound){
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return this.userRepository.delete({id})
    }

    async updateUser(id:  number, user: UpdateUserDto){
        const userFound = await this.userRepository.findOne({where: {id}})

        if (!userFound){
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        const updateUser = Object.assign(userFound, user)
        return this.userRepository.save(updateUser)

    }

    async createProfile(id: number, profile: CreateProfileDto){
        const userFound = await this.userRepository.findOne({where:{id}})

        if (!userFound){
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        const newProfile = this.profileRepository.create(profile)

        const savedProfile = await this.profileRepository.save(newProfile)

        userFound.profile = savedProfile

        return this.userRepository.save(userFound)
    }

    
    async getUserByName(username: string){
        return await this.userRepository.findOne({where: {username: username}})
    }


}
