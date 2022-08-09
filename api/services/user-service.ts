import {v4 as uuidv4} from 'uuid'
import {UserDocument} from '@shared'
import {databaseClient} from "../model/database";
import * as dotenv from "dotenv";
dotenv.config({path: '.env.development'})


class UserService {
    async collection() {
        return databaseClient.db(process.env.MONGODB_DATABASE).collection<UserDocument>('users')
    }

    async createUser(name: string, gitHubUserId: number): Promise<UserDocument> {
        const user: UserDocument = {
            id: uuidv4(),
            name,
            tokenVersion: 0,
            gitHubUserId: gitHubUserId.toString()
        }

        const collection = await this.collection()
        const result = await collection.insertOne(user)
        if (result.acknowledged) return user
        else throw new Error('Error creating user')
    }

    async getUserByGitHubId(gitHubUserId: number){
        const collection = await this.collection()
        return collection.findOne({gitHubUserId: gitHubUserId.toString()})
    }

    async getUserById(id: string){
        const collection = await this.collection()
        return collection.findOne({id})
    }

    async increaseTokenVersion(userId: string){
        const collection = await this.collection()
        const result = await collection.findOneAndUpdate({id: userId}, {$inc: {tokenVersion: 1}})
        if (result.ok) return result.value

        throw new Error('Error while incrementing token version')
    }

}

export default new UserService()